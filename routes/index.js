var express = require('express');
var supergent=require('superagent');
var cheerio=require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  supergent.get('https://cnodejs.org/')
      .end(function (err, sres) {
        if(err){
          return next(err);
        }
        var $=cheerio.load(sres.text);
        var items=[];
        $('#topic_list').find('.topic_title').each(function (idx, element) {
          var $element = $(element);
          items.push({
            title: $element.attr('title'),
            href: $element.attr('href')
          });
        });
        res.send(items);
      })
});

module.exports = router;
