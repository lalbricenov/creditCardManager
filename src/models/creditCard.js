const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Structure of what constitutes a credit card
const CreditCardSchema = new Schema({
    banco: {
        type: String,
        required: [true, "El nombre del banco no puede estar vacío"]
    },
    lastFour: {
        type: Number,
        required: true
    },
    franquicia:  {
        type: String,
        required: true
    },
    nameOnCard:  {
        type: String,
        required: true
    },
    cupoTotal:  {
        type: Number,
        required: true
    },
    deudaTotal:{
        type:Number,
        required:true
    },
    validThru:{
        type:Date,
        required:true
    },
    color:{
        type:String,
        default:"#000000"
    },
    nota: String
});

// model receives 2 arguments: name of the collection and a Schema. 
// A collection is a group of documents, it is the equivalent of a table in mysql. A document is the equivalent of a record or row in mysql.
// when the model is used to save in the database it uses the collection that was declared here.
// The database that is used is the one to which the app is connected to.
module.exports = mongoose.model('creditCards', CreditCardSchema);

