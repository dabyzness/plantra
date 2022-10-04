const tabEls = document.querySelectorAll(".tab-group > li > a");
const tileContEls = document.querySelectorAll(".tile-container");
tabEls[0].addEventListener("click", handleClick);
tabEls[1].addEventListener("click", handleClick);

function handleClick(e) {
  console.log(e.target);
  tabEls.forEach((tab) => {
    tab.classList.remove("active");
  });

  e.target.classList.add("active");

  if (e.target.textContent === "Plants") {
    tileContEls[0].style.display = "none";
    tileContEls[1].style.display = "flex";
  } else {
    tileContEls[0].style.display = "flex";
    tileContEls[1].style.display = "none";
  }
}
