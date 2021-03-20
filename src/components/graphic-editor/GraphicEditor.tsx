import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { AppState } from '../../redux/store';
import Tool from '../../tools/Tool';
import './GraphicEditor.scss';
import { addHistoryActions } from '../../redux/actions/PageActions';
import { HistoryAction } from '../../redux/interfaces/HistoryAction';
import Tools from '../../tools/Tools';

const mapStateToProps = ({ page, tools }: AppState) => {
  const { history, image, id, pages } = page;
  const { selectedToolsId, setting } = tools;

  return { history, pageId: id, pages, image, selectedToolsId, setting };
};

const dispatchToProps = {
  addHistoryActions,
};

type ReduxType = ReturnType<typeof mapStateToProps> & typeof dispatchToProps;

type State = {
  scale: number;
};

class GraphicEditor extends Component<ReduxType, State> {
  private imageRef: React.RefObject<HTMLImageElement>;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;
  private canDraw = false;
  private localHistory: HistoryAction[] = [];

  public constructor(props: ReduxType) {
    super(props);

    this.state = {
      scale: 1,
    };

    this.imageRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  public componentDidMount = () => {
    const canvas = this.canvasRef.current;

    this.ctx = canvas?.getContext('2d') || null;
    this.setCanvasSize();
  };

  private handleResize = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      const scaleDirection = Math.sign(e.deltaY) > 0 ? 1.05 : 0.95;
      this.setState((prev) => ({
        ...prev,
        scale: prev.scale * scaleDirection,
      }));
    }
  };

  private stopDrawing = () => {
    if (this.canDraw) {
      this.handleStopDrawing();
    }
  };

  private handleStopDrawing = () => {
    if (!this.ctx) {
      return;
    }

    this.props.addHistoryActions([
      ...this.localHistory,
      {
        id: this.props.history.length + this.localHistory.length,
        scale: this.state.scale,
        settings: this.props.setting,
        toolId: Tools.FINISH_DRAW_TOOL,
        x: 0,
        y: 0,
      },
    ]);

    this.localHistory = [];
    this.tool.finishDrawing(this.ctx);
  };

  private get tool(): Tool {
    return Tools.all[this.props.selectedToolsId];
  }

  private finishDrawing = () => {
    if (!this.ctx) {
      return;
    }

    this.canDraw = false;
    this.handleStopDrawing();
  };

  private startDrawing = () => {
    if (!this.ctx) {
      return;
    }

    this.canDraw = true;
    this.tool.finishDrawing(this.ctx);
    this.tool.beginDrawing(this.ctx);
  };

  private continueDrawing = () => {
    if (this.canDraw && this.ctx) {
      this.tool.finishDrawing(this.ctx);

      this.tool.beginDrawing(this.ctx);
    }
  };

  private drawTool = debounce((event: React.MouseEvent) => {
    const { setting, selectedToolsId } = this.props;
    const { scale } = this.state;
    const img = this.imageRef.current;

    if (this.canDraw && this.ctx && img) {
      const rect = this.ctx.canvas.getBoundingClientRect();
      const x = Math.floor(event.pageX - rect.left);
      const y = Math.floor(event.pageY - rect.top);
      const lastDrawedAction = this.localHistory[this.localHistory.length - 1];
      const isDrawingInTheSamePoint =
        lastDrawedAction &&
        x === lastDrawedAction.x &&
        y === lastDrawedAction.y;

      if (isDrawingInTheSamePoint) {
        return;
      }

      this.tool.setSettings({
        ...setting,
        brushSize: setting.brushSize * scale,
      });

      requestAnimationFrame(() => {
        if (this.ctx) {
          this.tool.prepareCanvas(this.ctx);
          this.tool.draw(x, y, this.ctx);
        }
      });

      this.localHistory.push({
        id: this.props.history.length + this.localHistory.length,
        settings: { ...setting },
        toolId: selectedToolsId,
        scale,
        x,
        y,
      });
    }
  }, 1);

  public componentDidUpdate = (prevProps: ReduxType, prevState: State) => {
    if (this.state.scale !== prevState.scale) {
      this.rescaleEditor();
    }

    if (prevProps.setting !== this.props.setting) {
      debounce(() => {
        this.tool.setSettings(this.props.setting);
        if (this.ctx) this.tool.prepareCanvas(this.ctx);
      }, 50);
    }

    if (prevProps.pageId !== this.props.pageId) {
      this.rerenderCanvas();
    }
  };

  public rescaleEditor = () => {
    const { scale } = this.state;
    const canvas = this.canvasRef.current;
    const img = this.imageRef.current;

    if (!canvas || !img || !this.ctx) {
      return;
    }

    const transformValue = `scale(${scale}, ${scale})`;

    img.style.setProperty('transform', transformValue);
    canvas.style.setProperty('transform', transformValue);

    canvas.style.setProperty('width', `${img.naturalWidth}px`);
    canvas.style.setProperty('height', `${img.naturalHeight}px`);

    this.setCanvasSize();
    this.setState((prev) => ({ ...prev, scaleNeedsUpdate: false }));
  };

  public setCanvasSize = () => {
    const canvas = this.canvasRef.current;
    const img = this.imageRef.current;
    const { scale } = this.state;

    if (!canvas || !img) {
      return;
    }

    const canvasSize = {
      width: img.naturalWidth * scale,
      height: img.naturalHeight * scale,
    };

    canvas.setAttribute('width', `${canvasSize.width}`);
    canvas.setAttribute('height', `${canvasSize.height}`);

    this.rerenderCanvas();
  };

  private rerenderCanvas = debounce(() => {
    const { ctx } = this;

    if (!ctx) {
      return;
    }

    requestAnimationFrame(() => {
      const history = [...this.props.history];

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      history.forEach(({ toolId, x, y, settings, scale }) => {
        const tool = Tools.all[toolId];

        if (toolId === Tools.FINISH_DRAW_TOOL) {
          Tools.all[0].finishDrawing(ctx);
          return;
        }

        tool.setSettings({
          ...settings,
          brushSize: settings.brushSize * this.state.scale,
        });
        tool.prepareCanvas(ctx);
        tool.draw(
          Math.floor((x / scale) * this.state.scale),
          Math.floor((y / scale) * this.state.scale),
          ctx
        );
      });
    });
  }, 50);

  public render() {
    const { image } = this.props;

    return (
      <div className="graphic-editor">
        <img
          draggable="false"
          src={image}
          ref={this.imageRef}
          alt=""
          onWheel={this.handleResize}
        />
        <canvas
          draggable="false"
          onWheel={this.handleResize}
          onMouseLeave={this.stopDrawing}
          onMouseUp={this.finishDrawing}
          onMouseDown={this.startDrawing}
          onMouseEnter={this.continueDrawing}
          onMouseMove={this.drawTool}
          ref={this.canvasRef}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchToProps)(GraphicEditor);
