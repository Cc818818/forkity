import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookMarkView from './views/bookMarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////
//使加载完之后还在原来的那个页面
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchPageResult(model.state.search.page));
    bookMarkView.update(model.state.bookMarks);
    //加载食谱
    //调用异步函数 如果你要得到异步函数的数据 就得等异步函数处理完之后 要用await
    await model.loadRecipe(id);
    //渲染食谱
    recipeView.render(model.state.recipe);
  } catch (error) {
    //可以把这里要用到的来自view model的函数的错误throw出来传给controller
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResult(query);
    //渲染初始搜索结果
    resultsView.render(model.getSearchPageResult(1));
    //渲染分页按钮
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (page) {
  resultsView.render(model.getSearchPageResult(page));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlBookMark = function () {
  if (!model.state.recipe.bookMarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookMarkView.render(model.state.bookMarks); //每次收藏夹有变化都渲染一次
};

const controlBookMarks = function () {
  bookMarkView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookMarkView.addhandleBookMark(controlBookMarks);
  recipeView.addHandleRender(controlRecipe);
  searchView.addHandleRender(controlSearchResults);
  paginationView.addHandleRender(controlPagination);
  recipeView.addHandleUpdateServings(controlServings);
  recipeView.addHandleBookMark(controlBookMark);
  addRecipeView.addHandleUpload(controlAddRecipe);
};
init();
//在View创建函数封装事件监听器 然后在controller中创建另一个函数并View的函数中上传事件监听器的回调函数
//一般是controller调用model和view的函数
