
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , google = require('./lib/google/interface')
  , mongo = require('./lib/data/interface')
  , GOOGLE_CLIENT_ID = "845535169674-4d2cuan06ueva581lk9c2r3osk4jeeca.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET = "nFCjakDdu4-f1QbrWwDVyjeA"
  , REDIRECT_URL_DOMAIN = process.env.OPENSHIFT_APP_DNS || 'localhost:3000'
  , REDIRECT_URL_PATH = '/auth/google/getToken'
  , REDIRECT_URL = 'http://'+REDIRECT_URL_DOMAIN+REDIRECT_URL_PATH

var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "localhost";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 3000;
var server  = process.env.OPENSHIFT_NOSQL_DB_HOST || "localhost";
var localDNS = process.env.OPENSHIFT_APP_DNS || "localhost:3000";

google.setClientId(GOOGLE_CLIENT_ID)
google.setClientSecret(GOOGLE_CLIENT_SECRET)



var app = express();

app.configure(function(){
  app.set('port', port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser("TheOhioStateBuckeyes"))
  app.use(express.session(
    {
      secret: "TheOhioStateBuckeyes",
    }));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.get('/',routes.checkSite, mongo.getSchedule ,routes.index);
app.get('/users', user.list);
app.get('/class/add', routes.addClass)
app.get('/auth/google', google.requestCode) 
app.get('/auth/google/getToken' 
        , google.callbackHandler 
        , google.getUserInformation
        , mongo.getUserByDisplayName
        , routes.goHome)
app.get('/logout',google.logout,routes.goHome)
app.get('/schedule/addClass',routes.addClassToTime, mongo.saveSchedule, routes.goHome)
app.get('/schedule/save', mongo.saveSchedule, routes.goHome)

http.createServer(app).listen(app.get('port'), ipaddr, function(){
  console.log("Express server listening on port " + app.get('port'));
});
