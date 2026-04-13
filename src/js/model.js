import { API_URL, PAGE_NUM, KEY } from './config.js';
import { getJSON, sendJSON } from './views/helper.js';
//把获取到的数据放在state里面
export const state = {
  recipe: {
    bookMarked: false,
  },
  search: {
    query: '',
    results: [],
    page: 1,
    perPageNum: PAGE_NUM,
  },
  bookMarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
};

export const loadRecipe = async function (id) {
  try {
    //异步函数的返回值是promise 所以你要返回具体的值记得加await还有return
    const data = await getJSON(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);
    //当你点击其他食谱时 这些食谱都是从api中获取的 所以并没有bookMarked的属性 所以可以根据bookMarks数组去判断是否被收藏
    if (state.bookMarks.some(bookMark => bookMark.id === recipe.id))
      state.recipe.bookMarked = true;
    else {
      state.recipe.bookMarked = false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchPageResult = function (page) {
  state.search.page = page;
  //把要到达的页数上传 根据页数得到该页的结果
  const start = (page - 1) * state.search.perPageNum; //0
  const end = page * state.search.perPageNum; //9+1
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookMarks = function () {
  localStorage.setItem('bookMarks', JSON.stringify(state.bookMarks));
};

export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);
  if (state.recipe.id === recipe.id) state.recipe.bookMarked = true;
  persistBookMarks();
};

export const deleteBookMark = function (id) {
  const index = state.bookMarks.findIndex(el => id === el.id);
  state.bookMarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookMarked = false;
  persistBookMarks();
};

const init = function () {
  const storage = localStorage.getItem('bookMarks');
  if (storage) state.bookMarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format!Please use the correct format!',
          );
        }
        const [quantity, unit, discription] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, discription };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cooking_time,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark();
  } catch (error) {
    throw error;
  }
};
