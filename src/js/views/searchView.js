 import {elements} from './base';
 

 //search input value is return into getinput function
 export const getInput = () =>
     elements. searchInput.value;

//Clear search input field
export const clearInput = () =>{
    elements.searchInput.value ="";
};

//clear results
export const clearResults = () => {
    elements.searchResList.innerHTML ='';
    elements.searchResPages.innerHTML ='';
};

export const highlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

//Shorten titles for search result for that here we use a small algorithm
/**
 * 'Pasta with tomato and spinach'
 *  acc:0 /acc + curr.length = 5  --> newTitle =['Pasta]
 * acc:5 /acc + curr.length = 9  --> newTitle =['Pasta','with']
 * acc:9 /acc + curr.length = 15  --> newTitle =['Pasta','with','tomato']
 * acc:15 /acc + curr.length = 18  --> newTitle =['Pasta','with','tomato']
 * acc:18 /acc + curr.length = 24  --> newTitle =['Pasta','with','tomato']
 
 */
export const limitRecipeTitle = (title, limit=17) => {
    const newTitle =[];
    if(title.length>limit){
        title.split(' ').reduce((acc,cur) => {
            if(acc+cur.length <= limit){
                newTitle.push(cur);
            }
            return acc+cur.length;

        },0);
        //return the result
        return `${newTitle.join(' ')}...`;
    }

}

const renderRecipie = recipie =>{
    const markup = `
                <li>
                    <a class="results__link results__link" href="#${recipie.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipie.image_url}" alt="${recipie.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipie.title)}</h4>
                            <p class="results__author">${recipie.publisher}</p>
                        </div>
                    </a>
                </li>
     
    `;
    //Here below says where we want to display the elements
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

//tpe: 'prev' or 'next'.
const createButton = (page, type)=> `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ?  page -1 : page+1}>
    <span>Page ${type === 'prev' ?  page -1 : page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ?  'left' : 'right'}"></use>
        </svg>
        
    </button>     
`;

const renderButtons = (page,numResults,resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if(page === 1 && pages>1) {
        // Only button to go to next page
        button = createButton(page,'next')
    } else if(page <pages){
        //both buttons
        button =`${createButton(page,'prev')}
                ${createButton(page,'next')}`;    
    } 
    else if(page === pages && pages>1) {
        //Only button to go to previous page
        button = createButton(page,'prev')
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults =(recipies,page = 1 ,resPerPage=10) =>{

    //render results of current page
    const start =(page-1)*resPerPage;
    const end =page*resPerPage
    recipies.slice(start,end).forEach(renderRecipie);

    //render pagination buttons
    renderButtons(page, recipies.length, resPerPage);
};
   