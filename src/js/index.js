import Search from './models/search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';
import List from './models/list';
import Likes from './models/likes';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';

console.log(likesView);
/*Global state of he app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked
*/
const state={}



/**
*SEARCH CONTROLLER
 */
const controlSearch =async() =>{
    //1. Get query from view
    const query = searchView.getInput();
    

    if(query) {
        //2 - New search object and add to state
        state.search = new Search(query);

        //3-Prepare Ui for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
        //4- search for recipes
        await state.search.getResults();

        //5- Render results on Ui
        clearLoader();
        searchView.renderResults(state.search.result);
        }catch(err){
            alert('Something wrong with the Search ..');
            clearLoader();
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {

    e.preventDefault();
    controlSearch();
});


elements.searchForm.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parse(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }

});
/**
*RECIPE CONTROLLER
 */

const controlRecipe = async() =>{
    //Get ID from url
    const id = window.location.hash.replace('#','');
    

    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //HIGHLIGHT selected search item
        if (state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id)
       

        try {
         //Get recipe data and pase ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //Calculate serving and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        //render recipe
        clearLoader();
        state.likes.isliked;
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
            );
        } catch (err) {
            console.log(err);
            alert('Error processing recipe');
        };
       
    };
}
//window.addEventListener('hashchange',controlRecipe);
//window.addEventListener('load',controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event , controlRecipe));

/**
*LIST CONTROLLER
 */
 const controlList = () =>{
     //Create a new list IF there is none yet
     if(!state.list) state.list = new List();

     //Add each ingredients to the list and UI
     state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
     });
 };

 //Handle delete and update list item events
 elements.shopping.addEventListener('click', e =>{
     const id = e.target.closest('.shopping__item').dataset.itemid;

     //Handle the delete button
     if(e.target.matches('.shopping__delete, .shopping__delete *')){
         //delete from state
         state.list.deleteItem(id);

         //Delete from Ui
         listView.deleteItem(id);

         //Handle the count update
      } else if(e.target.matches('.shopping__count-value')){
         const val = parseFloat(e.target.value, 10)
         state.list.updateCount(id, val);
     };
     });
 
 /**
 LIKE CONTROLLER
  */



  const controlLike = () => {
      if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has not yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );

        //Toggle the like button
        likesView.toggleLikeBtn(true);


        //Add like to Ui list 
        likesView.renderLike(newLike);
    //User has liked current recipe
    }else {
        //Remove like from the state
        state.likes.deleteLike(currentID);

        //toggle the link button
        likesView.toggleLikeBtn(false);

        //Remove like from Ui list
        console.log(state.likes)
        likesView.deleteLike(currentID);
    }
    console.log(likesView);
      likesView.toggleLikeMenu(state.likes.getNumLikes());

  };

  //restore liked recipes on page load
  window.addEventListener('load',() => {
      state.likes = new Likes();
      //Restore likes
      state.likes.readStorage();

    //Toggle like menu button
   
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
  });

// Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease buttons is clicked
        if(state.recipe.servings > 1){
         state.recipe.updateServings('dec');
         recipeView.updateServingsIngredients(state.recipe);

        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
         state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);


    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        controlLike();
    }
    
});


