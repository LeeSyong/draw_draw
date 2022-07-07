import axios from "axios";

import { API } from "../constants/url";

const autodraw = (() => {
  const getSuggestions = async (shapes) => {
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
      alert(error);
    }
  };

  const extractDataFromApi = (data) => {
    if (!data) {
      return;
    }

    const regex = /SCORESINKS: (.*) Service_Recognize:/;
    const results = JSON.parse(data[1][0][3].debug_info.match(regex)[1]);

    return results;
  };

  const parseSuggestions = (results) => {
    const parsedResults = results.map((result) => {
      const escapedName = result[0].replace(/ /g, "-");

      return {
        name: result[0],
        confidence: result[1],
        url: API.SVG_ENDPOINT + escapedName + "-01.svg",
        url_variant_1: API.SVG_ENDPOINT + escapedName + "-02.svg",
        url_variant_2: API.SVG_ENDPOINT + escapedName + "-03.svg",
      };
    });

    return parsedResults;
  };

  return Object.freeze({
    getSuggestions,
    extractDataFromApi,
    parseSuggestions,
  });
})();

export default autodraw;
