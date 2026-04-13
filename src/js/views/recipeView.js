//img svg 最后被parcel给浏览器他们的url会变成哈希值 但是parcel的过程中svg可能会转化错误不能变成正确的哈希值 最终在浏览器不能正常渲染 因此在用svg的url时直接用parcel后的路径
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fraction.js';
import View from './view.js';

//有变量有函数 用类封装起来 这样有些数据访问不到
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find the recipe , please try another one!';
  _message;

  addHandleRender(handle) {
    ['load', 'hashchange'].forEach(ev => window.addEventListener(ev, handle));
  }

  addHandleBookMark(handle) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.bookmark-btn');
      if (!btn) return;
      handle();
    });
  }

  //在调用此函数之前 你就已经渲染过一次view 就已经拿过一次data数据 此时的数据还未改变
  addHandleUpdateServings(handle) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      handle(updateTo);
    });
  }
  //展示到ui的数据都是从model的state拿的 所以ui改变数据的逻辑代码在model执行 得到的数据传到state上或者更新state的数据 这样view得到的数据是会变化的 这样渲染出来的也会变化

  _generateMarkup() {
    return `<figure class="recipe__fig">
          <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings" data-updateTo="${this._data.servings + 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-updateTo="${this._data.servings - 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round bookmark-btn">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookMarked === true ? '-fill' : ''}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarupIngredients).join(' ')}
      
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }
  _generateMarupIngredients(ing) {
    return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity).toString() : ''}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
               ${ing.description}
              </div>
            </li>`;
  }
}

export default new RecipeView();
