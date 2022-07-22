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

  const enableToDraw = () => {
    const icons = document.querySelectorAll(".icon-wrapper");
    const suggestions = document.querySelector(".suggestions");

    icons.forEach((icon) => icon.classList.add("can-draw"));
    suggestions.classList.add("can-draw");
  };

  const disableToDraw = () => {
    const icons = document.querySelectorAll(".icon-wrapper");
    const suggestions = document.querySelector(".suggestions");

    icons.forEach((icon) => icon.classList.remove("can-draw"));
    suggestions.classList.remove("can-draw");
  };

  return Object.freeze({
    drawStartPoint,
    drawLine,
    enableToDraw,
    disableToDraw,
  });
})();

export default draw;
