import icons from 'url:../../img/icons.svg';

//exporting it as a class here and not an instance
export default class View {
  //changing all the private field '#' to the protected fields '_' since we are using parcel and polyfill
  //so the old browser don;t yet support these syntax for private fields
  _data;

  //all these method are common in most of the view related classes/objects
  //hence we decalred them in parent class called View which can be inherited in child class
  //so via portotype chain all these method can be used by child classes
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    //to clear the previous context of the html on the particular container
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markUp = `<div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(message = this._message) {
    const markUp = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }
}
