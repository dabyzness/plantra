const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const editBtns = document.querySelectorAll(".fa-pen");
let submitBtn;

editBtns[0].addEventListener("click", handleUsernameEdit);
editBtns[1].addEventListener("click", handleBioEdit);

function handleUsernameEdit(e) {
  const currUsername = usernameEl.textContent;

  const formEdit = document.createElement("form");
  formEdit.setAttribute("method", "post");
  formEdit.setAttribute("action", `/profiles/${currUsername}?_method=PATCH`);
  formEdit.innerHTML = `<input type='text' name="username" minLength='3' maxLength='25' autocomplete="off" value='${currUsername}'> <button type="submit"><i class="fas fa-solid fa-check"></i></button>`;

  usernameEl.innerHTML = "";
  usernameEl.append(formEdit);
}

function handleBioEdit(e) {
  const currBio = bioEl.textContent;
  const currUsername = usernameEl.textContent;

  const formEdit = document.createElement("form");
  formEdit.setAttribute("method", "post");
  formEdit.setAttribute("action", `/profiles/${currUsername}?_method=PATCH`);
  formEdit.innerHTML = `<textarea name="bio" cols="20" rows="4" placeholder="Bio" autocomplete="off">${currBio}</textarea> <button type="submit"><i class="fas fa-solid fa-check"></i></button>`;

  bioEl.innerHTML = "";
  bioEl.append(formEdit);
}
