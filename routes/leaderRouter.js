const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();
const authenticate = require('../authenticate');

leaderRouter.use(bodyParser.json());

const Leader = require('../models/leaders')

leaderRouter.route('/')
.get((req,res,next)=>{
    Leader.find({})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    Leader.create(req.body)
    .then((leader)=> {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
        console.log('leader added :' + leader.name);
    },(err)=> next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT operation not permitted on /leaders");
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Leader.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=> next(err))
    .catch((err)=>next(err));
});


leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then((lead) =>{
        if(lead!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(lead);
        }
        else{
            err = new Error('Leader ' + req.params.leaderId+ 'not found' );
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end("POST OPERSTION NOT PERMITTED on /leaders/" + req.params.leaderId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Leader.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    },{
        //for timestamp
        new: true
    })
    .then((lead)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(lead);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Leader.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = leaderRouter;