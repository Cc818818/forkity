import icons from 'url:../../img/icons.svg';
import View from './view';
import { PAGE_NUM } from '../config';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandleRender(handle) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const page = +btn.dataset.goto;
      handle(page);
    });
  }
  _generateMarkup() {
    //根据结果数量计算要分成多少页
    const pageSummary = Math.ceil(this._data.results.length / PAGE_NUM);
    //根据当前页数设置按钮样式
    const curPage = this._data.page;
    //在第一页 只有下一页
    if (curPage === 1 && pageSummary > 1)
      return `
    ${this._goNext(curPage)}
          `;
    //在其他页 有上一页和下一页
    if (curPage < pageSummary)
      return `${this._goBack(curPage)}
    ${this._goNext(curPage)}`;
    //在最后一页 只有上一页
    if (curPage === pageSummary)
      return `
         ${this._goBack(curPage)}`;
    //只有一页 没有按钮
    return '';
  }
  _goBack(curPage) {
    return `
          <button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
  }
  _goNext(curPage) {
    return `
          <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
  }
  //在按钮属性记录了要去的页数 设置点击事件时 利用冒泡原理 得到子按钮 得到其属性页数 传给controller函数 再渲染页面即可
}

export default new paginationView();
