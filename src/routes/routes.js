const express = require('express');
const router = express.Router();
const sanitize = require('mongo-sanitize');

const CreditCard = require('../models/creditCard'); // This model will be used to create new credit cards
const User = require('../models/user');

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
router.get('/register', function(req, res){
    res.render('pages/register.ejs');
})
router.post('/register', function(req, res){
    // console.log(req.body);
    if (req.body.email && req.body.username &&req.body.password &&req.body.passwordConf) {
        if(req.body.password == req.body.passwordConf)
        {
            let userData = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
              }
              //use schema.create to insert data into the db
              let user = new User(userData);
              console.log("Aqui" + user);
              user.save(userData, function (err, user) {
                if (err) {
                  return res.send(err);//next(err)
                } else {
                  return res.send(user);
                }
            });
        }
        else{
            res.send("No coinciden las contraseñas")        ;
        }
      }
      else{
        res.send("Campos incompletos o un error ocurió")
      }
    
});
router.get('/login', function(req, res){
    console.log("Aqui")
    res.render('pages/login.ejs');
})
router.post('/login', function(req, res){
    if (req.body.email &&
        req.body.password) {
        var userData = {
          email: req.body.email,
          password: req.body.password,
        }
        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
          if (err) {
            return res.redirect('/profile');
          } else {
            return res.redirect('/profile');
          }
        });
      }
    console.log("Aqui");
    res.render('pages/login.ejs');
})

router.get('/profile', function(req, res){
    res.send("Profile");
})
module.exports = router;