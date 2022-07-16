class TextToSpeech {
  constructor() {
    this._speech = new SpeechSynthesisUtterance();

    window.speechSynthesis.onvoiceschanged = function () {
      this._voice = window.speechSynthesis.getVoices()[12];
    };
  }

  _setting() {
    this._speech.lang = "ko-KR";
    this._speech.voice = this._voice;
    this._speech.rate = 0.7;
    this._speech.volume = 1;
  }

  _converting(text) {
    if (speechSynthesis.speaking) {
      return;
    }

    this._speech.text = text;

    speechSynthesis.speak(this._speech);
  }
}

export default TextToSpeech;
