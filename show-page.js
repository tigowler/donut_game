"use strict";

import Scroll from "./scroll.js";
import Popup from "./pop-up.js";

const DONUT_SIZE = 80;
// const LIFE_COUNT = 3;

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

    this.showField = document.querySelector(".show__field");
    this.showCount = document.querySelector(".show__count");
    this.answerDonuts = [];
    this.score = 0;
    this.started = false;
    this.gameField = document.querySelector(".game__field");
    this.gameFieldRect = this.gameField.getBoundingClientRect();
    this.gameLife = document.querySelector(".game__life");
    this.gameBtn = document.querySelector(".game__button");
    this.answerField = document.querySelector(".answer__field");
    this.answerFieldRect = this.answerField.getBoundingClientRect();
    this.donutsImage = [
      "img/donut_1.png",
      "img/donut_2.png",
      "img/donut_3.png",
      "img/donut_4.png",
      "img/donut_5.png",
      "img/donut_6.png",
      "img/donut_7.png",
      "img/donut_8.png",
      "img/donut_9.png",
      "img/donut_10.png",
      "img/donut_11.png",
      "img/donut_12.png",
      "img/donut_13.png",
      "img/donut_14.png",
      "img/donut_15.png",
      "img/donut_16.png",
      "img/donut_17.png",
      "img/donut_18.png",
    ];

    this.gameBtn.addEventListener("click", () => {
      this.onPauseClick && this.onPauseClick();
    });
  }

  setPauseClickListener(onPauseClick) {
    this.onPauseClick = onPauseClick;
  }

  setAnswerDonuts() {
    while (this.answerDonuts.length <= this.donutCount - 1) {
      const randomInt = getRandomInts(1, this.donutsImage.length - 1);
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
    this.FieldInit();
  }

  FieldInit() {
    this.gameField.innerHTML = "";
    this.addDonutOnField();
    this.gameLife.innerHTML = "";
    for (let i = 0; i < this.initialLife; i++) {
      const life = document.createElement("i");
      life.classList.add("fas");
      life.classList.add("fa-star");
      this.gameLife.appendChild(life);
    }
    if (this.gameField.childElementCount > 0) {
      this.MakeDonutDragDrop();
    }
  }

  addDonutOnField() {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.gameFieldRect.width - DONUT_SIZE;
    const y2 = this.gameFieldRect.height - DONUT_SIZE;
    for (let i = 0; i < this.donutsImage.length; i++) {
      const item = this.createDonut(i + 1, x1, x2, y1, y2);
      this.gameField.appendChild(item);
    }
  }

  createDonut(
    id,
    x1 = 0,
    x2 = this.gameFieldRect.width - DONUT_SIZE,
    y1 = 0,
    y2 = this.gameFieldRect.height - DONUT_SIZE
  ) {
    const item = document.createElement("img");
    item.setAttribute("class", "donut");
    item.setAttribute("src", `img/donut_${id}.png`);
    item.setAttribute("data-id", `${id}`);
    item.style.width = `${DONUT_SIZE}px`;
    item.style.height = `${DONUT_SIZE}px`;
    item.style.position = "absolute";
    const x = randomPosition(x1, x2);
    const y = randomPosition(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    return item;
  }

  MakeDonutDragDrop() {
    const donuts = this.gameField.childNodes;
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
      this.gameLife.firstElementChild.remove();
      target.remove();
      const item = this.createDonut(target.dataset.id);
      this.gameField.appendChild(item);
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

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInts(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}