import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${sec} sec`));
    }, sec * 1000);
  });
};

// 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    const body = await res.json();

    if (!res.ok) throw new Error(`Failed to fetch recipe:  ${body.message}`);
    return body; //returning a new resolved promise (which is the body of the fecth response)
  } catch (err) {
    //re-throw the error to be catched in the calling function
    throw err;
  }
};
