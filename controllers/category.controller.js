// Controller for creating the category

// POST localhost:8888/ecomm/api/v1/categories

// {
//   "name": "Electronics
//   "description": "This is a description of electronics
// }

const category_model=require("../models/category.model")

exports.createNewCategory=async (req,res)=>{
    // Read the req body

    // Create the category object
    const cat_data={
        name:req.body.name,
        description:req.body.description
    }
    try{
        // Insert into mongodb
        const category=await category_model.create(cat_data)
        return res.status(201).send(category)
    }catch(e){
        console.log(`Error while creating the category ${e}`);
        return res.status(500).send({
            message:"Error while creating the category"
        })
    }

    // return the response of the created category
}