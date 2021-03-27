/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ImagePage } from '../../redux/interfaces/Page';
import { AppState } from '../../redux/store';
import { Ctx2d, RendererToolbox } from '../../tools/Tool';
import mousePositionToCanvasPosition from '../../utilities/mousePositionToCanvas';
import './Editor.scss';
import {
  addHistoryActions,
  editPageSettings,
} from '../../redux/actions/PageActions';

const mapStateToProps = ({ page, tools }: AppState) => {
  const { selectedToolId, setting } = tools;
  const selectedPage = page.page as ImagePage;

  return {
    history: selectedPage?.history || [],
    pageSettings: selectedPage?.settings,
    image: selectedPage?.data || '',
    selectedToolId,
    setting,
    selectedPage,
    pages: page.imagePages.length,
  };
};

const dispatchToProps = {
  addHistoryActions,
  editPageSettings,
};

type Props = typeof dispatchToProps &
  ReturnType<typeof mapStateToProps> & {
    instance: (editor: Editor) => void;
    onMouseMove: (toolbox: RendererToolbox) => void;
    onMouseEnter: (toolbox: RendererToolbox) => void;
    onMouseLeave: (toolbox: RendererToolbox) => void;
    onMouseUp: (toolbox: RendererToolbox) => void;
    onMouseDown: (toolbox: RendererToolbox) => void;
  };

type State = {
  x: number;
  y: number;
};

class Editor extends Component<Props, State> {
  private canvas = React.createRef<HTMLCanvasElement>();
  private image = React.createRef<HTMLImageElement>();
  private ctx?: Ctx2d;

  constructor(props: Props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
    };
  }

  public componentDidMount = () => {
    const canvas = this.canvas.current;
    this.ctx = canvas?.getContext('2d') || undefined;

    this.props.instance(this);
  };

  public componentDidUpdate = (prevProps: Props) => {
    if (this.props.pageSettings.scale !== prevProps.pageSettings.scale) {
      this.rescaleEditor();
    }

    if (this.props.pageSettings.rotation !== prevProps.pageSettings.rotation) {
      this.rotateEditor();
    }

    if (this.props.image !== prevProps.image) {
      this.rescaleEditor();
    }
  };

  public rescaleEditor = () => {
    const { scale } = this.props.pageSettings;
    const canvas = this.canvas.current;
    const img = this.image.current;

    if (!canvas || !img || !this.ctx) {
      return;
    }

    const transformValue = `scale(${scale}, ${scale})`;
    img.style.setProperty('transform', transformValue);
    canvas.style.setProperty('transform', transformValue);

    this.setCanvasSize();
    this.rotateEditor();

    this.setState((prev) => ({ ...prev, scaleNeedsUpdate: false }));
  };

  public setCanvasSize = () => {
    const canvas = this.canvas.current;
    const img = this.image.current;
    const { scale } = this.props.pageSettings;

    if (!canvas || !img) {
      return;
    }

    const canvasSize = {
      width: img.naturalWidth * scale,
      height: img.naturalHeight * scale,
    };

    canvas.setAttribute('width', `${canvasSize.width}`);
    canvas.setAttribute('height', `${canvasSize.height}`);
    canvas.style.setProperty('width', `${img.naturalWidth}px`);
    canvas.style.setProperty('height', `${img.naturalHeight}px`);
  };

  private rotateEditor = () => {
    if (this.image.current && this.ctx) {
      const image = this.image.current;
      const transform = image.style.getPropertyValue('transform');
      const rotation = `rotate(${this.props.pageSettings.rotation}deg)`;

      image.style.setProperty(
        'transform',
        transform.split('rotate')[0] + rotation
      );

      this.ctx?.canvas.style.setProperty(
        'transform',
        transform.split('rotate')[0] + rotation
      );
    }
  };

  private handleResize = (e: React.WheelEvent) => {
    const scaleDirection = Math.sign(e.deltaY) > 0 ? 1.05 : 0.95;
    const scale = this.props.pageSettings.scale ?? 1;

    this.props.editPageSettings({ scale: scale * scaleDirection });
  };

  private handleMouseUp = (e: React.MouseEvent) => {
    this.updateState(e);

    if (this.toolbox) {
      this.props.onMouseUp(this.toolbox);
    }
  };

  private handleMouseDown = (e: React.MouseEvent) => {
    this.updateState(e);

    if (this.toolbox) {
      this.props.onMouseDown(this.toolbox);
    }
  };

  private handleMouseMove = (e: React.MouseEvent) => {
    this.updateState(e);

    if (this.toolbox) {
      this.props.onMouseMove(this.toolbox);
    }
  };

  private handleMouseEnter = (e: React.MouseEvent) => {
    this.updateState(e);

    if (this.toolbox) {
      this.props.onMouseEnter(this.toolbox);
    }
  };

  private handleMouseLeave = (e: React.MouseEvent) => {
    this.updateState(e);

    if (this.toolbox) {
      this.props.onMouseLeave(this.toolbox);
    }
  };

  public updateState = (e: React.MouseEvent) => {
    if (this.ctx) {
      const { rotation } = this.props.pageSettings;

      this.setState(mousePositionToCanvasPosition(this.ctx, e, rotation));
    }
  };

  public useToolbox(callback: (toolbox: RendererToolbox) => void) {
    if (this.toolbox) {
      callback(this.toolbox);
    }
  }

  private get toolbox() {
    if (this.ctx && this.image.current) {
      return {
        ctx: this.ctx,
        canvas: this.ctx.canvas,
        image: this.image.current,
        setting: this.props.setting,
        page: this.props.selectedPage,
        posX: this.state.x,
        posY: this.state.y,
        noteInHistory: this.noteInHistory,
        updateGlobalSettings: this.props.editPageSettings,
      };
    }

    return null;
  }

  private noteInHistory = (step?: string) => {
    this.props.addHistoryActions([
      {
        id: this.props.history.length,
        pageSettings: this.props.pageSettings,
        settings: this.props.setting,
        toolId: this.props.selectedToolId,
        x: this.state.x,
        y: this.state.y,
        step,
      },
    ]);
  };

  render() {
    const { image } = this.props;

    return (
      <div
        className="editor"
        onWheel={this.handleResize}
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
        draggable="false"
      >
        <img
          src={image}
          ref={this.image}
          alt=""
          onWheel={this.handleResize}
          onDragStart={() => false}
          draggable="false"
        />

        <div className="editor__image-move-blocker" />

        <canvas
          onMouseMove={this.handleMouseMove}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          ref={this.canvas}
          draggable="false"
        />
      </div>
    );
  }
}

export type EditorType = Editor;
export default connect(mapStateToProps, dispatchToProps)(Editor);
