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

  return Object.freeze({ drawStartPoint });
})();

export default draw;
