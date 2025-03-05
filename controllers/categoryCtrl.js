const Category = require("../Models/categoryModel"); 

const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find({});  
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createCategory: async(req, res) => {
        try {
            const { name } = req.body;
            const existingCategory = await Category.findOne({ name });

            if (existingCategory) {
                return res.status(400).json({ msg: "Category Already Exists" });
            }

            const newCategory = new Category({ name }); 
            await newCategory.save();

            res.json({ msg: "Created a Category" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    deleteCategory : async (req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) return res.status(404).json({ msg: "Category not found" });
            res.json({ msg: "Category deleted successfully" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
            if (!category) return res.status(404).json({ msg: "Category not found" });
            res.json({category, msg:"updated"});
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = categoryCtrl;
