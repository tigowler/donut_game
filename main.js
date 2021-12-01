"use strict";

import Scroll from "./scroll.js";
import MainPage from "./main-page.js";
import Show from "./show-page.js";

history.scrollRestoration = "manual";

const scroll = new Scroll();
const mainPage = new MainPage();
mainPage.setClickListener(() => {
  scroll.scrollIntoView("#show-page");
});

const show = new Show(3, 500);
show.setClickListener(() => {
  show.showPagePopup.classList.add("pop-up--hide");
  show.setAnswerDonuts();
  show.showAnswerDonuts();
});

show.setRestartClickListener(() => {
  scroll.scrollIntoView("#show-page");
  show.showPagePopup.classList.remove("pop-up--hide");
  show.answerDonuts.length = 0;
  show.score = 0;
  show.answerField.innerHTML = "Drag the cursor with DONUT here!";
  show.gamePopup.classList.add("pop-up--hide");
});

show.setPauseClickListener(() => {
  if (!show.started) {
    return;
  }
  show.started = false;
  show.gamePopupMessage.innerHTML = "Wanna play again? 😫";
  show.gamePopup.classList.remove("pop-up--hide");
  const icon = show.gameBtn.querySelector("i");
  icon.classList.remove("fa-stop");
  icon.classList.add("fa-play");
});
