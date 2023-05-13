import express from "express"
import { getUser, getUserFriends, addRemoveFriend} from "../controllers/users.js"                      //This provides a reference to the controllers that we will be utilizing in our routes. Without importing these, we wouldn't be able to include the controllers in our routes.  
import {verifyToken} from "../middleware/auth.js"     //Comes from the verifyToken async function that we exported from our auth.js file in out middleware folder

const router = express.Router()

//  "/users" goes in front of these routes ==================================================================================

// Read
router.get("/:id", verifyToken, getUser)                        //This statement helps to get the user.We have a query parameter we call "id". That id is being stored with req.params.id. The req.params.id enables us to grab the values that came after the colon that are in our route. We can use any variable we want. In this case we used "id" to represent the string we want to grab and use. Just make sure your variables that you use for query parameters are consistent. 
router.get("/:id/friends", verifyToken, getUserFriends)         //This statement helps get the user's friends. Notice that verifyToken is being utilized in between as middleware before the getUserFriends controller can execute. 

//Update
router.patch("/:id/:friendId", verifyToken, addRemoveFriend)   

export default router                                           //allows us to export this router with the three controllers associated with it. 