import Tool from "./tool.class.js";
import Paint from "./paint.class.js";

var paint = new Paint("canvas");
paint.activeTool = Tool.tool_line;
paint.lineWidth = 1;
paint.brushSize = 4;
paint.selectedColor = "#000000";
paint.init();
document.querySelectorAll("[data-command]").forEach((item) => {
  item.addEventListener("click", (e) => {
    let command = item.getAttribute("data-command");

    if (command === "undo") {
      console.log(command);
      paint.undoPaint();
    } else {
      var canvas = document.getElementById("canvas");
      var image = canvas
        .toDataURL("image/png", 1.0)
        .replace("image/png", "image/octet-stream");
      var link = document.createElement("a");
      link.download = "my-image.png";
      link.href = image;
      link.click();
    }
  });
});

document.querySelectorAll("[data-tool]").forEach((item) => {
  item.addEventListener("click", (e) => {
    document.querySelector("[data-tool].active").classList.toggle("active");
    item.classList.toggle("active");
    let selectedTool = item.getAttribute("data-tool");
    paint.activeTool = selectedTool;
    switch (selectedTool) {
      case Tool.tool_line:
      case Tool.tool_rectangle:
      case Tool.tool_circle:
      case Tool.tool_triangle:
      case Tool.tool_pencil:
        //activate shape linewidths group
        document.querySelector(".group.for-shapes").style.display = "block";
        //invisible brush linewidths group
        document.querySelector(".group.for-brush").style.display = "none";
        break;
      case Tool.tool_brush:
      case Tool.tool_eraser:
        //activate brush linewidths group
        document.querySelector(".group.for-brush").style.display = "block";
        //invisible shape linewidths group
        document.querySelector(".group.for-shapes").style.display = "none";
        break;
      default:
        //make invisible both linewidths group
        document.querySelector(".group.for-brush").style.display = "none";
        document.querySelector(".group.for-shapes").style.display = "none";
        break;
    }
  });
});

document.querySelectorAll("[data-line-width]").forEach((item) => {
  item.addEventListener("click", (e) => {
    document
      .querySelector("[data-line-width].active")
      .classList.toggle("active");
    item.classList.toggle("active");

    let lineWidth = item.getAttribute("data-line-width");
    paint.lineWidth = lineWidth;
  });
});
document.querySelectorAll("[data-brush-width]").forEach((item) => {
  item.addEventListener("click", (e) => {
    document
      .querySelector("[data-brush-width].active")
      .classList.toggle("active");
    item.classList.toggle("active");

    let brushSize = item.getAttribute("data-brush-width");
    paint.brushSize = brushSize;
  });
});
document.querySelectorAll("[data-color]").forEach((item) => {
  item.addEventListener("click", (e) => {
    document.querySelector("[data-color].active").classList.toggle("active");
    item.classList.toggle("active");
    console.log(item.getAttribute("data-color"));
    paint.selectedColor = item.getAttribute("data-color");
  });
});
