import icons from 'url:../../img/icons.svg';
import View from './View';
import previewView from './previewView';

class SearchResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `Recipe is not found with given query.Please try with some other keyword 🙂`;
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SearchResultsView();
