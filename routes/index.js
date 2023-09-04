var conn = require('./../inc/db')
var express = require('express');
var menus = require('./../inc/menus')
var reservations = require('./../inc/reservations')
var contacts = require('./../inc/contacts')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  menus.getMenus().then(results =>{

    res.render('index', { 
      title: 'Restaurante Saboroso!',
      menus: results
    })

  })

 

});

router.get('/contacts', function(req, res, next){

  contacts.render(req, res)


})

router.post('/contacts', function(req, res, next){

  if(!req.body.name){
    contacts.render(req,res, 'digite o nome')
  } else if (!req.body.email) {
    contacts.render(req, res, 'digite o e-mail')
  } else if (!req.body.message){
    contacts.render(req, res, 'digite a mensagem')
  } else {
    contacts.save(req.body).then(results => {

      contacts.render(req, res, null, 'Contato enviado com sucesso!')

    }).catch(err=>{

      contacts.render(req, res, err.message)

    })
  }
  
})

router.get('/menus', function(req, res, next){

  menus.getMenus().then(results => {

    res.render('menu', {
      title: 'Menus',
      headerBG: 'images/img_bg_1.jpg',
      menus: results
    })

  })

})

router.get('/reservations', function(req, res, next){

  reservations.render(req, res)

})

router.post('/reservations', function(req, res, next){


    if(!req.body.name){
    reservations.render(req, res, "")
  } else if (!req.body.email){
    reservations.render(req, res, "Digite seu e-mail")
  } else if(!req.body.people){
    reservations.render(req, res, 'Selecione o número de pessoas')
  } else if (!req.body.date){
    reservations.render(req, res, 'Selecione a data')
  } else if (!req.body.time){
    reservations.render(req, res, 'Selecione a hora')
  } else {
    
    reservations.save(req.body).then(results => {

      reservations.render(req, res, null, "reserva realizado com sucesso")

    }).catch(err=>{

      reservations.render(req, res, err.message)

    })
  }

})

router.get('/services', function(req, res, next){

  res.render('services', {
    title: 'Serviços',
    headerBG: 'images/img_bg_1.jpg'
  })

})

module.exports = router;
