import { load } from "opentype.js";

import FONTPATH from "../../assets/poor_story.ttf";

const svgCreator = (() => {
  const createSvgImg = async (url) => {
    const res = await fetch(url);
    const text = await res.text();
    const svgImg = new DOMParser()
      .parseFromString(text, "image/svg+xml")
      .querySelector("svg");

    document.body.appendChild(svgImg);

    return svgImg;
  };

  const convertCircleToPath = (circles, svg) => {
    let circlePathMarkup = "";

    circles.forEach((circle) => {
      const CX = circle.cx.baseVal.value;
      const CY = circle.cy.baseVal.value;
      const R = circle.r.baseVal.value;
      const circlePath = `<path d="M ${CX - R}, ${CY} a ${R}, ${R} 0 1, 0 ${
        R * 2
      }, 0 a ${R}, ${R} 0 1, 0 ${-R * 2}, 0" />`;

      circlePathMarkup += circlePath;
      circle.remove();
    });

    const g = svg.querySelector("g");

    if (g) {
      g.insertAdjacentHTML("beforeend", circlePathMarkup);
    } else {
      svg.insertAdjacentHTML("beforeend", circlePathMarkup);
    }
  };

  const createSvgText = async (text) => {
    const font = await load(FONTPATH);

    const svgText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const pathMarkup = createTextShape(font, text);

    svgText.setAttribute("viewBox", [0, 0, 1920, 1920].join(" "));
    g.insertAdjacentHTML("beforeend", pathMarkup);
    g.setAttribute("fill", "black");

    document.body.appendChild(svgText);
    svgText.appendChild(g);

    return svgText;
  };

  const createTextShape = (font, text) => {
    let pathMarkup = "";
    const fontPaths = font.getPaths(text, 0, 1000, 700);

    fontPaths.forEach((fontPath) => {
      const path = fontPath.toSVG();

      pathMarkup += path;
    });

    return pathMarkup;
  };

  return Object.freeze({
    createSvgImg,
    convertCircleToPath,
    createSvgText,
  });
})();

export default svgCreator;
