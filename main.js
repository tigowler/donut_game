"use strict";

const DONUT_COUNT = 5;
const showPagePopup = document.querySelector("#show-page .pop-up");
const mainBtn = document.querySelector("#main button");
const showBtn = document.querySelector("#show-page .pop-up__btn");

mainBtn.addEventListener("click", (event) => {
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
    setTimeout(() => {
      console.log("complete set donuts!");
    }, 1000);
  });
  //pop-up 사라지고 1초 후부터 정답 도넛 설정해, 도넛 하나씩 나오게 하기
  //도넛이 전부 출력되면 다음 페이지 스크롤하기
}
