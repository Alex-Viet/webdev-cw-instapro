import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, renderApp, user } from "../index.js";
import { deletePost, dislike, like } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl, userPosts }) {

  const postsHtml = posts
    .map((post, index) => `
              <li class="post">
                <div class="post-header" ${userPosts ? 'style="display: none;"' : ''}  data-user-id="${post.user.id}">
                    <img src="${post.user.imageUrl}" class="post-header__user-image">
                    <p class="post-header__user-name">${post.user.name}</p>
                </div>
                <div class="post-image-container">
                  <img class="post-image" src="${post.imageUrl}">
                </div>
                <div class="post-likes">
                  <div class="likes">
                    <button data-index="${index}" data-post-id="${post.id}" class="like-button">
                      ${post.isLiked ? '<img src="./assets/images/like-active.svg"></img>' : '<img src="./assets/images/like-not-active.svg"></img>'}
                    </button>
                    <p class="post-likes-text">
                      Нравится: <strong>${post.likes.map(({ name: value }) => value).join(', ')}</strong>
                    </p>
                  </div>
                  ${user && post.user.id === user._id ? `<button data-post-id="${post.id}" class="delete-button">Удалить</button>` : ''}
                </div>
                <p class="post-text">
                  <span class="user-name">${post.user.name}</span>
                  ${post.description}
                </p>
                <p class="post-date">
                  ${formatDistanceToNow(new Date(post.createdAt), {locale: ru})}
                </p>
            </li>`)
    .join('');

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <div class="posts-user-header" ${userPosts ? '' : 'style="display: none;"'}">
                    <img src="${posts[0].user.imageUrl}" class="post-header__user-image" style="width: 70px; height: 70px">
                    <p class="post-header__user-name" style="font-size: 22px">${posts[0].user.name}</p>
                </div>
                <ul class="posts">
                  ${postsHtml}
                </ul>
                <div class="btn-up btn-up_hide"></div>
              </div>`

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  };

  const toggleLikes = ({ postId }) => {
    const index = posts.findIndex((post) => post.id === postId);
    if (posts[index].isLiked) {
      dislike({ token: getToken(), id: postId })
        .then((object) => {
          posts[index].likes = object.post.likes;
          posts[index].isLiked = false;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        })
    } else {
      like({ token: getToken(), id: postId })
        .then((object) => {
          posts[index].likes = object.post.likes;
          posts[index].isLiked = true;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        })
    }
  }

  const likeButtonElems = document.querySelectorAll(".like-button");

  for (const likeButtonElem of likeButtonElems) {
    likeButtonElem.addEventListener(("click"), (event) => {
      event.stopPropagation();

      if (!user) {
        alert("Поставить лайк могут только авторизованные пользователи");
        return;
      }

      const postId = likeButtonElem.dataset.postId
      toggleLikes({ postId });
    })
  }

  const deleteButtonElems = document.querySelectorAll(".delete-button");

  for (const deleteButtonElem of deleteButtonElems) {
    deleteButtonElem.addEventListener(("click"), (event) => {
      event.stopPropagation();

      const id = deleteButtonElem.dataset.postId;
      deletePost({ token: getToken(), id })
        .then(() => {
          goToPage(POSTS_PAGE);
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        })
    })
  }

  const buttonUp = {
    el: document.querySelector('.btn-up'),
    scrolling: false,
    show() {
      if (this.el.classList.contains('btn-up_hide') && !this.el.classList.contains('btn-up_hiding')) {
        this.el.classList.remove('btn-up_hide');
        this.el.classList.add('btn-up_hiding');
        window.setTimeout(() => {
          this.el.classList.remove('btn-up_hiding');
        }, 300);
      }
    },
    hide() {
      if (!this.el.classList.contains('btn-up_hide') && !this.el.classList.contains('btn-up_hiding')) {
        this.el.classList.add('btn-up_hiding');
        window.setTimeout(() => {
          this.el.classList.add('btn-up_hide');
          this.el.classList.remove('btn-up_hiding');
        }, 300);
      }
    },
    addEventListener() {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        if (this.scrolling && scrollY > 0) {
          return;
        }
        this.scrolling = false;

        if (scrollY > 400) {
          this.show();
        } else {
          this.hide();
        }
      });

      const btnUp = document.querySelector('.btn-up');

      btnUp.onclick = () => {
        this.scrolling = true;
        this.hide();

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    }
  }

  buttonUp.addEventListener();
}