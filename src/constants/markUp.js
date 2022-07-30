const BASE_MARK_UP = `
  <canvas id="webgl-canvas"></canvas>
  <canvas id="drawing-canvas"></canvas>

  <div class="icon-wrapper change-mode-wrapper">
    <img
      class="icon-img change-letter-mode"
      src="../assets/change_letter_mode.svg"
      alt="change-letter-mode"
    />
    <img
      class="icon-img change-picture-mode hide"
      src="../assets/change_picture_mode.svg"
      alt="change-picture-mode"
    />
  </div>
  <div class="icon-wrapper sound-wrapper">
    <img class="icon-img sound hide" src="../assets/sound.svg" alt="sound" />
  </div>

  <div class="info-wrapper"></div>

  <div class="suggestions">
    <ul></ul>
  </div>
`;

export { BASE_MARK_UP };
