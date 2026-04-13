import icons from 'url:../../img/icons.svg';
import View from './view';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe be found ! Please try again:)';

  _generateMarkup() {
    return this._data.map(book => previewView.render(book, false)).join('');
  }
}

export default new ResultsView();
