const tileContainer = document.querySelector(".tile-container");

tileContainer.addEventListener("click", handleClick);

function handleClick(e) {
  const plantId = e.target.parentElement.id;

  if (!plantId) {
    return;
  }

  window.location.href = window.location.href + `/plants/${plantId}`;
}
