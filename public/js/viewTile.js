const postsContainer = document.querySelectorAll(".post > img");
const plantsContainer = document.querySelectorAll(".plant > img");

postsContainer.forEach((postEl) => {
  postEl.addEventListener("click", handleClick);
});
plantsContainer.forEach((plantEl) => {
  plantEl.addEventListener("click", handleClick);
});

function handleClick(e) {
  const plantId = e.target.id;

  if (!plantId) {
    return;
  }

  if (e.target.parentElement.classList[1] === "plant") {
    console.log(window.location);
    const splitArr = window.location.href.split("/");
    const username = splitArr[splitArr.length - 1].split("?")[0];

    window.location.href = `${window.location.origin}/profiles/${username}/plants/${plantId}`;
  } else if (e.target.parentElement.classList[1] === "post") {
    window.location.href = `${window.location.origin}/posts/${plantId}`;
  }
}
