"use strict";

const DONUT_SIZE = 80;

export default class Field {
  constructor(life) {
    this.gameField = document.querySelector(".game__field");
    this.gameFieldRect = this.gameField.getBoundingClientRect();
    this.gameLife = document.querySelector(".game__life");
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
    this.initialLife = life;
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
}

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
