var express = require('express');
var utility=require('utility');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  q=req.query.q;
  if(q==null){
    res.send('empty param');
    return;
  }
  md5Value=utility.md5(q);
  res.send(md5Value);
});

module.exports = router;
