import { async } from 'regenerator-runtime';
import { API_URL, RECIPE_PER_PAGE, API_KEY } from './config.js';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';

const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    resultsPerPage: RECIPE_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    imageUrl: recipe.image_url,
    sourceUrl: recipe.source_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    ...(recipe.key && { key: recipe.key }), //if response(recipe) does not have any key property then spread operator will return empty else it'll add a key:recipe.key property into recipe object
  };
};

const loadRecipe = async function (id) {
  try {
    const body = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    let { recipe } = body.data; //using destructuring the object
    // console.log(recipe); //this res object recipe have few fields which are with the _ underscore mark which we don't want  so re-mapping bloew
    //now we want to map the response object to our model
    state.recipe = createRecipeObject(recipe);

    //some method is like any match in the given list then it return true else it return false
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const res = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(res);
    state.search.results = res.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    console.log(state.search.results);
    state.search.page = 1;
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

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const addBookmark = function (recipe) {
  //add to  bookmark
  state.bookmarks.push(recipe);

  //mark the current recipe
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; //this will add a new property called bookmarked if not present in recipe object

  //update list in localStorage
  persistBookmark();
};

const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  //remove a bookmark
  state.bookmarks.splice(index, 1);

  //mark the current recipe
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //update list in localStorage
  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('booksmarks');
};
// clearBookmarks(); //only calling this function in the dev test

const uploadRecipe = async function (data) {
  try {
    //convert the object to array entries(array of array)
    const ingredients = Object.entries(data)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            `Wrong input format for ingredient.Please enter data in comma seperated format Eg:"quantity,unit,description"`
          );

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity !== '' ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: data.title,
      source_url: data.sourceUrl,
      image_url: data.image,
      publisher: data.publisher,
      cooking_time: +data.cookingTime,
      servings: +data.servings,
      ingredients,
    };

    console.log(recipe);
    const res = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(res.data.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export {
  loadRecipe,
  loadSearchResults,
  getRecipePerPage,
  updateServings,
  addBookmark,
  removeBookmark,
  uploadRecipe,
  state,
};
