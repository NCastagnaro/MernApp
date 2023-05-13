//This is the file we use for our User Schema

import mongoose from "mongoose"         //Helps set up our model

//When you create a Mongoose model, you create a schema first
const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type:String,
            required:true,
            min:2,
            max:50
        },
        lastName: {
            type:String,
            required:true,
            min:2,
            max:50
        },
        email: {
            type:String,
            required:true,
            max:50,
            unique:true     //Makes it so you can't have the same emails
        },
        password: {
            type:String,
            require:true,
            min:5
        },
        picturePath: {
            type:String,
            default:""
        },
        friends:{
            type:Array,
            default:[]
        },
        location:String,
        occupation:String,
        viewedProfile:Number,
        impressions:Number
    }, {timestamps:true}            //This will give us automatic dates for when it's created
    )

    const User = mongoose.model("User",UserSchema)      //We pass our schema into mongoose.model and assign it to a variable we call 'User'

    export default User                                 //We export 'User' so that this model can be used in other files 