import icons from 'url:../../img/icons.svg';

//exporting it as a class here and not an instance
export default class View {
  //changing all the private field '#' to the protected fields '_' since we are using parcel and polyfill
  //so the old browser don't yet support these syntax for private fields
  _data;

  //all these method are common in most of the view related classes/objects
  //hence we decalred them in parent class called View which can be inherited in child class
  //so via prototype chain all these method can be used by child classes
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    //this will give us the latest value from the view which got updated after some event
    const newDOM = document.createRange().createContextualFragment(newMarkup); //this method will convert the string to the DOM object
    const newElement = Array.from(newDOM.querySelectorAll('*')); //converting the Nodelist output to Array using Arrays.From() method

    //this will give us the current value from the view which were there before making an update on page
    const curElement = Array.from(this._parentEl.querySelectorAll('*'));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];
      // console.log(curEl, newEl.isEqualNode(curEl)); //the isEqualNode() method will compare content of each node from current element with new element

      //here we want to only update the text on the UI instead of rendering the entire page
      //to achieve this we are getting the current Element and the updated (newElement) from the view
      //the above querySelectorAll("*") will give us all the node(html node) from the current page on UI
      //now we have to identify which node are change ,meaning which node content have been changed after performing some event
      //so the isEqualNode method does that comaparision , though we also want to check for only the node and elements which have
      //textContent in it and are changed after updating some event on UI
      //so for that reason we have to use another of Node called Node.nodevalue() which return null if its an element or someother thing
      //but return the actual text if that element have some textContent
      //the firstchild method will point at the textConent for element which are having text and nodevalue will return that text for textContent elements

      //updating the text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //updating the attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          return curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
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
