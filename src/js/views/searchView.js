import View from './view.js';

class SearchView extends View {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._parentElement.querySelector('.search__field').value = '';
    return query;
  }

  addHandleRender(handle) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handle();
    });
  }
}
export default new SearchView();
