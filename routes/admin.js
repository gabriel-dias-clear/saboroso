var express = require('express');
var router = express.Router();
var users = require('./../inc/users')
var admin = require('./../inc/admin');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations')


router.use(function(req, res, next){
    if(['/login'].indexOf(req.url) === -1 && !req.session.user){
        res.redirect('/admin/login');
    }
    else{
        next()
    }
}) 
router.use(function(req,res, next){

    req.menus = admin.getMenus(req);
    next();
})
router.get('/logout', function(req, res, next){
    delete req.session.user;
    res.redirect('/admin/login');
})
router.get('/', function(req, res, next){
    admin.dashboard().then(data=>{
        res.render('admin/index', admin.getParams(req,{
            data
        }))
    }).catch(err=>{
        console.log(err)
    })
});

router.post('/login', function(req,res, next){
    req.body.email = req.fields.email
    req.body.password = req.fields.password
    if(!req.body.email){
        users.render(req, res, 'preencha o campo email');
    }
    else if(!req.body.password){
        users.render(req, res, 'preencha o campo senha');
    }
    else{
        users.login(req.body.email, req.body.password).then(user =>{
            req.session.user = user;
            res.redirect('/admin')
        }).catch(err=>{
            users.render(req, res, err.message)
        })
    }
})
router.get('/login', function(req, res, next){
    users.render(req,res, null)
});
router.get('/contacts', function(req, res, next){
    res.render('admin/contacts', admin.getParams(req))
});
router.post('/menu', function(req, res, next){
    console.log('chegou')
    menus.save(req.fields, req.files).then(results =>{
        console.log('Resultados:', results)
        res.send(results);
    }).catch(err=>{
        res.send(err);
    })
})
router.get('/menu', function(req,res, next){
    menus.getMenus().then(data => {
        res.render('admin/menu', admin.getParams(req,{
            data
        }))
    })
})
router.delete('/menu:id', function(req, res, next){
    menus.delete(req.params.id).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send(err)
    })
})
router.get('/emails', function(req, res, next){
    res.render('admin/emails', admin.getParams(req))
});
router.get('/reservations', function(req, res, next){

    reservations.getReservations().then(data=>{

        res.render('admin/reservations', admin.getParams(req, {
            date: {},
            data
        }))


    })

    
});
router.post('/reservations', (req,res,next)=>{
    console.log('CHEGAMOS AONDE NINGUEM CHEGOU')
    reservations.save(req.fields).then(results => {
        console.log('Resultados:', results)
        res.redirect('/admin/reservations')
    }).catch(err => {
        console.log('Deu erro:', err)
        res.send(err);
    })
})
router.get('/users', function(req, res, next){
    res.render('admin/users', admin.getParams(req))
});
module.exports = router