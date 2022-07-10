import axios from "axios";

import suggestStore from "../store/suggestStore";

import { MODE } from "../constants/mode";

const ui = (() => {
  const showIcon = (iconClass) => {
    const icon = document.querySelector(`.${iconClass}`);

    icon.classList.remove("hide");
    icon.classList.add("show");
  };

  const hideIcon = (iconClass) => {
    const icon = document.querySelector(`.${iconClass}`);

    icon.classList.remove("show");
    icon.classList.add("hide");
  };

  const addText = (text) => {
    const hasExisted = document.querySelector(".info-text");
    if (hasExisted) {
      hasExisted.remove();
    }

    const infoWrapper = document.querySelector(".info-wrapper");
    const infoSpan = document.createElement("span");

    infoSpan.classList.add("info-text");
    infoSpan.textContent = text;

    if (text.slice(0, 2) === "그림") {
      infoSpan.classList.remove("info-letter");
      infoSpan.classList.add("info-picture");
    } else {
      infoSpan.classList.remove("info-picture");
      infoSpan.classList.add("info-letter");
    }

    infoWrapper.appendChild(infoSpan);

    setTimeout(() => {
      infoSpan.remove();
    }, 1000);
  };

  const changeBackgroundColor = (mode) => {
    const { body } = document;

    if (mode === MODE.PICTURE) {
      body.style.backgroundColor = "#1e1e1e";
    } else {
      body.style.backgroundColor = "#fffefa";
    }
  };

  const changeIconColor = (icons, mode) => {
    if (mode === MODE.PICTURE) {
      icons.forEach((icon) => {
        icon.classList.remove("filter-black");
        icon.classList.add("filter-white");
      });
    } else {
      icons.forEach((icon) => {
        icon.classList.remove("filter-white");
        icon.classList.add("filter-black");
      });
    }
  };

  const setBackgroundColorRandomly = () => {
    const { body } = document;
    const hexValues = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ];
    let hex = "#";

    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * hexValues.length);

      hex += hexValues[index];
    }

    body.style.backgroundColor = hex;
  };

  const displaySuggestions = async (suggestions) => {
    const suggestionList = document.querySelector(".suggestions ul");

    for (let i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];
      const suggestionItem = document.createElement("li");

      try {
        await axios(suggestion.url);
      } catch (error) {
        continue;
      }

      suggestionItem.textContent = suggestion.name;
      suggestionItem.classList.add("suggestion");
      suggestionList.appendChild(suggestionItem);
      suggestionList.visibility = "visible";

      if (i === 0) {
        suggestionItem.classList.add("selected");
      }
    }

    const suggestionItems = suggestionList.querySelectorAll(".suggestion");

    const handleSuggestionItemclick = (event) => {
      suggestionItems.forEach((suggestionItem) => {
        suggestionItem.classList.remove("selected");
      });

      event.target.classList.add("selected");

      suggestions.forEach((suggestion) => {
        if (suggestion.name === event.target.textContent) {
          suggestStore.setSuggestionUrl(suggestion.url);

          ui.setBackgroundColorRandomly();
        }
      });
    };

    suggestionItems.forEach((suggestionItem) => {
      suggestionItem.addEventListener("click", handleSuggestionItemclick);
    });
  };

  return Object.freeze({
    showIcon,
    hideIcon,
    addText,
    changeBackgroundColor,
    changeIconColor,
    setBackgroundColorRandomly,
    displaySuggestions,
  });
})();

export default ui;
