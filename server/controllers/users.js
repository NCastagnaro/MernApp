import User from "../models/User.js"       //Imports our User model 


/*READ============================================================================*/
export const getUser = async (req,res) => {
    try{
        //same things as 'const id = req.params.id'    We now have a variable "id" that we destructured from req.params
        const { id } = req.params                   //we grab the id from the req.params. This code uses destructuring assignment to extract the id property from the params object in the req object. It assumes that the req object has a params property, which is an object containing the id property.By using { id } instead of params.id, we can create a variable named 'id' that has the value of params.id. This code is commonly used in web applications to extract dynamic values from the URL path.
        const user = await User.findById(id)        //We use that id to grab the document from our database. We find the document in our database that has an id that matches that. And we assign that to a variable called "user"
        res.status(200).json(user)                  //We send back response back to client with HTTP status code of 200. The purpose of this line is to send a successful response back to the client in JSON format, containing the user data retrieved from the database with the matching "id"
    }catch(err){
        res.status(404).json({message: err.message})
    }
}

//this function grabs all the user's friends related to the "id" that you specified
export const getUserFriends = async (req,res) =>{
    try{
        //similar to the "getUser" function, we want to find the user again
        const { id } = req.params
        const user = await User.findById(id)                                        //Used to find the user with the given "id"
                                                                                    //The map() method is used to iterate over the friends array of the retrieved user object. Inside the map() method, the findById() method of the 'User' model is used to find eah friend's details
        const friends = await Promise.all(                                          //Promise.all() method is used to wait for all the promises returned from 'User.findById(id)' to resolve. Promise.all() is used here because the map() method creates an array of promises that resolve tto the 'User' documents of each friend in the 'user.friends' array
            user.friends.map((id) => User.findById(id))                             //Remember that the 'friends' property inside the User model is an array. This line calls the map() method on the user.friends array and returns an array of promises, where each promise is the result of calling the User.findById() method with the corresponding 'id' from the user.friends array
        )                                                                           //By using Promise.all(), we an wait for all of these promises to resolve before continuing with the execution of the code. Once all of the promises have resolved, the resolved values are returned in an array, which we can then use to format the friend's data and send it back to the client.
                                                                                    //If we didn't use Promise.all(), the map() method would return an array of promises, and we would need to use 'await' to wait for eah promise to resolve before continuing with the execution of the ode. This would make the code less efficient and harder to read.
                                                                                    //The retireved friends array is mapped using the map() method to format the friend's data to be returned to the client.
        const formattedFriends = friends.map(                                       //The formattedFriends data is returned in an array containing objects with properties: _id,firstName,lastName,occupation,location,picturePath
            ({_id,firstName,lastName,occupation,location,picturePath}) => {         
                return {_id,firstName,lastName,occupation,location,picturePath}
            }                                                                         
        )
        res.status(200).json(formattedFriends)                                      //The function ends, and the client received a response with the friend's data.
        }catch(err){
            res.status(404).json({message: err.message})
        }
}



/*UPDATE================================================================================================*/
export const addRemoveFriend = async (req,res) => {
    try{
        //same as 'const id = req.params.id' and 'const friendId = req.params.friendId'
        const {id, friendId} = req.params                                   //Grabs the 'id' and 'friendId' from req.params
        const user = await User.findById(id)                                //Grab the current user again
        const friend = await User.findById(friendId)                        //Also grab the friend information
        
        if(user.friends.includes(friendId)){                                //If the 'friendId' is included in the main user's friend 
            User.friends = user.friends.filter((id) => id !== friendId) 
            friend.friends = user.friends.filter((id) => id !== id)
        }  else{
             user.friends.push(friendId)                                    //We push the 'friendId' into the friends array from our User model   
             user.friends.push(id)                                          //We push the 'id' into the friends array from our User model 

        }  
        await user.save()                                                   //
        await friend.save()                                                     
    
        const friends = await Promise.all(       
            user.friends.map((id) => User.findById(id))
        )   
                                                                                                                                                  
        const formattedFriends = friends.map(                                     //We format it once again because we want the friends list to be formatted as we did before. So, we use the same code to format that we used in the getUserFriends function  
        ({_id,firstName,lastName,occupation,location,picturePath}) => {            
            return {_id,firstName,lastName,occupation,location,picturePath}
        }                                                                         
    )
        res.status(200).json(formattedFriends)                                  //we format the friends to the front end so that the front end can use it .
        } catch(err){
        res.status(404).json({message: err.message})
    }
}

