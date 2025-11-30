const BASE_URL = "https://jsonplaceholder.typicode.com";

const btnBackToList = document.querySelector(".backToList");
const container = document.querySelector(".container");
const newPostForm = document.querySelector(".newPostForm");
const newTitle = document.querySelector(".newPostTitle");
const newBody = document.querySelector(".newPostBody");
const newAuthor = document.querySelector(".newPostAuthor");

let posts = [];
let users = [];
let comments = [];

//На странице readMore.html нужно получить id из URL:
const urlParams = new URLSearchParams(window.location.search);
const someId = Number(urlParams.get("id")); // id поста

async function fetchData(path) {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function backToList() {
  window.location.href = "index.html";
}
btnBackToList.addEventListener("click", () => {
  backToList();
});
function renderPostWithComments(post, author, comments) {
  container.innerHTML = "";

  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.innerHTML = `
<h1 class="titel">${post.title}</h1>
<h2>${author.name}</h2>
<p>${post.body}</p>
`;
  container.appendChild(postDiv);

  const titel = postDiv.querySelector(".titel");
  titel.addEventListener("dblclick", () => {
    backToList();
  });

  const commentsDiv = document.createElement("div");
  commentsDiv.className = "comments";

  comments.forEach((element) => {
    const commentEl = document.createElement("div");
    commentEl.innerHTML = `
    <h3>${element.name}</h3>
    <p>${element.body}</p>
  `;
    commentsDiv.appendChild(commentEl);
  });
  container.appendChild(commentsDiv);
}

async function loadData() {
  try {
    [posts, users, comments] = await Promise.all([
      fetchData("/posts"),
      fetchData("/users"),
      fetchData("/comments"),
    ]);

    if (someId) {
      const post = posts.find((post) => post.id === someId);
      if (!post) {
        container.innerHTML = "<p>Пост не найден</p>";
        return;
      }
      const author = users.find((user) => user.id === post.userId);
      const postComments = comments.filter(
        (coment) => coment.postId === post.id
      );

      renderPostWithComments(post, author, postComments);
    } else {
      renderPostsOnReadMore(posts);
    }
    allAuthorselect();
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Ошибка загрузки данных</p>";
  }
}

loadData();

// ########### Создание нового поста #####

function renderPostsOnReadMore(list) {
  container.innerHTML = "";
  list.forEach((post) => {
    const author = users.find((user) => user.id === post.userId);
    const commentCount = comments.filter(
      (coment) => coment.postId === post.id
    ).length;

    const postDiv = document.createElement("div");
    postDiv.className = "cart";
    postDiv.innerHTML = `
      <h1>${post.title}</h1>
      <h2>${author.name}</h2>
      <p>${post.body.slice(0, 100)}...</p>
      <p>Комментариев: ${commentCount}</p>
      <button class="read-more">Читать далее</button>
    `;
    container.appendChild(postDiv);
  });
}

function allAuthorselect() {
  newAuthor.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    option.title = user.name;
    newAuthor.appendChild(option);
  });
}
allAuthorselect();

newPostForm.addEventListener("submit", (element) => {
  element.preventDefault();

  const post = {
    id: posts.length + 1, // локальний id
    title: newTitle.value,
    body: newBody.value,
    userId: Number(newAuthor.value),
  };

  posts.unshift(post); // новый пост в начало локального массива
  renderPostsOnReadMore(posts);

  newPostForm.reset();
});
