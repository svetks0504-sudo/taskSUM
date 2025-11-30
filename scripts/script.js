const BASE_URL = "https://jsonplaceholder.typicode.com";

const containerForCarts = document.querySelector(".containerForCarts");
const usersSelect = document.querySelector(".usersSelect");
const reset = document.querySelector(".reset");

let posts = [];
let users = [];
let comments = [];

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

async function loadData() {
  try {
    const dateForCarts = await Promise.all([
      fetchData("/posts"),
      fetchData("/users"),
      fetchData("/comments"),
    ]);

    posts = dateForCarts[0];
    users = dateForCarts[1];
    comments = dateForCarts[2];

    renderPosts(posts);
    createOptionForUser();
  } catch (error) {
    console.error(error);
  }
}
function createOptionForUser() {
  usersSelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.textContent = "Bсе пользователи";
  usersSelect.appendChild(allOption);

  users.forEach((user) => {
    const opt = document.createElement("option");
    opt.value = String(user.id);
    opt.textContent = user.name;
    usersSelect.appendChild(opt);
  });
}

function createDivForCarts(post) {
  const author = users.find((user) => user.id === post.userId);

  const commentCount = comments.filter((c) => c.postId === post.id).length; //(количество коментареев)

  const oneCart = document.createElement("div");
  oneCart.className = "cart";
  oneCart.innerHTML = `
  <h1 class="post-title">${post.title}</h1>
  <h2>${author.name}</h2>
  <p>${post.body.slice(0, 100)}</p>
  <p>Kомментариев: ${commentCount}</p>
  <button class="read-more">Читать далее</button>
  `;
  containerForCarts.appendChild(oneCart);

  const btn = oneCart.querySelector(".read-more");
  const title = oneCart.querySelector(".post-title");

  function optionReadMore() {
    window.location.href = `/readMore.html?id=${post.id}`;
  }
  title.addEventListener("dblclick", () => {
    optionReadMore();
  });

  btn.addEventListener("click", () => {
    optionReadMore();
  });
}

function renderPosts(list) {
  containerForCarts.innerHTML = "";
  list.forEach((post) => createDivForCarts(post));
}

usersSelect.addEventListener("change", (event) => {
  const selectedUserId = event.target.value;
  const filteredPosts =
    selectedUserId === "All"
      ? posts
      : posts.filter((post) => String(post.userId) === selectedUserId);

  renderPosts(filteredPosts);
});

loadData();

reset.addEventListener("click", () => {
  usersSelect.value = "All";
  renderPosts(posts);
});
