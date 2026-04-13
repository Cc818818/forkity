import icons from 'url:../../img/icons.svg';
import View from './view.js';
import previewView from './previewView.js';

class bookMarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!';
  addhandleBookMark(handle) {
    window.addEventListener('load', handle);
  }
  _generateMarkup() {
    return this._data.map(book => previewView.render(book, false)).join('');
  }
}

export default new bookMarkView();
