import Point from "./point.model.js";
import Tool from "./tool.class.js";
import { getMouseCoordsOnCanvas, findDistane } from "./utility.js";
import Fill from "./fill.class.js";
export default class Paint {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = canvas.getContext("2d");
    this.undoStack = [];
    this.undoLimit = 10;
  }
  set activeTool(tool) {
    this.tool = tool;
  }
  set lineWidth(linewidth) {
    this.lineWidthVar = linewidth;
    this.context.lineWidth = this.lineWidthVar;
  }
  set brushSize(brushSize) {
    this._brushSize = brushSize;
    this.context.lineWidth = this._brushSize;
  }
  set selectedColor(color) {
    this._color = color;
    this.context.strokeStyle = this._color;
  }

  //Method for Canvas Event Listeners
  init() {
    this.canvas.onmousedown = (e) => this.onMouseDown(e);
  }
  //On Click Mouse
  onMouseDown(e) {
    this.savedData = this.context.getImageData(
      0,
      0,
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );
    if (this.undoStack.length >= this.undoLimit) {
      this.undoStack.shift();
    } else {
      this.undoStack.push(this.savedData);
    }
    this.canvas.onmousemove = (e) => this.onMouseMove(e);
    document.onmouseup = (e) => this.onMouseUp(e);
    this.startPos = getMouseCoordsOnCanvas(e, this.canvas);
    if (this.tool == Tool.tool_pencil || this.tool == Tool.tool_brush) {
      this.context.beginPath();
      this.context.moveTo(this.startPos.x, this.startPos.y);
    } else if (this.tool == Tool.tool_paint_bucket) {
      new Fill(this.canvas, this.startPos, this._color);
    } else if (this.tool == Tool.tool_eraser) {
      this.context.clearRect(
        this.startPos.x,
        this.startPos.y,
        this._brushSize,
        this._brushSize
      );
    }
  }
  onMouseMove(e) {
    this.currentPos = getMouseCoordsOnCanvas(e, this.canvas);
    switch (this.tool) {
      case Tool.tool_line:
      case Tool.tool_rectangle:
      case Tool.tool_circle:
      case Tool.tool_triangle:
        this.drawShape();
        break;
      case Tool.tool_pencil:
        this.drawFreeLine(this.lineWidthVar);
        break;
      case Tool.tool_brush:
        this.drawFreeLine(this._brushSize);
        break;
      case Tool.tool_eraser:
        this.context.clearRect(
          this.currentPos.x,
          this.currentPos.y,
          this._brushSize,
          this._brushSize
        );

      default:
        break;
    }
  }
  //Release Mouse
  onMouseUp(e) {
    this.canvas.onmousemove = null;
    document.onmouseup = null;
  }
  drawShape() {
    this.context.putImageData(this.savedData, 0, 0);
    this.context.beginPath();
    console.log(this.tool);
    if (this.tool == Tool.tool_line) {
      this.context.moveTo(this.startPos.x, this.startPos.y);
      this.context.lineTo(this.currentPos.x, this.currentPos.y);
    } else if (this.tool == Tool.tool_rectangle) {
      this.context.rect(
        this.startPos.x,
        this.startPos.y,
        this.currentPos.x - this.startPos.x,
        this.currentPos.y - this.startPos.y
      );
    } else if (this.tool == Tool.tool_circle) {
      let distance = findDistane(this.startPos, this.currentPos);
      this.context.arc(
        this.startPos.x,
        this.startPos.y,
        distance,
        0,
        2 * Math.PI,
        false
      );
    } else if (this.tool == Tool.tool_triangle) {
      this.context.moveTo(
        this.startPos.x + (this.currentPos.x - this.startPos.x) / 2,
        this.startPos.y
      );
      this.context.lineTo(this.startPos.x, this.currentPos.y);
      this.context.lineTo(this.currentPos.x, this.currentPos.y);
      this.context.closePath();
    }
    this.context.stroke();
  }
  drawFreeLine(lineWidth) {
    this.context.lineWidth = lineWidth;
    this.context.lineTo(this.currentPos.x, this.currentPos.y);
    this.context.stroke();
  }
  undoPaint() {
    if (this.undoStack.length > 0) {
      console.log(this.undoStack);
      this.context.putImageData(
        this.undoStack[this.undoStack.length - 1],
        0,
        0
      );
      this.undoStack.pop();
    } else {
      alert("No Undo Available");
    }
  }
}
