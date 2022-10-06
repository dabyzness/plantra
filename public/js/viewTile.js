const tilesContainer = document.querySelectorAll(".posts");

tilesContainer.addEventListener("click", handleClick);

function handleClick(e) {
  const plantId = e.target.id;

  if (!plantId) {
    return;
  }

  window.location.href = window.location.href + `/plants/${plantId}`;
}
