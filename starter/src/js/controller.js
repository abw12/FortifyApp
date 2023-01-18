import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import searchResultView from './views/searchResultView.js';

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

    //1) fetching the recipe details
    //calling the model to load the data
    //since the loadRecipe function is a async function we have to await for it
    //since its not returining anything so no need to assign a variable to it to store its value
    await model.loadRecipe(id);

    //2) rendering therecipe on UI
    recipeView.render(model.state.recipe);

    //we can't simply all the function from recipeview class for event handlers
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

    const query = searchView.getQuery();
    if (!query) return;

    //this will set the response from http call in model state ie. model.state.recipe.results
    await model.loadSearchResults(query);

    //after fetching the recipes dislpay them as a list using pagination (page size by default is 10)
    searchResultView.render(model.getRecipePerPage());
  } catch (err) {
    console.log(err);
  }
};

//creating init method which will initiliaze all the methods on controller module which can be invoked from view module on some event
//this way of handling event is done using the publisher-subscriber design pattern
// where the controller is the subscriber (subscribing to the events happened in view)
//and the view is the publisher (publishing the event by listening to the addEventListener and calling the callback function
//for example controlRecipes passed below in the addHandlerEvent() function )
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

//initializing  all the controller functions
init();
