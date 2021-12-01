"use strict";

export default class mainPage {
  constructor() {
    this.mainBtn = document.querySelector("#main button");
    this.mainBtn.addEventListener("click", () => {
      this.onClick && this.onClick();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }
}
