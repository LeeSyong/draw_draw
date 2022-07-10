import { makeObservable, observable, action } from "mobx";

class SuggestStore {
  constructor() {
    this.suggestions = [];
    this.suggestionUrl = "";

    makeObservable(this, {
      suggestions: observable,
      suggestionUrl: observable,
      setSuggestions: action,
      setSuggestionUrl: action,
    });
  }

  setSuggestions(suggestions) {
    this.suggestions = suggestions;
  }

  setSuggestionUrl(suggestionUrl) {
    this.suggestionUrl = suggestionUrl;
  }
}

const suggestStore = new SuggestStore();

export default suggestStore;
