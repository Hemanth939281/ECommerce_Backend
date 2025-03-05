const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
    product_id:{
        type: String,
        required: true,
        trim: true,
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    image:{
        type: Object,
        required: true,
    },
    category:{
        type: String,
        required: true
    },
    checked:{
        type: Boolean,
        default: false
    },
    sold:{
        type: Number,
        default: 0
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Products", productsSchema);