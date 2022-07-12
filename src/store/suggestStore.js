import { makeObservable, observable, action } from "mobx";

class SuggestStore {
  constructor() {
    this.suggestions = [];
    this.suggestionUrl = "";
    this.text = "";

    makeObservable(this, {
      suggestions: observable,
      suggestionUrl: observable,
      text: observable,
      setSuggestions: action,
      setSuggestionUrl: action,
      setText: action,
    });
  }

  setSuggestions(suggestions) {
    this.suggestions = suggestions;
  }

  setSuggestionUrl(suggestionUrl) {
    this.suggestionUrl = suggestionUrl;
  }

  setText(text) {
    this.text = text;
  }
}

const suggestStore = new SuggestStore();

export default suggestStore;
