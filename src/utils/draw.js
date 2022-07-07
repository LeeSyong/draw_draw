import { MODE } from "../constants/mode";

const draw = (() => {
  const drawStartPoint = (ctx, currX, currY, mode) => {
    if (mode === MODE.PICTURE) {
      ctx.fillStyle = "#fffefa";
      ctx.strokeStyle = "#fffefa";
    } else {
      ctx.fillStyle = "#1e1e1e";
      ctx.strokeStyle = "#1e1e1e";
    }

    ctx.beginPath();
    ctx.fillRect(currX, currY, 2, 2);
    ctx.closePath();
  };

  const drawLine = (ctx, x1, y1, x2, y2, mode) => {
    if (mode === MODE.PICTURE) {
      ctx.fillStyle = "#fffefa";
      ctx.strokeStyle = "#fffefa";
    } else {
      ctx.fillStyle = "#1e1e1e";
      ctx.strokeStyle = "#1e1e1e";
    }

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  };

  return Object.freeze({ drawStartPoint, drawLine });
})();

export default draw;
