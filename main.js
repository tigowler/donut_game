"use strict";

const DONUT_COUNT = 3;
const DONUT_SIZE = 80;
const ANSWER_INTERVAL = 500;
const LIFE_COUNT = 3;

let timer = undefined;
let life = LIFE_COUNT;
let score = 0;

const donutsImage = [
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
const answerDonuts = [];
const showPagePopup = document.querySelector("#show-page .pop-up");
const mainBtn = document.querySelector("#main button");
const showBtn = document.querySelector("#show-page .pop-up__btn");
const showField = document.querySelector(".show__field");
const showCount = document.querySelector(".show__count");
const gameField = document.querySelector(".game__field");
const gameFieldRect = gameField.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const answerField = document.querySelector(".answer__field");
const answerFieldRect = answerField.getBoundingClientRect();
const gameLife = document.querySelector(".game__life");
const gamePopup = document.querySelector("#game-page .pop-up");
const gamePopupMessage = document.querySelector("#game-page .pop-up__message");
const gamePopupBtn = document.querySelector("#game-page .pop-up__btn");

mainBtn.addEventListener("click", () => {
  scrollIntoView("#show-page");
  showPagePopup.classList.remove("pop-up--hide");
});

gamePopupBtn.addEventListener("click", () => {
  scrollIntoView("#show-page");
  showPagePopup.classList.remove("pop-up--hide");
  answerDonuts.length = 0;
  score = 0;
  answerField.innerHTML = "Drag the cursor with DONUT here!";
  gamePopup.classList.add("pop-up--hide");
});

showBtn.addEventListener("click", () => {
  showPagePopup.classList.add("pop-up--hide");
  setAnswerDonuts();
  showAnswerDonuts();
});

function MakeDonutDragDrop() {
  const donuts = gameField.childNodes;
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

    function dropDragDonut(event) {
      document.onmouseup = null;
      document.onmousemove = null;
      element.style.opacity = "1"; //수정 필요
      if (checkDonutOnPlate(event)) {
        checkAnswerDonut(event.target);
      }
    }
  });
}

function checkDonutOnPlate(event) {
  const left = answerFieldRect.left;
  const right = answerFieldRect.right;
  const top = answerFieldRect.top;
  const bottom = answerFieldRect.bottom;
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

function checkAnswerDonut(target) {
  if (target.dataset.id === answerDonuts[score].toString()) {
    score += 1;
    target.remove();
    addAnswerOnField(target);

    if (score >= DONUT_COUNT) {
      gamePopupMessage.innerHTML = "YOU WON 😙";
      gamePopup.classList.remove("pop-up--hide");
    }
  } else {
    life -= 1;
    removeLifeIcon();
    target.remove();
    const item = createDonut(target.dataset.id);
    gameField.appendChild(item);
    MakeDonutDragDrop();

    if (life <= 0) {
      gamePopupMessage.innerHTML = "YOU LOST 🤔";
      gamePopup.classList.remove("pop-up--hide");
    }
  }
}

function removeLifeIcon() {
  if (life < 0) {
    return;
  }
  gameLife.firstElementChild.remove();
}

function addAnswerOnField(target) {
  if (score === 1) {
    answerField.innerHTML = "";
  }
  target.style.width = "40px";
  target.style.height = "40px";
  target.style.position = "relative";
  target.style.left = "0px";
  target.style.top = "0px";
  target.style.margin = "0px 5px";
  answerField.appendChild(target);
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
}

function setAnswerDonuts() {
  while (answerDonuts.length <= DONUT_COUNT - 1) {
    const randomInt = getRandomInts(1, donutsImage.length - 1);
    if (answerDonuts.indexOf(randomInt) === -1) {
      answerDonuts.push(randomInt);
    }
  }
}

function getRandomInts(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showAnswerDonuts() {
  let AnswerCount = 0;
  showCount.innerHTML = DONUT_COUNT - AnswerCount;
  showField.innerHTML = `<img src="img/donut_${answerDonuts[AnswerCount]}.png" />`;
  timer = setInterval(() => {
    if (AnswerCount >= DONUT_COUNT - 1) {
      clearInterval(timer);
      scrollIntoView("#game-page");
      startGame();
      AnswerCount = 0;
      return;
    }
    AnswerCount += 1;
    showCount.innerHTML = DONUT_COUNT - AnswerCount;
    showField.innerHTML = `<img src="img/donut_${answerDonuts[AnswerCount]}.png" />`;
  }, ANSWER_INTERVAL);
}

function startGame() {
  life = LIFE_COUNT;
  score = 0;
  // 도넛 랜덤 배치
  FieldInit();
  // 정답-오답 판정 - 팝업
  // 시작-중지 버튼 - 팝업
}

function FieldInit() {
  gameField.innerHTML = "";
  addDonutOnField();
  gameLife.innerHTML = "";
  for (let i = 0; i < LIFE_COUNT; i++) {
    const life = document.createElement("i");
    life.classList.add("fas");
    life.classList.add("fa-star");
    gameLife.appendChild(life);
  }
  if (gameField.childElementCount > 0) {
    MakeDonutDragDrop();
  }
}

function addDonutOnField() {
  const x1 = 0;
  const y1 = 0;
  const x2 = gameFieldRect.width - DONUT_SIZE;
  const y2 = gameFieldRect.height - DONUT_SIZE;
  for (let i = 0; i < donutsImage.length; i++) {
    const item = createDonut(i + 1, x1, x2, y1, y2);
    gameField.appendChild(item);
  }
}

function createDonut(
  id,
  x1 = 0,
  x2 = gameFieldRect.width - DONUT_SIZE,
  y1 = 0,
  y2 = gameFieldRect.height - DONUT_SIZE
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

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
