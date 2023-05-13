import express  from "express";
import {login} from "../controllers/auth.js"        //imports a ontroller from our auth.js file

const router = express.Router()             //This piece of code allows Express to identify that these routes will all be configured. And it allows us to have these in separate files. It allows us to export router below and router will have access to the methods we associate with it in this file (get, post,put,delete,)

//All these routes have '/auth' in front of it since inside our index.js file we made the '/auth' route use this file. 

router.post("/login", login)   //This sends us to the auth.js file inside our controllers folder to handle the logging in.  

export default router