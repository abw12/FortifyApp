import { async } from 'regenerator-runtime';
import { API_URL, RECIPE_PER_PAGE } from './config.js';
import { getJSON } from './helper.js';

const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    resultsPerPage: RECIPE_PER_PAGE,
  },
};

const loadRecipe = async function (id) {
  try {
    const body = await getJSON(`${API_URL}${id}`);

    let { recipe } = body.data; //using destructuring the object
    // console.log(recipe); //this res object recipe have few fields which are with the _ underscore mark which we don't want  so re-mapping bloew
    //now we want to map the response object to our model
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      imageUrl: recipe.image_url,
      sourceUrl: recipe.source_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const res = await getJSON(`${API_URL}?search=${query}`);
    // console.log(res);
    state.search.results = res.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
      };
    });
    console.log(state.search.results);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getRecipePerPage = function (page = state.search.page) {
  state.search.page = page;

  //calculating start and end dynamically ,if page=1 then start will be 1-1 * 10 = 0  and end will be 1*10=10
  //since slice method exclude last index so it will be 0-9
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    return (ing.quantity = (ing.quantity * newServing) / state.recipe.servings);
    // formula newQuantity = oldQuantity * newServing / oldServing;
  });

  //update the new servings in model
  state.recipe.servings = newServing;
};

export {
  loadRecipe,
  loadSearchResults,
  getRecipePerPage,
  updateServings,
  state,
};
