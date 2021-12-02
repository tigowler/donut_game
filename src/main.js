"use strict";

import Scroll from "./scroll.js";
import MainPage from "./main-page.js";
import GameBuilder from "./show-page.js";
import Popup from "./pop-up.js";

history.scrollRestoration = "manual";

const scroll = new Scroll();
const mainPage = new MainPage();
const popup = new Popup();
const show = new GameBuilder()
  .withAnswerCount(3)
  .withAnswerInterval(1000)
  .withLifeCount(5)
  .build();

mainPage.setClickListener(() => {
  scroll.scrollIntoView("#show-page");
});

popup.setClickListener((event) => {
  popup.hide("show");
  show.setAnswerDonuts();
  show.showAnswerDonuts();
});

popup.setRestartClickListener((event) => {
  scroll.scrollIntoView("#show-page");
  popup.showWithText("show");
  show.answerDonuts.length = 0;
  show.score = 0;
  show.answerField.innerHTML = "Drag the cursor with DONUT here!";
  popup.hide("game");
});

show.setPauseClickListener(() => {
  if (!show.started) {
    return;
  }
  show.started = false;
  popup.showWithText("game", "Wanna play again? 😫");
  const icon = show.gameBtn.querySelector("i");
  icon.classList.remove("fa-stop");
  icon.classList.add("fa-play");
});
