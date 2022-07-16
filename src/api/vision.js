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

  return Object.freeze({ recognize });
})();

export default vision;
