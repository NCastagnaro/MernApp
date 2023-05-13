import Post from "../models/Post.js"                //Reference to our Post model
import User from "../models/User.js"

/*CREATE*/
export const createPost = async(req, res) => {
    try{
        const { userId, description,picturePath} = req.body    //This is everything that the front end is sending to us to use here
        const user = await User.findById(userId)
        const newPost = new Post({                              //Utilize our Post constructor from the Post.js file inside our models folder. 
            userId,
            firstName: user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes:{},                                        //likes is an empty object because it starts at 0 likes. 
            //e.g. likes:{"someid":true}                    //This is an example of what it will look like. This determines if someone liked the post or not. If they are not listed, they didn't like it. 
            comments:[]
        })
        await newPost.save()                                //We save our newPost into the mongoDB 

    const post = await Post.find()                          //We then grab all the posts from our database
    res.status(201).json(post)                              //We return all the posts from our database to the frontend. 201 represents you created something
    } catch(err){
        res.status(409).json({message:err.msg})             //409 code used for error of creating it
    }
}


/*READ*/
export const getFeedPosts =  async(req, res) => {                   //grabs all the posts of everyone
    try{
        const post = await Post.find()                              //We grab all the posts from our database
        res.status(200).json(post)                                  //200 is just a successful request  
    }catch(err){
        res.status(404).json({message:err.msg})                     //404 code used for error of not being able to find it
    }

}

export const getUserPosts = async (req, res) => {
    try{
        const {userId} = req.params                                 //We grab the userId
        const posts = await Post.find({userId})                      //We want to find the document(s) in our database associated with that 'userId'. 
        res.status(200).json(posts)                                  //200 is just a successful request. We send the posts back to the front end  
    }catch(err){
        res.status(404).json({message:err.msg})                     //404 code used for error of not being able to find it
    }
}

/*UPDATE*/

export const likePost = async (req, res) => {
    try{
        const { id }  = req.params                                    //We grab the relevant post from our req.params. The id comes from the query string
        const {userId} = req.body                                     //We grab the userId from the req.body because that is how we will be sending it from the front end
        const post = await Post.findById(id)                           //We find the document in our database that has that specific id. We assign it to a value of 'post'
        const isLiked = post.likes.get(userId)                         //Within that post, we check if the 'userId' exists within our likes property, which remember is an object. If the userid exists, then that means that post has been liked by that particular person. If it doesn't exist then that means that post has not been liked by that particular person.    
        
        if(isLiked){
            post.likes.delete(userId)                                  //For our likes, we have a list where all the keys have all the userId values. And if that exists, we are going to delete it
        }else{
            post.likes.set(userId, true)                                //If the userId doesn't exist as part of the list, we will set userId to true, thus adding it to the list.
        }
        
        const updatedPost = await Post.findByIdAndUpdate(               //This is how we update a specific post. 
            id,                                                         //we pass in 'id'
            {likes:post.likes},                                         //We pass in 'likes' to our new post that we have been modifying. So, this is going to be the list of likes that we modified
            {new:true}                                                  //'new' is set to 'true' because we want a new object
        )
        
        res.status(200).json(updatedPost)                                  //We pass in the updated post so that we can update the front end. We have to always update the frontend, once you hit the like button
    }catch(err){
        res.status(404).json({message:err.msg})                     //404 code used for error of not being able to find it
    }
}