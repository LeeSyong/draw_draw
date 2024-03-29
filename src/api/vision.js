import axios from "axios";

import { API } from "../constants/url";
import { TEXT } from "../constants/text";

import ui from "../utils/ui";

const vision = (() => {
  const recognize = async (canvas) => {
    try {
      const result = await axios.post(
        `${API.TEXT_ENDPOINT}?key=${process.env.API_KEY}`,
        {
          requests: [
            {
              image: {
                content: canvas
                  .toDataURL()
                  .replace(/^data:image\/[a-z]+;base64,/, ""),
              },
              features: [
                {
                  type: "TEXT_DETECTION",
                  maxResults: 1,
                },
              ],
              imageContext: {
                languageHints: ["ko"],
              },
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const text = result.data.responses[0].fullTextAnnotation?.text;

      return text;
    } catch (error) {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      ui.addText(TEXT.DRAW_LETTER_ERROR);
    }
  };

  const validate = (text) => {
    const specialSymbolRegExp = /[{}[\]/;:|)*`^\-_+<>♡☆Ĉ@%$\\=('"]/g;
    const latinAlphabetRegExp = /[a-z|A-Z]/g;

    if (
      !text ||
      specialSymbolRegExp.test(text) ||
      latinAlphabetRegExp.test(text)
    ) {
      return;
    }

    const finalText = text.split("").map((char) => {
      if (char === "\n") {
        return " ";
      }

      return char;
    });

    return finalText.join("");
  };

  return Object.freeze({ recognize, validate });
})();

export default vision;
