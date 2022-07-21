import translate from "translate";
import axios from "axios";

import { API } from "../constants/url";
import { TEXT } from "../constants/text";

import ui from "../utils/ui";

const autodraw = (() => {
  const getSuggestions = async (shapes, canvas) => {
    try {
      const response = await axios.post(API.SUGGESTIONS_ENDPOINT, {
        input_type: 0,
        requests: [
          {
            language: "autodraw",
            writing_guide: {
              width: 400,
              height: 400,
            },
            ink: shapes,
          },
        ],
      });

      const { data } = response;

      return data;
    } catch (error) {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      ui.addText(TEXT.DRAW_PICTURE_ERROR);
    }
  };

  const extractListData = (data) => {
    const regex = /SCORESINKS: (.*) Service_Recognize:/;

    if (!data[1][0]) {
      return;
    }

    if (!data[1][0][3].debug_info.match(regex)) {
      return;
    }

    const suggestions = JSON.parse(data[1][0][3].debug_info.match(regex)[1]);

    return suggestions;
  };

  const parseSuggestions = (suggestions) => {
    const parsedSuggestions = suggestions.map((suggestion) => {
      const escapedName = suggestion[0].replace(/ /g, "-");

      return {
        name: suggestion[0],
        url: API.SVG_ENDPOINT + escapedName + "-01.svg",
      };
    });

    return parsedSuggestions;
  };

  const validateSuggestions = async (suggestions) => {
    const validSuggestions = [];
    let results = [];

    try {
      results = await Promise.allSettled(
        suggestions.map((suggestion) => axios.head(suggestion.url)),
      );
    } catch (error) {
      return;
    }

    results.forEach((result, index) => {
      if (!result.value) {
        return;
      }

      validSuggestions.push(suggestions[index]);
    });

    return validSuggestions;
  };

  const translateSuggestions = async (suggestions) => {
    const names = suggestions.map((suggestion) => suggestion.name).join(",");
    const translatedNames = (await translate(names, "ko")).split(",");
    const translatedSuggestions = suggestions.map((suggestion, index) => {
      if (translatedNames[index] === "squiggle") {
        translatedNames[index] = "구불구불한";
      }

      return { ...suggestion, name: translatedNames[index] };
    });

    return translatedSuggestions;
  };

  return Object.freeze({
    getSuggestions,
    extractListData,
    parseSuggestions,
    validateSuggestions,
    translateSuggestions,
  });
})();

export default autodraw;
