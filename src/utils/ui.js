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
    infoWrapper.appendChild(infoSpan);

    setTimeout(() => {
      infoSpan.remove();
    }, 1500);
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

  const setBackgroundColorRandomly = (mode) => {
    let backgroundColor;
    const randomHue = getRandomAmount(0, 255);
    const lowDegree = getRandomAmount(20, 60);
    const highDegree = getRandomAmount(60, 90);

    if (mode === MODE.PICTURE) {
      backgroundColor = `hsl(${randomHue}, ${lowDegree}%, ${lowDegree}%)`;
    } else {
      backgroundColor = `hsl(${randomHue}, ${highDegree}%, ${highDegree}%)`;
    }

    document.body.style.backgroundColor = backgroundColor;
  };

  const displaySuggestions = async (suggestions) => {
    const suggestionList = document.querySelector(".suggestions ul");

    for (let i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];
      const suggestionItem = document.createElement("li");

      suggestionItem.textContent = suggestion.name;
      suggestionItem.classList.add("suggestion");
      suggestionList.appendChild(suggestionItem);

      if (i === 0) {
        suggestionItem.classList.add("selected");
      }
    }

    const suggestionItems = suggestionList.querySelectorAll(".suggestion");

    const handleSuggestionItemclick = (event) => {
      const prevSelectedItem = suggestionList.querySelector(".selected");

      suggestionItems.forEach((suggestionItem, index) => {
        const currSelectedItem = event.target;

        if (currSelectedItem.textContent === prevSelectedItem.textContent) {
          return;
        }

        if (currSelectedItem.textContent === suggestionItem.textContent) {
          suggestStore.setSuggestionUrl(suggestions[index].url);

          ui.setBackgroundColorRandomly(MODE.PICTURE);
        }

        suggestionItem.classList.remove("selected");
      });

      event.target.classList.add("selected");
    };

    suggestionItems.forEach((suggestionItem) => {
      suggestionItem.addEventListener("click", handleSuggestionItemclick);
    });
  };

  const getRandomAmount = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
