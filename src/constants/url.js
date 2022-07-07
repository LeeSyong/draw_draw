const ICON = {
  GLOBAL: {
    SRC: "assets/global.svg",
    ALT: "change-lang",
  },
  NOTE: {
    SRC: "assets/letterMode.svg",
    ALT: "change-mode",
  },
  HEAR: {
    SRC: "assets/listen.svg",
    ALT: "listen",
  },
  INFO: {
    SRC: "assets/info.svg",
    ALT: "show-info",
  },
};

const ALPHAMAP = {
  CIRCLE: "assets/alphamap.png",
};

const API = {
  SUGGESTIONS_ENDPOINT:
    "https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8",
  SVG_ENDPOINT:
    "https://storage.googleapis.com/artlab-public.appspot.com/stencils/selman/",
};

export { ICON, ALPHAMAP, API };
