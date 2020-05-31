import axios from 'axios';
export default class Recipie {
    constructor(id){
        this.id = id;
    }

   async getRecipe(){
       try{
        const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
        this.title = res.data.recipe.title;
        this.author = res.data.recipe.publisher;
        this.img = res.data.recipe.image_url;
        this.url = res.data.recipe.source_url;
        this.ingredients = res.data.recipe.ingredients;    
        //console.log(res);
       } catch(error) {
           console.log(error);
           alert('Something Wnt wrong :(');
       }
       
   };
   calcTime(){
       //Assuming that we need 15 min for each 3 ingredients
       const numIng = this.ingredients.length;
       const periods = Math.ceil(numIng/3);
       this.time = periods*15
   };
   calcServing() {
       this.servings = 4;
   }

   parseIngredients(){
       const unitsLong =['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
       const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
       const units = [...unitsShort, 'kg','g'];

       const newIngredients = this.ingredients.map(el => {
           //1.) Uniform units
           let ingredient = el.toLowerCase();
           unitsLong.forEach((unit,i) => {
               ingredient = ingredient.replace(unit, unitsShort[i]);
           });

           //2.) Remove parentheses
           ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

           //3.) Parse ingredients into count, unit and ingredient
           //using split we converted all the ingrdients into array
           const arrIng = ingredient.split(' ');
           /**
            *  eg:"4 ounces cream cheese, room temperature"
            * In the above format we get the ingredients so we need tho seperate the content in three parts
            *  -> Count,-> unit ,->Ingredeignt
            * so we need to find the index of element to seperate it
            * to seperate we use split with space. Now each word is is splited and stored in a array.
            * now finding the index of unitShort(eg;tbs,oz) element in splited array so we can easily sperate unitIndex.
            * while slice() will not count the last element.
            * final output will be => 0: {count: 4, unit: "oz", ingredient: "cream cheese, room temperature"}
                                          
            */
          
           const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

           let objIng;
           if(unitIndex > -1){
               //there is a unit
               //Ex. 4 1/2 cups, arrCount is [4,1/2 
               //Ex. 4,cups, arrcount is [4]
               const arrCount = arrIng.slice(0,unitIndex);

               let count;
               if(arrCount.length === 1){
                   count = eval(arrIng[0].replace('-','+'));
               } else {
                   count = eval(arrIng.slice(0, unitIndex).join('+'));
               }
               objIng = {
                   count,
                   unit:arrIng[unitIndex],
                   ingredient:arrIng.slice(unitIndex +1).join(' ')
               };

               //const arrCount = arrIng.slice(0,unitIndex);
           } else if(parseInt(arrIng[0],10)) {
               //There is no Unit,but 1st element is a number
               objIng = {
               count: parseInt(arrIng[0],10),
               unit:'',
               ingredient: arrIng.slice(1).join(' ')
               }
           } 
           else if(unitIndex === -1){
               //There is no unit and No in 1st position
               objIng = {
                count: 1,
                unit: '',
                ingredient
            }
           }
           return objIng;

       });
       this.ingredients = newIngredients;
   }

   updateServings(type){
       //Servings
       const newServings = type === 'dec' ? this.servings -1 :this.servings + 1;
   
       //Ingredients
       this.ingredients.forEach(ing => {
           ing.count *= (newServings/this.servings)
       })


       this.servings = newServings
   }
};

