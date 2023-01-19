import icons from 'url:../../img/icons.svg'; //parcel 2 now load any static file(non-programming files like images,video,etc) like this
import View from './View';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination'); //fields start with # are private to this class

  addHandlerClick(handler) {
    //adding the event listener on the parent div itself
    //hen even if we click outside the buttons it will trigger this event listener callback function
    //therefore first we check if btn!=null else we return
    //its callback function is not immedietly called
    this._parentEl.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline'); //getting the closest element to this given class,in upward direction hierarchy in html
      if (!btn) return;
      const goToPage = +btn.dataset.goto; //adding '+' in-front of a string converts it to number
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numOfPages);

    const curPage = this._data.page;

    //1)Page 1 and there are others pages
    if (this._data.page === 1 && numOfPages > 1) {
      return this._generateNextBtnMarkUp(curPage);
    }
    //2)last page
    if (this._data.page === numOfPages && numOfPages > 1) {
      return this._generatePrevBtnMarkup(curPage);
    }
    //3) other page
    if (this._data.page < numOfPages) {
      return this._generatePrevBtnMarkup(curPage).concat(
        this._generateNextBtnMarkUp(curPage)
      );
    }
    //4) page 1 and there are no other pages
    //since if any above condition is not satisfied then only this scenario remains
    return '';
  }

  _generatePrevBtnMarkup(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
  </button>`;
  }

  _generateNextBtnMarkUp(curPage) {
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
        </svg>
  </button>`;
  }
}

export default new PaginationView();
