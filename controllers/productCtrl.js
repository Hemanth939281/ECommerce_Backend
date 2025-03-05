const Products = require("../Models/productModel")
const Category = require("../Models/categoryModel")

class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filtering(){
        const queryObj = {...this.queryString};
        const excludedFields = ["page","sort","limit"];
        excludedFields.forEach(el => delete(queryObj[el]));
        let queryStr = JSON.stringify(queryObj);
        queryStr =queryStr.replace(/\b(gte|gt|lte|lt|regex)\b/g, match => '$' + match)
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(",").join("");
            this.query = this.query.sort(sortBy);
            return this;
        }
        else{
            this.query = this.query.sort("-createdAt");
            return this;
        }
    }

    pagination(){
        const page = this.queryString.page*1 || 1;
        const limit = this.queryString.limit*1 || 12;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    
}

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            console.log(req.query)
            const features = new APIFeatures(Products.find(), req.query).filtering().sorting().pagination();
            const products = await features.query;
            res.json({status:'success',
                result: products.length,
            products:products})
            
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createProducts: async (req, res) => {
        try {
            const { product_id, title, content, description, price, category, image } = req.body;
            if (!image) return res.status(400).json({ message: "No image provided" });
            
            const product = await Products.findOne({ product_id: product_id });
            if (product) return res.status(400).json({ message: "Product already exists" });
            
            let existingCategory = null;
            if (category) {
                existingCategory = await Category.findOne({ name: category });
            }
    
            // If the category doesn't exist, create it
            if (!existingCategory && category) {
                if (!category.trim()) return res.status(400).json({ message: "Category name cannot be empty" });
                existingCategory = new Category({ name: category });
                await existingCategory.save();
            }
            
            const newProduct = new Products({ product_id: product_id, title, content, description, price, category, image });
            await newProduct.save();
            res.status(201).json({ message: "Product created successfully", product: newProduct });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

     deleteProducts: async(req, res) =>{
        try {
            await Products.findOneAndDelete({_id: req.params.id });
            res.json({ message: "Product deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
     },

     updateProducts: async(req, res) =>{
        try {
            const { title, content, description, price, category,image } = req.body;
            const updatedProduct = await Products.findOneAndUpdate( {_id: req.params.id} , { title, content, description, price, category,image }, { new: true });
            res.json({msg:"Product updated successfully"});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
     },

     getProductById: async (req, res) => {
        try {
            const product = await Products.findOne({_id: req.params.id });
            if (!product) return res.status(404).json({ message: "Product not found" });
            res.json(product);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    


}

module.exports = productCtrl;