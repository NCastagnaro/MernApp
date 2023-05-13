//This is the file we use for our Post Schema

import mongoose from "mongoose"         //Helps set up our model

//When you create a Mongoose model, you create a schema first
const PostSchema = new mongoose.Schema(
    {
       userid:{
        type:String,
        require:true
       },   
       firstName:{
        type:String,
        require:true
       },
       lastName:{
        type:String,
        require:true
       },
       location:String,
       description:String,
       picturePath:String,
       userPicturePath:String,
       likes:{
        type:Map,                   //We save our likes as a Map type. We could use an array, but a Map is more efficient/performant, especially for large scale apps.  If you like the post, you will add to this Map. If you don't like it, you are going to remove that Map
        of:Boolean                  //We have a value of Boolean. All we have to do is check if the userid exists in this map and the value is going to always be 'true' if it exists. 
       },
        comments:{
            type:Array,
            default:[]
        }
    },
    {timestamps:true}            //This will give us automatic dates for when it's created
    )

    const Post = mongoose.model("Post",PostSchema)      //We pass our schema into mongoose.model and assign it to a variable we call 'User'

    export default Post                                 //We export 'User' so that this model can be used in other files 