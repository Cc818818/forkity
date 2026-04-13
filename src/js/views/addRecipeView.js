import icons from 'url:../../img/icons.svg';
import View from './view';

class addRecipeView extends View {
  _parentElement = document.querySelector('.uploadults');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'ADD SUCCUSSFULLY!';

  constructor() {
    super();
    this._addHandlerShowWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //若不绑定 toggleWindow函数中的this指的是被绑定事件的元素
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandleUpload(handle) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; //获取表格中的数据 变成数组
      const data = Object.fromEntries(dataArr); //把数组变成对象
      handle(data);
    });
  }
}

export default new addRecipeView();
