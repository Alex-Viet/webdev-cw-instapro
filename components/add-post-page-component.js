import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

let imagePostUrl = "";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
                <div class="page-container">
                  <div class="header-container"></div>
                  <div class="form">
                    <h3 class="form-title">Добавить пост</h3>
                    <div class="form-inputs">
                      <div class="upload-image-container">
                        <div class="upload=image">
                          <label class="file-upload-label secondary-button">
                              <input type="file" class="file-upload-input" style="display:none">
                              Выберите фото
                          </label>
                        </div>
                      </div>
                        <label>
                          Опишите фотографию:
                          <textarea class="input textarea" rows="4"></textarea>
                        </label>
                        <button class="button" id="add-button">Добавить</button>
                    </div>
                  </div>
                </div>`;

    appEl.innerHTML = appHtml;

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.querySelector(".textarea").value.trim();

      if (!description) {
        alert("Добавьте описание");
        return;
      }

      if (!imagePostUrl) {
        alert("Добавьте изображение");
        return;
      }

      onAddPostClick({
        description: description,
        imageUrl: imagePostUrl,
      });
    });
  };

  render();

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  const uploadImageContainer = appEl.querySelector(".upload-image-container");

  if (uploadImageContainer) {
    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imagePostUrl = newImageUrl;
      },
    });
  }
}
