// Global app controller
import Search from './models/Search';
import Recipie from './models/Recipie';
import List from './models/List';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as searchView from './views/searchView';
import * as likesView from './views/likesView';
import {elements,renderLoader,clearLoader} from './views/base';
import Likes from './models/Likes';
/**Global state of app
 * -search object
 * -current recipe object
 * -shopping list object
 * -liked recipies 
 */

 const state = {};


 /**
  * SEARCH CONTROLER
  */

 //This function is called whenever the form is submitted
 const controlSearch = async() => {
     //1.)Get query from view
     const query =  searchView.getInput();
     //console.log(query);
      

     //New search object
     if(query){
         //2.)new search object and add to state
         state.search = new Search(query);
         //3.)prepare UI for results

         //clear input field
         searchView.clearInput();
         //clear Results
         searchView.clearResults();
         //loader animation
         renderLoader(elements.searchRes);

         try{
        //4.)Search for recipie
         await state.search.getResults();

         //5.)Render results on UI
         //clear loader
         clearLoader();
         searchView.renderResults(state.search.result);
         }catch(error){
             alert('Something wrong with the search...');
             clearLoader();
         }       
     }  

 }

 elements.searchForm.addEventListener('submit', e =>{
     e.preventDefault();
     controlSearch();
 });

 elements.searchResPages.addEventListener('click', e => {
     const btn = e.target.closest('.btn-inline')
    if(btn){
        const goToPage =parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
        //console.log(goToPage);
    }
 });
  /**
  * RECIPIE CONTROLER
  */
   const controlRecipe = async () => {
       //Get ID from the url
       const id = window.location.hash.replace('#','');
       //console.log(id);

       if(id){
           //prepare UI for changes
           recipeView.clearRecipe();
             renderLoader(elements.recipe);

             //Highlight selected search item
             if(state.search)
             searchView.highlightSelected(id);

           //create new recipe object
           state.recipe = new Recipie(id);

           try {
            //Get recipe data and parse ingrdeints
           await state.recipe.getRecipe();
           state.recipe.parseIngredients();

           //claculate servings and time
             state.recipe.calcTime();
             state.recipe.calcServing();
             
           //Render recipe
           clearLoader();

           recipeView.renderRecipe(
               state.recipe,
               state.likes.isLiked(id)
               );
          // console.log(state.recipe);

           }catch(error){
               alert('Error processing recipe!');
           }     
       } 
   };

 // window.addEventListener('hashchange',controlRecipe);
 //window.addEventListener('load',cntrolRecipe)

 //add the same eventlistener to multip;e evenets
 ['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

 /**
  * List Controller
  */
 const controlList = () => {
     //Create a new list If there is none yet
     if(!state.list) state.list = new List();

     //Add each ingredient to the List and UI
     state.recipe.ingredients.forEach(el => {
       const item =  state.list.addItem(el.count,el.unit,el.ingredient);
       listView.renderItem(item);
     });
 }

 //Handle delete and update list item events
 elements.shopping.addEventListener('click', e => {
     const id = e.target.closest('.shopping__item').dataset.itemid;

     //Handle the delete button
     if(e.target.matches('.shopping__delete, .shopping__delete *')) {
         //Delete from state
         state.list.deleteItem(id);

         //Delete from UI
         listView.deleteItem(id);

         //Handle the count update
     } else if(e.target.matches('.shopping__count-value')){
        
         const val = parseFloat(e.target.value,10);
         state.list.updateCount(id,val);
     }
 });

 /**
  * Like Controller
  */
  
 

 const controlLke = () => {
     if(!state.likes) state.likes = new Likes();
     const currentId = state.recipe.id;

     //User has not  yet liked the current recipe
     if(!state.likes.isLiked(currentId)) {
         // Add like to the data
         const newLike = state.likes.addLike(
             currentId,
             state.recipe.title,
             state.recipe.author,
             state.recipe.img
         );
  
         // Toggle the like button
         likesView.toogleLikeBtn(true);

         // ADd like to UI list
         likesView.renderLike(newLike)
         

    //User has liked the current recipe
     }else {
         // Remove like from the state
         state.likes.deleteLike(currentId);

         // Toggle the like button
         likesView.toogleLikeBtn(false);

         // Remove like from UI list
         likesView.deleteLike(currentId);
     }
     likesView.toogleLikeMenu(state.likes.getNumLikes());  
     
 };

 //Restore like recipies on page load
 window.addEventListener('load',() => {
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();
    // Toggle like menu btton
    likesView.toogleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like =>likesView.renderLike(like));
 });


//Handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
    //Here we check whether the evnet happen on btn-dcrease or to any child element of btn-decrease . For that we used *.
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
       
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        //Add ingredient to the shopping list
        controlList();

    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLke();
    }
    
});

 