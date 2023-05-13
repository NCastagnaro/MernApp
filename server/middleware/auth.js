import jwt  from "jsonwebtoken";

export const verifyToken = async (req, res, next) =>{
    try{
        let token = req.header("Authorization")             //From the request from the frontend, we are grabbing the "Authorization" header. The frontend will be setting this and we are able to grab it in the backend. 
        if(!token){
            return res.status(403).send("Access Denied")    //This handles the case where the token does not exist. That means they're not even sending it. So, if that happens we will deny access 
        }

        if(token.startsWith("Bearer ")){                        //We want the token to start with "Bearer ". This will be set on the front end. The token will be placed after the space in the "Bearer " string we are using
            token = token.slice(7, token.length).trimLeft()     //We are going to take everything from the right side of this "Bearer ". That is how we are grabbing the actual token
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)  //Again, we are using the secret string
        req.user = verified
        next()                                                  //We will run the next function, after this middleware executes properly 
    }catch(err){
        res.status(500).json({error:err.message})
    }
}