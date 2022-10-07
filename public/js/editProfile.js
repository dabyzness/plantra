const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const editBtns = document.querySelectorAll(".fa-pen");

const currUsername = usernameEl.textContent;
const currBio = bioEl.textContent;
let submitBtn;
let click1 = 1;
let click2 = 1;

editBtns[0].addEventListener("click", handleUsernameEdit);
editBtns[1].addEventListener("click", handleBioEdit);

function handleUsernameEdit(e) {
  if (click1 > 0) {
    const formEdit = document.createElement("form");
    formEdit.style.display = "inline";
    formEdit.setAttribute("method", "post");
    formEdit.setAttribute("action", `/profiles/${currUsername}?_method=PATCH`);
    formEdit.innerHTML = `<input type='text' name="username" minLength='3' maxLength='25' autocomplete="off" value='${currUsername}'> <button type="submit"><i class="fas fa-solid fa-check"></i></button>`;

    usernameEl.innerHTML = "";
    usernameEl.append(formEdit);
  } else {
    usernameEl.innerHTML = `${currUsername} `;
  }
  click1 *= -1;
}

function handleBioEdit(e) {
  if (click2 > 0) {
    const formEdit = document.createElement("form");
    formEdit.setAttribute("method", "post");
    formEdit.setAttribute("action", `/profiles/${currUsername}?_method=PATCH`);
    formEdit.innerHTML = `<textarea name="bio" cols="50" rows="2" placeholder="Bio" maxLength="300" autocomplete="off" >${currBio}</textarea> <button type="submit"><i class="fas fa-solid fa-check"></i></button>`;

    bioEl.innerHTML = "";
    bioEl.append(formEdit);
  } else {
    bioEl.innerHTML = `${currBio}`;
  }

  click2 *= -1;
}
