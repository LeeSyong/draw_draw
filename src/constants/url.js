const ICON = {
  CHANGE_LETTER_MODE: "change-mode",
  CHANGE_LANG: "change-lang",
  SHOW_INFO: "show-info",
  SOUND: "sound",
};

const ALPHAMAP = {
  CIRCLE: "assets/alphamap.png",
};

const API = {
  SUGGESTIONS_ENDPOINT:
    "https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8",
  SVG_ENDPOINT:
    "https://storage.googleapis.com/artlab-public.appspot.com/stencils/selman/",
  TEXT_ENDPOINT: "https://vision.googleapis.com/v1/images:annotate",
};

export { ICON, ALPHAMAP, API };
