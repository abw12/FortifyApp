import View from './View';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = `Recipe is successfully uploaded :)`;

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  //we are using the constructor in this class since we don't have any controller for this class
  //as we need the add recipe form to be shown on click of the add recipe button on GUI
  //so once this event is trigger we need this class to be loaded and load the add and close handler function immedietly
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      //FormData is an JS api which gives us access tot all the form fields data filled on UI on submit button
      const dataArr = [...new FormData(this)]; //so here the this keyword will point to the html class on which addEventListner is invoked which is parentEl here
      //since js 19 we a method to convert the array entries(array of array) to the JS object
      const data = Object.fromEntries(dataArr);
      handler(data); //invoking the controlAddRecipe fn in the controller class
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
