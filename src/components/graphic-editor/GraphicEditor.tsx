import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { AppState } from '../../redux/store';
import Tool, { Canvas, Ctx2d, RendererToolbox } from '../../tools/Tool';
import { HistoryAction } from '../../redux/interfaces/HistoryAction';
import Tools from '../../tools/Tools';
import { ImagePage } from '../../redux/interfaces/Page';
import Editor, { EditorType } from '../editor/Editor';

const mapStateToProps = ({ page, tools }: AppState) => {
  const { selectedToolId, setting } = tools;
  const selectedPage = page.page as ImagePage;

  return {
    history: selectedPage?.history || [],
    pageSettings: selectedPage?.settings,
    pageId: page.id,
    image: selectedPage?.data || '',
    selectedToolId,
    setting,
    selectedPage,
    pages: page.imagePages.length,
  };
};

type Props = ReturnType<typeof mapStateToProps>;

class GraphicEditor extends Component<Props> {
  private editor?: EditorType;

  private handleMouseMove = (toolbox: RendererToolbox) => {
    if (this.canDraw(toolbox)) {
      requestAnimationFrame(() => {
        this.tool.onMouseMove(toolbox);
      });
    }
  };

  private canDraw({ posX, posY, ctx }: RendererToolbox) {
    return (
      !this.isDrawingInTheSamePoint(posX, posY) &&
      !this.isDrawingOutsideTheCanvas(posX, posY, ctx.canvas)
    );
  }

  private isDrawingInTheSamePoint(x: number, y: number) {
    return (
      this.lastDrawnAction &&
      x === this.lastDrawnAction.x &&
      y === this.lastDrawnAction.y
    );
  }

  private get lastDrawnAction() {
    return this.props.history[this.props.history.length - 1];
  }

  private isDrawingOutsideTheCanvas(x: number, y: number, canvas: Canvas) {
    return x < 0 || y < 0 || x > canvas.width || y > canvas.height;
  }

  private get tool(): Tool {
    return Tools.all[this.props.selectedToolId];
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedToolId !== this.props.selectedToolId) {
      this.handleToolChange();
    }

    if (prevProps.pageSettings.scale !== this.props.pageSettings.scale) {
      this.rerenderCanvas();
    }

    if (prevProps.pageId !== this.props.pageId) {
      this.rerenderCanvas();
      this.handleToolChange();
    }
  }

  private handleToolChange = () => {
    this.editor?.useToolbox((toolbox) => {
      this.tool.prepareCanvas(toolbox);
    });
  };

  private rerenderCanvas = debounce(() => {
    this.editor?.useToolbox(({ ctx }) => {
      this.drawHistory(ctx);
    });
  }, 50);

  private drawHistory(ctx: Ctx2d) {
    const history = [...this.props.history];

    requestAnimationFrame(() => {
      this.prepareCanvas(ctx, history[0]);

      history.forEach((action, index) => {
        if (this.wasToolChanged(action, history[index - 1])) {
          this.changeTool(ctx, action);
        }

        this.drawHistoricalAction(ctx, action);
      });
    });
  }

  private prepareCanvas(ctx: Ctx2d, action?: HistoryAction) {
    if (ctx && action) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.changeTool(ctx, action);
    }
  }

  private changeTool(ctx: Ctx2d, action: HistoryAction) {
    const tool = Tools.all[action.toolId];

    tool.updateSettings(this.getHistoricalRendererToolbox(ctx, action));
    tool.prepareCanvas(this.getHistoricalRendererToolbox(ctx, action));
  }

  private drawHistoricalAction(ctx: Ctx2d, action: HistoryAction) {
    const tool = Tools.all[action.toolId];
    const toolbox = this.getHistoricalToolbox(ctx, action);

    tool.historyAction(toolbox);
  }

  private getHistoricalRendererToolbox(ctx: Ctx2d, action: HistoryAction) {
    return Tool.getRendererToolbox(this.getHistoricalToolbox(ctx, action));
  }

  private getHistoricalToolbox(ctx: Ctx2d, action: HistoryAction) {
    return {
      ctx,
      history: action,
      actualPageSettings: this.props.pageSettings,
      step: action.step,
    };
  }

  private wasToolChanged(action?: HistoryAction, prevAction?: HistoryAction) {
    return action?.toolId !== prevAction?.toolId;
  }

  public render() {
    return (
      <>
        <Editor
          instance={(editor: EditorType) => {
            this.editor = editor;
          }}
          onMouseMove={debounce(this.handleMouseMove, 1)}
          onMouseEnter={this.tool.onMouseEnter}
          onMouseLeave={this.tool.onMouseLeave}
          onMouseUp={this.tool.onMouseUp}
          onMouseDown={this.tool.onMouseDown}
        />
      </>
    );
  }
}

export default connect(mapStateToProps)(GraphicEditor);
