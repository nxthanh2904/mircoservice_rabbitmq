const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    _id: {
        type : Number,
        required: true
    },
    tags:[{
        type: String,
        required : true
    }],

    status :{
        type: String,
        required : true,
    },

    mobile :{
        type : Boolean,
        required : true
    },

    image:[{
        type: String,
        required: true
    }],

    link: {
        type: String,
        required: true
    },

    title:{
        type: String,
        required: true,
    },

    sapo:{
        type: String,
        required: true,
    },

    publicDate:{
        type: Date,
        required: true,
    },

    thumbnail:{
        type: String,
        required: true,
    },

    category:{
        id : Number,
        name: String
    },

    website:{
        id: Number,
        name: String,
    },

    sourceCode:{
        type: String,
        required: true,
    },
    text:{
        type: String,
        required: true,
    },
    numberOfWords:{
        type: Number,
        required: true,
    },

    sentences:[],
},{
    timestamps: true,
});

module.exports = mongoose.model('articles', ArticleSchema);

