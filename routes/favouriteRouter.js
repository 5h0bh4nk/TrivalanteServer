const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../models/favourites');
const cors = require('./cors');
const authenticate = require('../authenticate');


const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.get(cors.cors, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOne({"user": req.user._id})
    .populate('favourites.user')
    .populate('favourites.dishes')
    .then((fav) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav);
    }, (err) => next(err))
    .catch((err)=>next(err)); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOne({"user": req.user._id})
    .then((fav)=>{
        if(fav!=null){
            for(var i=0; i<req.body.length; i++)
            if(!fav.dishes.includes(req.body[i]._id))
            fav.dishes.push(req.body[i]);

            fav.save()
            .then((fav)=>{
                Favourites.findById(fav._id)
                .populate('favourites.user')
                .populate('favourites.dishes')
                .then((fav)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                })
            },(err)=>next(err));
        }
        else{
            Favourites.create({user: req.user,dishes: req.body })
            .then((favs)=>{
                console.log(favs);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favs);
            }, (err)=>next(err));
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOneAndDelete({"user": req.user._id})
    .then((fav)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(fav);
    }, (err)=>next(err))
    .catch((err)=>next(err));
});

favouriteRouter.route('/:dishId')
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOne({"user": req.user._id})
    .populate('favourites.user')
    .populate('favourites.dishes')
    .then((fav)=>{
        if(fav!=null){
            if(!fav.dishes.includes(req.params.dishId)){
                fav.dishes.push(req.params.dishId);
            }
            fav.save()
            .then((fav)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err)=>next(err));
        }
        else{
            Favourites.create({user: req.user,dishes: [req.params.dishId] })
            .then((favs)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favs);
            }, (err)=>next(err));
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourites.findOne({"user": req.user._id})
    .populate('favourites.user')
    .populate('favourites.dishes')
    .then((fav)=>{
        if(fav!=null){
            if(fav.dishes.includes(req.params.dishId))
            fav.dishes.remove(req.params.dishId);
            fav.save()
            .then((fav)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err)=>next(err));
        }
        else{
            var err = new Error('Dish NOT in favourites');
            err.status = 403;
            next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = favouriteRouter;