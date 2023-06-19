const personalKey = "alex-viet";
const baseHost = "https://wedev-api.sky.pro/api";
const postsHost = `${baseHost}/v1/${personalKey}/instapro`;

// Отображение списка постов
export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((responseData) => {
      return responseData.posts;
    });
}

// Отображение постов конкретного пользователя
export function getUserPosts({ token, id }) {
  return fetch(postsHost + "/user-posts/" + id, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((responseData) => {
      return responseData.posts;
    });
}

// Добавление поста
export function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description,
      imageUrl,
    })
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Ошибка: не переданы изображение, либо описание");
      }

      return response.json();
    })
    .then((responseData) => {
      return responseData.posts;
    });
}

// Удаление поста конкретного пользователя
export function deletePost({ token, id }) {
  return fetch(postsHost + "/" + id, {
    method: "DELETE",
    headers: {
      Authorization: token,
    }
  })
}

// Поставить лайк
export function like({ token, id }) {
  return fetch(postsHost + "/" + id + "/like", {
    method: "POST",
    headers: {
      Authorization: token,
    }
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Поставить лайк могут только авторизованные пользователи");
    }
    return response.json();
  })
}

// Убрать лайк
export function dislike({ token, id }) {
  return fetch(postsHost + "/" + id + "/dislike", {
    method: "POST",
    headers: {
      Authorization: token,
    }
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Поставить лайк могут только авторизованные пользователи");
    }
    return response.json();
  })
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
// Регистрация нового пользователя
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

// Авторизация пользователя
export function loginUser({ login, password }) {
  return fetch(baseHost + "/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}
