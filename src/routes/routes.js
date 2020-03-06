const express = require('express');
const router = express.Router();
const sanitize = require('mongo-sanitize');

const CreditCard = require('../models/creditCard'); // This model will be used to create new credit cards

// const Transaction = require('../models/transaction.js');

router.get('/', function (req, res) {
    let tarjetas = CreditCard.find(function(err, cards){
        if(err){
            let message = "Se produjo un error leyendo las tarjetas"
            return res.render('pages/home.ejs', {message:message});
        }
        else{
            console.log(cards);
            for (card of cards)
            {
                // card.validThru = new Date(card.validThru);
                card.fecha = `${card.validThru.getMonth()+1}/${String(card.validThru.getFullYear()).substring(2,4)}`;
                // let year = String(card.validThru.getFullYear()).substring(2,4);
                // console.log("hello", card.fecha);
            }
            
            res.render('pages/home.ejs', {cards: cards, message:''});// it will look for a folder named views
        }
        
    }); // This knows in what collection look for, because it is declared in the model in the file transaction.js    
})
router.get('/add', function(req, res){
    res.render('pages/add.ejs');
})
router.post('/add', function(req, res, next){
    console.log(req.body);

    let data = req.body;
    data.validThru = sanitize(data.validThru);// checks for { & and other symbols to avoid malicious code
    data.validThru = new Date(parseInt(data.validThru.substring(0,4)), parseInt(data.validThru.substring(5,7))-1)
    let tarjeta = new CreditCard(data);
    tarjeta.save(function(error, card){
        if(error)
        {
            console.log(error);
            res.send("Tarjeta añadida??");
        }
        else
        {
            let message = "Tarjeta añadida exitosamente";
            // console.log(card._id);
            res.redirect('/card/' + card._id);
        }
        // console.log(card);
    })
    
})

router.get('/card/:cardId', function(req, res){
    CreditCard.findById(req.params.cardId, function(err, card){
        if(err){
            let message = "Se produjo un error leyendo las tarjetas"
            return res.render('pages/home.ejs', {message:message});
        }else{
            console.log(card);
            res.send(req.params);
        }
        
    });
    
})



module.exports = router;