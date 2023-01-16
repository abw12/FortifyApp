import { API_URL } from './config.js';
import { getJSON } from './helper.js';

const state = {
  recipe: {},
};

const loadRecipe = async function (id) {
  try {
    const body = await getJSON(`${API_URL}/${id}`);

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
    console.log(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { loadRecipe, state };
