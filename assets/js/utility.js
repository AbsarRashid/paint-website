import Point from "./point.model.js";
export function getMouseCoordsOnCanvas(e, canvas) {
  let canvasRect = canvas.getBoundingClientRect();
  let x = Math.round(e.clientX - canvasRect.left);
  let y = Math.round(e.clientY - canvasRect.top);
  return new Point(x, y); //{ x: x, y: y };
}
export function findDistane(coord1, coord2) {
  let exp1 = Math.pow(coord2.x - coord1.x, 2);
  let exp2 = Math.pow(coord2.y - coord1.y, 2);
  let distance = Math.sqrt(exp1 + exp2);
  return distance;
}
