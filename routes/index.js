
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', 
    { 
      title: 'Express', 
      days: req.days,
      schedule: req.session.schedule, 
      userinfo: req.session.user 
    });
};

exports.addClass = function(req, res){
  res.render('newclass', { title: 'Express' });
};



exports.addClassToTime = function(req,res,next){
  var schedule = req.session.schedule
  var id = req.query["id"]
  var className = req.query["classname"]
  schedule.days.forEach(function(day){
    day.times.forEach(function(time){
      if(time._id.toString() == id){
        console.log("Found!")
        console.log("Adding className:"+className)
        time.className = className
        console.log("After: time:"+JSON.stringify(time)+" Schedule: "+JSON.stringify(schedule));
      }
    })
  }) 
  return next()
}




//Parsing stuff
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
  var post_req = http.request(post_options, 
    function(res) {
      res.setEncoding('utf8');
      res.body = '';
      res.on('data', function (chunk) {
        res.body += chunk;
      })
      res.on('end', function() {
        var parser = new htmlparser.Parser(checkSiteHtmlParserHandler);
        parser.parseComplete(res.body); 
        if(checkSiteHtmlParserHandler.error == undefined)
          console.log("There was an error "+JSON.stringify(checkSiteHtmlParserHandler.error))
        else{
          extractScheduleHeaders(checkSiteHtmlParserHandler.dom, function(days){
            console.log(JSON.stringify(days))
            req.days = days
          });
        }
        return next();
      });
    });
  post_req.write("")
  post_req.end()
  req.on('error', function(e) {
    console.error(e);
    res.send(e);
    return next();
  });
};



var checkSiteHtmlParserHandler = new htmlparser.DefaultHandler(function(error, dom)
{
  var result;
  if(error)
    console.log("There was an error")
  else{
    extractScheduleHeaders(dom, function(headerTimes){
      result = headerTimes
    });
  } 
});

var extractScheduleHeaders = function(dom,  callback){
  var days = []
  var currDay = 1
  var schedules = htmlparser.DomUtils.getElements({class:"schedule"}, dom);
  for (var scheduleId in schedules){
    var schedule = schedules[scheduleId]
    var day = {name:"Day "+currDay}
    currDay = currDay+1
    var scheduleRows = htmlparser.DomUtils.getElements({tag_name:"tr"}, schedule)
    day.times = []
    for (var sri in scheduleRows){
      var isStartDate = true;
      var row = scheduleRows[sri]
      var tuples = htmlparser.DomUtils.getElements({tag_name:"td"}, row)
      var time={classes:[]};
      var previousTime
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
                  isStartDate = true;
                }
              } 
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
          }
        }
      }
      if(previousTime === undefined){
      
      }
      else{
        if( previousTime.startTime == time.startTime ){
          time = undefined
        }
      }
      if (time === undefined || time.classes === undefined || time.classes.length <1){
        //uh I dunno
      }
      else{
        day.times.push(time);
      } 
      previousTime = time
      console.log("Times: "+JSON.stringify(day.times))
    }
    days.push(day)
  }
  callback(days);
};


exports.goHome = function(req, res){
  res.redirect('/');
}

