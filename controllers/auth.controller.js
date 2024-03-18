//logic to register a user

const bcrypt=require('bcryptjs');
const user_model=require('../models/user.model')
const auth_config=require("../configs/auth.config")
const jwt=require("jsonwebtoken");

exports.signup=async (req,res)=>{
    // logic to create the user

    //1. Read the request body
    const request_body=req.body //(JS object)

    //2. Insert the data in the Users collection in MongoDB
    const userObj={
        name:request_body.name,
        userId:request_body.userId,
        email:request_body.email,
        userType:request_body.userType,
        password:bcrypt.hashSync(request_body.password,8)
    }

    try{
        const user_created=await user_model.create(userObj)
        //return this user
        const res_obj={
            name:user_created.name,
            userId:user_created.userId,
            email:user_created.email,
            userType:user_created.userType,
            createdAt:user_created.createdAt,
            updatedAt:user_created.updatedAt
        }
        res.status(201).send(res_obj) //successfully created

    }catch(e){
        console.log(`Error while registering the user ${e}`);
        res.status(500).send({ //internal server error
            message:"Some error happened while registering the user"
        }) 
    }
    //3. Return the response back to the user

}

exports.signin=async (req,res)=>{
    //Check if the user_id is present in the system
    const user=await user_model.findOne({userId:req.body.userId})

    if(user==null){
        return res.status(400).send({
            message:"User id passed is not a valid user id"
        })
    }
    //Password check
    const isPasswordValid=bcrypt.compareSync(req.body.password,user.password)
    if(!isPasswordValid){
        return res.status(401).send({
            message:"Wrong password passed"
        })
    }

    //Using JWT we will create the access token with a given TTL and return
    const token=jwt.sign({id:user.userId},auth_config.secret,{
        expiresIn:120 //seconds
    })

    res.status(200).send({
        name:user.name,
        userId:user.userId,
        email:user.email,
        userType:user.userType,
        accessToken:token
    })
}
    
