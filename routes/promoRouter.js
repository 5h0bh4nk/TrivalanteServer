const express = require('express');
const cors = require('./cors');
const bodyParser = require('body-parser');
const promoRouter = express.Router();
const Promos = require('../models/promotions');
const authenticate = require('../authenticate');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req,res,next) =>{
    Promos.find(req.query)
    .then((promo)=>{
        if(promo!=null){
            res.statusCode=200;
            res.setHeader('Content-type','application/json');
            res.json(promo);
        }
        else{
            err = new Error('Promotions not found');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    Promos.create(req.body)
    .then((promos)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(promos);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promos');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promos.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=>next(err));
});

promoRouter.route("/:promoId")
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req,res,next) => {
    Promos.findById(req.params.promoId)
    .then((promo)=>{
        if(promo!=null){
            res.statusCode=200;
            res.setHeader('Content-type','application/json');
            res.json(promo);
        }
        else{
            var err = new Error('NOT FOUND');
            err.status=404;
            return next(err);
        }
    }, (err)=> next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promo/'+ req.params.promoId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promos.findByIdAndUpdate(req.params.promoId,{
        $set: req.body
    }, {new: true})
    .then((promos)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(promos);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promos.findByIdAndDelete(req.params.promoId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=>next(err));
});

module.exports = promoRouter;