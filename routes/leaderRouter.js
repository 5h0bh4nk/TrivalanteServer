const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end("A GET req sent to Leaders page .");
})
.post((req,res,next)=>{
    res.end("Will add the leader "+ req.body.name );
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end("PUT operation not permitted ");
})
.delete((req,res,next)=>{
    res.end("DELETING ALL !!!!")
});


leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    res.end("GETTING info of leader "+ req.params.leaderId );
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end("POST OPERSTION NOT PERMITTED");
})
.put((req,res,next)=>{
    res.end("UPDATING VALUES AND ADATA");
})
.delete((req,res,next)=>{
    res.end("DELETING ID : "+req.params.leaderId);
});

module.exports = leaderRouter;