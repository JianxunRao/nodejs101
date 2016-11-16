var express = require('express');
var supergent=require('superagent');
var cheerio=require('cheerio');
var url=require('url');
var eventproxy=require('eventproxy');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var cnodeUrl='https://cnodejs.org/';
  supergent.get('https://cnodejs.org/')
      .end(function (err, sres) {
        if(err){
          return next(err);
        }
        var topicUrls = [];
        var $=cheerio.load(sres.text);
        $('#topic_list').find('.topic_title').each(function (idx, element) {
          var $element = $(element);
            var href=url.resolve(cnodeUrl,$element.attr('href'));
            topicUrls.push(href);
        });
        var ep=new eventproxy();
          ep.after('topic_html',topicUrls.length,function (topics) {
              topics=topics.map(function (topicPair) {
                  var topicUrl = topicPair[0];
                  var topicHtml = topicPair[1];
                  var $ = cheerio.load(topicHtml);
                  var newTopic={
                      title: $('.topic_full_title').text().trim(),
                      href: topicUrl,
                      comment1: $('.reply_content').eq(0).text().trim()
                  };
                  return newTopic;
              });
              console.log('final;');
              console.log(topics);
          });
          topicUrls.forEach(function (topicUrl) {
            supergent.get(topicUrl)
                .end(function (err, sres) {
                    console.log('fetch ' + topicUrl + ' successful');
                    ep.emit('topic_html', [topicUrl, sres.text]);
                })
          })
      })
});

module.exports = router;
