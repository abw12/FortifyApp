import * as model from './model.js';
import { CLOSE_WINDOW_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultView from './views/searchResultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//two packages imported for polyfilling (used to support our app in old browsers)
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//this block is related to parcel where on each save it prevent the browser state to be refreshed/reload
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //0) update searchresultview to mark the selected search result
    searchResultView.update(model.getRecipePerPage());
    //1) update the bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2) fetching the recipe details
    //calling the model to load the data
    //since the loadRecipe function is a async function we have to await for it
    //since its not returining anything so no need to assign a variable to it to store its value
    await model.loadRecipe(id);

    //3) rendering the recipe on UI
    recipeView.render(model.state.recipe);

    //we can't simply call the function from recipeview class for event handlers
    //as we don't want the application logic to be used in views module and also don't want the views in the controller(application logic class)
    //therefore below code won't work as we are not setting the callback function(controlRecipe at the right time to listn for the events)
    //solution is to use the pub-sub model
    // recipeView.addHandlerEvent(controlRecipes);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    searchResultView.renderSpinner();

    // console.log(searchResultView);
    // 1)get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load the results
    //this will set the response from http call in model state ie. model.state.recipe.results
    await model.loadSearchResults(query);

    //3) render the results on UI
    //after fetching the recipes dislpay them as a list using pagination (page size by default is 10,start from page no.1 by default)
    searchResultView.render(model.getRecipePerPage());

    //4) Render initial pagination result
    //passing entire search object from the state
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) render the NEW results on UI
  searchResultView.render(model.getRecipePerPage(goToPage));
  //2) Render initial pagination result
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the new serving and adjust the ingredients quantity
  model.updateServings(newServings);

  //update and render the recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) add/remove a bookmark
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.removeBookmark(model.state.recipe.id);

  //2) update the recipeView with bookmared icon enalbe and disabled
  recipeView.update(model.state.recipe);

  //3) render the bookmark list
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render loading spinner
    addRecipeView.renderSpinner();

    //upload the recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render the recipe on UI
    recipeView.render(model.state.recipe);

    //display success message
    addRecipeView.renderMessage();

    //render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    //using the history api pushState method which update the state without reloading the page
    //1st parameter is state , 2sn is title,3rd is url to be updated
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close the form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_WINDOW_SEC * 1000);
  } catch (err) {
    console.error('⛔', err);
    addRecipeView.renderError(err); //we are catching all kind of error here and display error message on UI
  }
};

//creating init method which will initiliaze all the methods on controller module which can be invoked from view module on some event
//this way of handling event is done using the publisher-subscriber design pattern
// where the controller is the subscriber (subscribing to the events happened in view)
//and the view is the publisher (publishing the event by listening to the addEventListener and calling the callback function
//for example controlRecipes passed below in the addHandlerEvent() function )
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

//initializing  all the controller functions
init();
