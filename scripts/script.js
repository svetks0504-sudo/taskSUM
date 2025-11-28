const BASE_URL = "https://jsonplaceholder.typicode.com";

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

const getPosts = fetchData("/posts");
const getUsers = fetchData("/users");
const getComments = fetchData("/comments");
