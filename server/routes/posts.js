import express from "express";
import {getFeedPosts, getUserPosts, likePost} from "../controllers/posts.js"     //import our controllers from our posts.js file in our posts controller. This allows us to use them as part of our routes. 
import { verifyToken } from "../middleware/auth.js";

const router = express.Router()

/*READ*/
router.get("/", verifyToken, getFeedPosts)                      //This will grab the user feed when we are on the home page. 
router.get("/:userId/posts", verifyToken, getUserPosts)                       //We want to grab the relevant user's post only

/*UPDATE*/
router.patch("/:id/like", verifyToken, likePost)                //This handles liking and unliking posts       

export default router