import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path" //This comes built in with node
import { fileURLToPath } from "url";  //This line and the one before will allow us to properly set the paths when we configure directories later on  
import authRoutes from "./routes/auth.js"       //This gives us access to the auth.js file inside of our routes folder 
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import {register} from "./controllers/auth.js"  //This is a reference to our auth.js file inside of our controllers folder 
import {createPost} from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";     //Import veryifyToken function to use as middleware in app.post below
import User from "./models/User.js"
import Post from "./models/Post.js"; 
import {users, posts} from "./data/index.js"            //There is a 'users' section and a 'posts' section inside our index.js file inside the data folder. We are importing that here. 

/*Configurations=================================================================*/
const __filename = fileURLToPath(import.meta.url)       //
const __dirname = path.dirname(__filename)      
dotenv.config();        //Allows us to use env files
const app = express()  
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
 
//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()) //invoke our cross origin resource sharing policies
app.use("/assets",express.static(path.join(__dirname, 'public/assets')))    //This sets the directory of where we keep our assets. We store this locally but in production we'd store this in cloud storage probably


/*File Storage ===================================================================*/
//How to save files - from Github for multer package
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, "public/assets")   //Anytime someone uploads a file into your website, it will be saved to this folder
    },
    filename:function (req,file,cb){
        cb(null,file.originalname)
    }
})

const upload = multer({storage})    //anytime we need to upload a file, we will be using this variable



/*Routes with files  ====================================================================== */
//This would usually be contained in our routes folder. However, we need the upload variable right above, which is why we need to keep this here and can't move it to our routes folder 
app.post("/auth/register,", upload.single("picture"),register)  //upload.single("picture") is a middleware function that needs to run before we run our 'register' controller
app.post("/posts", verifyToken, upload.single("picture"),createPost)    //We can't just include our app.use below. We also need to make it so the user can upload a picture when they create a post


/*Routes  ==================================================================================*/
app.use("/auth",authRoutes)
app.use("/users", userRoutes)
app.use("/posts",postRoutes)




/*Mongoose Setup ==================================================*/
const PORT = process.env.port || 5008       //If our port that we set up in our env file is unavailable, we will try and connect to a different port. In this case, it is port 5008
mongoose.connect(process.env.MONGO_URL, {   //This connects to the actual database from our node server. And we are using the MONGO_URL that we created inside our .env file 
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(() => { //This is what happens after we connect
    app.listen(PORT, () => console.log( `Server Port ${PORT}`))

/*========================Add Data One Time - so make sure to comment these next two lines out after you run your code once and add in the data to your database.=========================== */ 
// After we execute our code once, we can see that we inserted all of our mock data from our index.js file inside our 'data' folder into our MongoDB database. We want to comment out the next two lines bc we don't want to keep inserting the data everytime we spin up our server.
  
    //User.insertMany(users)
    //Post.insertMany(posts)
}).catch((error) => console.log(`${error} did not connect`))
