//This file will start server
const express=require("express")
const mongoose=require("mongoose")
const app=express()
const server_config=require("./configs/server.config")
const db_config=require("./configs/db.config")
const user_model = require("./models/user.model")
const bcrypt=require( "bcryptjs")

app.use(express.json()) //convert JSON which is taken from Postman to JS Object

//Create an admin user at the starting of the application 
//if not already present

//Connection with MongoDB
mongoose.connect(db_config.DB_URL)

const db=mongoose.connection;

db.on("error",()=>{
    console.log(`Error while connecting to the MongoDB`);
})

db.once("open",()=>{
    console.log(`Connected to MongoDB`);
    init()
})


async function init(){

    try{
        let user=await user_model.findOne({userId:"admin"})
    
        if(user){
            console.log(`Admin is already present`);
            return
        }
        
    }catch(e){
        console.log(`Error while reading the data ${e}`);
    }

    try{
        user=await user_model.create({
            name:"PKP",
            userId:"admin",
            email:"pkparida@gmail.com",
            userType:"ADMIN",
            password:bcrypt.hashSync("Welcome1",8)
        })
        console.log(`Admin created ${user}`);
    }catch(e){
        console.log(`Error while create admin ${e}`);
    }
}

//Stich the route to the server
require("./routers/auth.routes")(app)
require("./routers/category.routes")(app)

//Start the sever
app.listen(server_config.PORT,()=>{
    console.log(`Server started at port num : ${server_config.PORT}`);
})