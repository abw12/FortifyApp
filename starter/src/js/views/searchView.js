class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  _clear() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    //selecting the main div element here and listening for submit event for ofrm so that w=even if user press enter it will listen for that event
    this._parentEl.addEventListener('submit', function (e) {
      //this is very important as the app will immedietely listen for the hashChange event once the recipe id changes onLoad
      //it trigger the hashChange event immedietly when we press on submit button ,so before we set all the data into our searchResult model
      //hence id will remain blank and the validation will fail and no recipe will be displayed ,therefore we are using preventDefault()
      // method and not invoking the handler immedietely unless some click on href link in side menu list
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
