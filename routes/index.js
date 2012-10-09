
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.addClass = function(req, res){
  res.render('newclass', { title: 'Express' });
};
//var $ = require('jquery'),
var http = require('http'),
    querystring = require('querystring'),
    htmlparser = require("htmlparser");

var curNext;

exports.checkSite = function(req, res, next){
  curNext = next;
  var post_options = {
      host: 'm3conf.com',
      port: '80',
      path: '/home/schedule',
      method: 'GET',
  };
  var post_req = http.request(post_options, checkSiteCallback);
  post_req.write("")
  post_req.end()
  req.on('error', function(e) {
    console.error(e);
    res.send(e);
    return next();
  });
};


var checkSiteCallback = function(res) {
      res.setEncoding('utf8');
      res.body = '';
      res.on('data', function (chunk) {
        res.body += chunk;
      });
      res.on('end', function() {
        //console.log(JSON.stringify(res.body))
        var parser = new htmlparser.Parser(checkSiteHtmlParserHandler);
        parser.parseComplete(res.body); 
        return curNext();
      });
};


var checkSiteHtmlParserHandler = new htmlparser.DefaultHandler(function(error, dom)
{
  if(error)
    console.log("There was an error")
  else{
    //console.log(JSON.stringify(dom)) 
    extractScheduleHeaders(dom, function(headerTimes){
      for (var i in headerTimes){
        console.log(JSON.stringify(headerTimes[i]));
      }
    });
  } 
});

var extractScheduleHeaders = function(dom, callback){
  var schedule = htmlparser.DomUtils.getElements({class:"schedule"}, dom);
  var scheduleRows = htmlparser.DomUtils.getElements({tag_name:"tr"}, schedule)
  var timeframe = []

  for (var sri in scheduleRows){
    var isStartDate = true;
    var time={classes:[]};

    var row = scheduleRows[sri]
    var tuples = htmlparser.DomUtils.getElements({tag_name:"td"}, row)
    for (var ti in tuples){
      var tuple = tuples[ti]
      if(tuple.attribs != undefined){
        var classMatches = tuple.attribs.class.match(/rowHeader/g)
        if( classMatches != null){
          for (var childi in tuple.children){
            var child = tuple.children[childi];
            var brMatches = child.raw.match(/[Bb][Rr]/g)
            if( brMatches == undefined){
              var value = JSON.stringify(child.raw).replace(/\\n[ ]+/g, '').replace(/\"/g,''); 
              if(isStartDate){
                time.startTime = value;
                isStartDate = false;
              }
              else{
                time.endTime = value;
                timeframe.push(time);
                isStartDate = true;
              }
            } 
          }
        }
        //TODO: extract out to method
        else{
          if(tuple.children[0].raw != "Break"){
            time.classes.push({className:tuple.children[0].raw});
            console.log(JSON.stringify(tuple.children[0].raw));
          }
        }
      }

      else{
        if(tuple.children[0].raw != "Break"){
          if(tuple.children[0].name = "a"){
            var ahreftxt = tuple.children[0].children
            for (var childi in ahreftxt){
              time.classes.push({
                className:ahreftxt[childi].data
              })
            }
          }
          else{
            time.classes.push({
              className:tuple.children[0].data
            });
          }
        }
      }
      
    }
  }
  callback(timeframe);
};
