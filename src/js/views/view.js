import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //view要更新视图中的一部分 不需要重新渲染一遍 创建一个update函数将HTML（和之前的是一样的 只是里面的变量数据不一样）变成dom 然后和之前的比对 一个节点一个节点的看 如果不一样就更改
  update(data) {
    if (!data) return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup(); //再次调用这个函数时 里面的state数据已经更新了 所以是新的HTML
    const newDOM = document.createRange().createContextualFragment(newMarkup); //把新的HTML文本转化为dom文件 获得里面所有节点的数组
    const newElements = Array.from(newDOM.querySelectorAll('*')); //获得dom文件中的元素节点数组
    const curElement = Array.from(this._parentElement.querySelectorAll('*')); //获得当前容器内的所有元素 还都是旧的数据 因为新的HTML没有放进去
    //更换文本内容
    newElements.forEach((newEl, i) => {
      const curEl = curElement[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) //为什么要看第一个孩子 因为如果是父类容器 子元素不同父元素也会不同 这样就会直接换掉里面全部内容 因此要看父元素第一个节点是不是文本 如果不是就知道这个是父元素 不会替换 继续往下看里面的子元素节点
      {
        curEl.textContent = newEl.textContent;
      }
      //更换属性内容
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  //一个功能就用一个函数
  _clear() {
    this._parentElement.innerHTML = '';
  }
  //渲染加载器
  renderSpinner() {
    const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
            <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;
  }
}
