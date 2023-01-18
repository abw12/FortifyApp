import icons from 'url:../../img/icons.svg';
import View from './View';

class SearchResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `Recipe is not found with given query.Please try with some other keyword 🙂`;
  _message = '';

  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map(recipe => {
        return `<li class="preview">
            <a class="preview__link" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.imageUrl}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
              </div>
            </a>
          </li>`;
      })
      .join('');
  }
}

export default new SearchResultsView();
