"use strict";

export default class PopUp {
  constructor() {
    this.showPagePopup = document.querySelector("#show-page .pop-up");
    this.showBtn = document.querySelector("#show-page .pop-up__btn");
    this.gamePopup = document.querySelector("#game-page .pop-up");
    this.gamePopupMessage = document.querySelector(
      "#game-page .pop-up__message"
    );
    this.gamePopupBtn = document.querySelector("#game-page .pop-up__btn");
    this.showBtn.addEventListener("click", (event) => {
      this.onShowClick && this.onShowClick(event);
    });
    this.gamePopupBtn.addEventListener("click", (event) => {
      this.onRestartClick && this.onRestartClick(event);
    });
  }

  setClickListener(onShowClick) {
    this.onShowClick = onShowClick;
  }

  setRestartClickListener(onRestartClick) {
    this.onRestartClick = onRestartClick;
  }

  showWithText(flag, text) {
    let popup = undefined;
    if (flag === "show") {
      popup = this.showPagePopup;
    } else if (flag === "game") {
      popup = this.gamePopup;
      const popupMessage = this.gamePopupMessage;
      popupMessage.innerText = text;
    }
    popup.classList.remove("pop-up--hide");
  }

  hide(flag) {
    let popup = undefined;
    if (flag === "show") {
      popup = this.showPagePopup;
    } else if (flag === "game") {
      popup = this.gamePopup;
    }
    popup.classList.add("pop-up--hide");
  }
}
