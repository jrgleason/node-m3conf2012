var username
var password
var appname = "test"
var querystring = require('querystring'),
    https = require('https'),
    authinfo,
    url = require('url')

exports.getToken = function(req,res, next){
  console.log("Getting Token")
  var post_params = querystring.stringify({
    Passwd:req.password,
    Email:req.username,
    service:"structuredcontent",
    source:req.appname
  })
  var post_options = {
    host: 'www.google.com',
    port: '443',
    path: '/accounts/ClientLogin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_params.length
    }
  };
  var post_req = https.request(post_options, function(res) {
    res.setEncoding('utf8');
    res.body = '';
    res.on('data', function (chunk) {
      res.body += chunk;
    });
    res.on('end', function() {
      var response = querystring.parse(res.body);
      if(response.SID){
        var sid = response.SID
        var authLocation = sid.indexOf("Auth=")+5
        var value = sid.substring(authLocation,sid.length-1)
        req.token = value
        console.log("Token recieved")
        return next()
      }
      else{
        return next()
      }
    })
  })
  post_req.write(post_params);
  post_req.end();
}

var googleProvider = require('./oauth').GoogleProvider,
    googleProvider = new GoogleProvider(),
    clientId,
    clientSecret;

exports.setClientId =  googleProvider.setClientId
exports.setClientSecret = googleProvider.setClientSecret
exports.setRedirectUrl = googleProvider.setRedirectUrl

exports.requestCode = function(req, res){
  googleProvider.requestCode(res)
}

exports.callbackHandler = function(req,res,next){
  console.log("Code: "+req.query["code"]);
  if(req.query["code"] != undefined){
    googleProvider.requestToken(req.query["code"], next, req);
  }
  else{
    console.log(req.url)
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    req.err = query.error
    console.log(req.err)
    return next()
  }
}

exports.getUserInformation = function(req, res, next){
    googleProvider.getUserInformation(req.session.access_token, next, req.session)
}

exports.logout = function(req, res, next){
  var authToken = req.session.access_token
  googleProvider.revokeToken(authToken, res, function(){
    req.session.access_token = null;
    req.session.user = null;
    return next()
  })
}


