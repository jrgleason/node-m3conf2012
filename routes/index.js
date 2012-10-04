
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
var jsdom = require("jsdom");
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
        console.log(JSON.stringify(res.body))
        var parser = new htmlparser.Parser(checkSiteHtmlParserHandler);
        //parser.parseComplete(res.body); 
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
                time = {"startTime":value};
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
      }
      else{
        for (var ci in tuple.children){
          var text;
          var children = tuple.children[ci]
          for (var gci in children)
          {
            console.log(JSON.stringify(children.children[gci]))  
          }
        }
      }
    }
  }
  //var scheduleHeaders = htmlparser.DomUtils.getElements({class:"rowHeader"},schedule);
  //var headerTimes = []
//  for (var i in scheduleHeaders){
 //   var val = scheduleHeaders[i];
   // var isStartDate = true;
 //   var time;
  //  for (var childi in val.children){
 //     var child = val.children[childi];
 //     var brMatches = child.raw.match(/[Bb][Rr]/g)
 //     if( brMatches == undefined){
 //       //console.log(JSON.stringify(child.raw).replace(/\\n[ ]+/g, ''))
 //       var value = JSON.stringify(child.raw).replace(/\\n[ ]+/g, '').replace(/\"/g,''); 
 //       if(isStartDate){
 //         time = {"startTime":value};
 //         isStartDate = false;
 //       }
 //       else{
 //         time.endTime = value;
 //         headerTimes.push(time);
 //         isStartDate = true;
 //       }
 //     }
 //   }
 // }
  callback(timeframe);
};
