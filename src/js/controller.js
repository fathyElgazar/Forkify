import { async } from "regenerator-runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_SEC_CLOSE } from "./config.js";

// to keep the page unchanged when saved
// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // mark recipe
    resultsView.update(model.getSearchResultPage());
    // update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 1) load recipe
    await model.loadRecipe(id);
    // 2) render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    resultsView.renderSpinner();
    //1 Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2 load search
    await model.loadSearchResult(query);

    //3 render results
    resultsView.render(model.getSearchResultPage());

    // 4 render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1 render new results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2 render new  pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // 1 update the recipe serving in the State
  model.updateServing(newServing);

  // update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // update book marks
  recipeView.update(model.state.recipe);
  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // load spinner
    addRecipeView.renderSpinner();

    //upload the newRecipe data
    await model.uploadRecipe(newRecipe);

    // render newRecipe
    recipeView.render(model.state.recipe);
    // display success message
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);
    // change the id in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    console.log(model.state.recipe.id);
    // close the window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_SEC_CLOSE * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerRenderServing(controlServing);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

// clearBookmarks();
