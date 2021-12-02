"use strict";

import Scroll from "./scroll.js";
import Popup from "./pop-up.js";
import Field from "./field.js";

export default class GameBuilder {
  withAnswerCount(num) {
    this.donutCount = num;
    return this;
  }

  withAnswerInterval(duration) {
    this.answerInterval = duration;
    return this;
  }

  withLifeCount(num) {
    this.life = num;
    return this;
  }

  build() {
    return new Show(
      this.donutCount, //
      this.answerInterval,
      this.life
    );
  }
}

class Show {
  constructor(donutCount, answerInterval, life) {
    this.donutCount = donutCount;
    this.answerInterval = answerInterval;
    this.life = life;
    this.initialLife = life;

    this.scroll = new Scroll();
    this.popup = new Popup();
    this.field = new Field(this.initialLife);

    this.showField = document.querySelector(".show__field");
    this.showCount = document.querySelector(".show__count");
    this.answerDonuts = [];
    this.score = 0;
    this.started = false;
    this.gameBtn = document.querySelector(".game__button");
    this.answerField = document.querySelector(".answer__field");
    this.answerFieldRect = this.answerField.getBoundingClientRect();

    this.gameBtn.addEventListener("click", () => {
      this.onPauseClick && this.onPauseClick();
    });
  }

  setPauseClickListener(onPauseClick) {
    this.onPauseClick = onPauseClick;
  }

  setAnswerDonuts() {
    while (this.answerDonuts.length <= this.donutCount - 1) {
      const randomInt = getRandomInts(1, this.field.donutsImage.length - 1);
      if (this.answerDonuts.indexOf(randomInt) === -1) {
        this.answerDonuts.push(randomInt);
      }
    }
  }

  showAnswerDonuts() {
    let AnswerCount = 0;
    this.showCount.innerHTML = this.donutCount - AnswerCount;
    this.showField.innerHTML = `<img src="img/donut_${this.answerDonuts[AnswerCount]}.png" />`;
    this.timer = setInterval(() => {
      if (AnswerCount >= this.donutCount - 1) {
        clearInterval(this.timer);
        this.scroll.scrollIntoView("#game-page");
        this.start();
        AnswerCount = 0;
        return;
      }
      AnswerCount += 1;
      this.showCount.innerHTML = this.donutCount - AnswerCount;
      this.showField.innerHTML = `<img src="img/donut_${this.answerDonuts[AnswerCount]}.png" />`;
    }, this.answerInterval);
  }

  start() {
    this.life = this.initialLife;
    this.score = 0;
    this.started = true;
    this.field.FieldInit();
    this.MakeDonutDragDrop();
  }

  MakeDonutDragDrop() {
    const donuts = this.field.gameField.childNodes;
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    donuts.forEach((element) => {
      element.onmousedown = clickDonut;
      function clickDonut(event) {
        event.preventDefault();
        pos3 = event.clientX;
        pos4 = event.clientY;
        document.onmouseup = dropDragDonut;
        document.onmousemove = dragDonut;
      }

      function dragDonut(event) {
        event.preventDefault();
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        element.style.top = `${element.offsetTop - pos2}px`;
        element.style.left = `${element.offsetLeft - pos1}px`;
        element.style.opacity = "0.5";
      }

      const dropDragDonut = (event) => {
        document.onmouseup = null;
        document.onmousemove = null;
        element.style.opacity = "1";
        if (this.checkDonutOnPlate(event)) {
          this.checkAnswerDonut(event.target);
        }
      };
    });
  }

  checkDonutOnPlate(event) {
    const left = this.answerFieldRect.left;
    const right = this.answerFieldRect.right;
    const top = this.answerFieldRect.top;
    const bottom = this.answerFieldRect.bottom;
    if (
      event.pageX > left &&
      event.pageX < right &&
      event.pageY > top &&
      event.pageY < bottom
    ) {
      return true;
    } else {
      return false;
    }
  }

  checkAnswerDonut(target) {
    if (target.dataset.id === this.answerDonuts[this.score].toString()) {
      this.score += 1;
      target.remove();
      this.addAnswerOnField(target);

      if (this.score >= this.donutCount) {
        this.started = false;
        this.popup.showWithText("game", "YOU WON 😙");
      }
    } else {
      this.life -= 1;
      this.field.gameLife.firstElementChild.remove();
      target.remove();
      const item = this.field.createDonut(target.dataset.id);
      this.field.gameField.appendChild(item);
      this.MakeDonutDragDrop();

      if (this.life <= 0) {
        this.started = false;
        this.popup.showWithText("game", "YOU LOST 🤔");
      }
    }
  }

  addAnswerOnField(target) {
    if (this.score === 1) {
      this.answerField.innerHTML = "";
    }
    target.style.width = "40px";
    target.style.height = "40px";
    target.style.position = "relative";
    target.style.left = "0px";
    target.style.top = "0px";
    target.style.margin = "0px 5px";
    this.answerField.appendChild(target);
  }
}

function getRandomInts(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
