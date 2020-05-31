export default class Likes {
    constructor() {
        this.likes= []; 
       }
       addLike(id,title,author,img){
           const like = {id,title,author,img}
           this.likes.push(like);

           //Persist the data in local storage
           this.persistData();

           return like;
       }
       deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1);

        //delete the data from local storage
        this.persistData();
       }

       isLiked(id) {
           return this.likes.findIndex(el => el.id === id) !== -1;
       }

       getNumLikes() {
           return this.likes.length;
       }
       persistData() {
           //Json.stringify will convert array into strings
           localStorage.setItem('likes',JSON.stringify(this.likes))
       }
       readStorage(){
           //JSON.parse will convert the string back  into array
           const storage = JSON.parse(localStorage.getItem('likes'));

           //Restore like from the localStorage
           if(storage) this.likes =storage;
       }
}