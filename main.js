"use strict";

const DONUT_COUNT = 5;
const DONUT_SIZE = 80;
const ANSWER_INTERVAL = 500;
let timer = undefined;
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

mainBtn.addEventListener("click", () => {
  scrollIntoView("#show-page");
  showDonutsToUser();
});

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
}

function showDonutsToUser() {
  //pop-up 보이게 하기
  showPagePopup.classList.remove("pop-up--hide");
  //버튼 누르면 pop-up 사라지게 하기
  showBtn.addEventListener("click", () => {
    showPagePopup.classList.add("pop-up--hide");
    console.log("set donuts!");
    //정답 도넛 설정
    setAnswerDonuts();
    // 도넛 하나씩 보이게 하기
    showAnswerDonuts();
  });

  //도넛이 전부 출력되면 다음 페이지 스크롤하기
}

function setAnswerDonuts() {
  while (answerDonuts.length <= DONUT_COUNT - 1) {
    const randomInt = getRandomInts(1, donutsImage.length - 1);
    console.log(randomInt);
    if (answerDonuts.indexOf(donutsImage[randomInt]) === -1) {
      answerDonuts.push(donutsImage[randomInt]);
      console.log(donutsImage[randomInt]);
    }
  }
  console.log(answerDonuts);
}

function getRandomInts(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showAnswerDonuts() {
  let AnswerCount = 0;
  showCount.innerHTML = DONUT_COUNT - AnswerCount;
  showField.innerHTML = `<img src="${answerDonuts[AnswerCount]}" />`;
  timer = setInterval(() => {
    if (AnswerCount >= 4) {
      clearInterval(timer);
      scrollIntoView("#game-page");
      startGame();
      return;
    }
    console.log(AnswerCount);
    AnswerCount += 1;
    showCount.innerHTML = DONUT_COUNT - AnswerCount;
    showField.innerHTML = `<img src="${answerDonuts[AnswerCount]}" />`;
  }, ANSWER_INTERVAL);
}

function startGame() {
  console.log("lets start");
  // 도넛 랜덤 배치
  FieldInit();
  // 드래그
  // 정답-오답 판정 - 팝업
  // 시작-중지 버튼 - 팝업
  // 타이머 - 시간초과 팝업
}

function FieldInit() {
  gameField.innerHTML = "";
  addDonutOnField();
}

function addDonutOnField() {
  const x1 = 0;
  const y1 = 0;
  const x2 = gameFieldRect.width - DONUT_SIZE;
  const y2 = gameFieldRect.height - DONUT_SIZE;
  for (let i = 0; i < donutsImage.length; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", "donut");
    item.setAttribute("src", `img/donut_${i + 1}.png`);
    item.style.width = `${DONUT_SIZE}px`;
    item.style.height = `${DONUT_SIZE}px`;
    item.style.position = "absolute";
    const x = randomPosition(x1, x2);
    const y = randomPosition(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    gameField.appendChild(item);
  }
}

function randomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
