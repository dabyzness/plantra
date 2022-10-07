const feedEl = document.querySelector(".feed-container");

feedEl.addEventListener("scroll", handleScroll);

let pageNum = 0;

function handleScroll({ target }) {
  if (target.scrollHeight - target.scrollTop === target.clientHeight) {
    getPosts();
  }
}

async function getPosts() {
  const response = await fetch(`/posts/all/${pageNum}`);
  const posts = await response.json();

  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post-container");

    const postHead = document.createElement("div");
    postHead.classList.add("post-header");
    postHead.innerHTML = `
    <img src="${post.owner.avatar}" alt="avatar"/>
    <a href="/profiles/${post.owner.username}">${post.owner.username}</a>`;

    const postBody = document.createElement("div");
    postBody.classList.add("post-body");
    postBody.innerHTML = `<a href="/posts/${post._id}">
    <img class="post-image" src="${post.img}" alt="" /></a>
    `;

    const postFoot = document.createElement("div");
    postFoot.classList.add("post-footer");
    postFoot.innerHTML = `
    <span>${post.likes} <i class="fas fa-light fa-heart"></i></span>
    <span>${post.comments.length} <i class="fas fa-solid fa-comment"></i></span>
    <p>${post.description}</p>`;

    postDiv.append(postHead, postBody, postFoot);
    feedEl.appendChild(postDiv);
  });

  pageNum += 1;
}

getPosts();
