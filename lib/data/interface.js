//Generic Document Provider
var documentProvider = require('./document').DocumentProvider,
    documentProvider = new DocumentProvider()




//User Document Provider
var userProvider = require('./user').UserProvider,
    userProvider = new UserProvider()

exports.getUser= function (req, res, next){
  documentProvider.findByIdentifier(req.params.id, function (err, doc) {
    if (!err) {
      req.user = doc
      return next();
    } else {
      console.log(err)
      return next();
    }
  })
}

exports.getUserByDisplayName = function(req,res,next){
  console.log("Username:"+req.session.user.name)
  if(req.session.user.name != undefined){
    console.log("Looking for users")
    var user = {
      name:req.session.user.name
    }
    console.log("User: "+JSON.stringify(user));
    documentProvider.setType('users')
    documentProvider.findByJSON(
      user
      , function(err, results){
        console.log("RESULTS:"+JSON.stringify(results))
        if(err != undefined || results == undefined || results.length < 1){
          console.log("No User Found")
          createUser(
            {
              name : req.session.user.name,
              roles : []
            }
            , function(error, entry){
                if (!error) {
                  req.user=entry
                  return next()
                } else {
                  return console.log(error)
                }
           })
        }
        else{
          req.user = results[0]
          console.log("User Found")
          return next()
        }
      })
  }
}


var createUser = function(doc,callback){
  documentProvider.setType('users')
  documentProvider.save(doc, callback)
}

var createUserCallback = function(error, entry){
      if (!error) {
        req.user=entry
        return next()
      } else {
        return console.log(error)
      }
}

exports.postUser = function (req, res, next){
  var doc  = {
    name : req.body.displayName,
    roles : []
  };
  createUser(doc, function(error, entry){
      if (!error) {
        req.user=entry
        return next()
      } else {
        return console.log(error)
      }
  })
}

exports.deleteUser = function(req, res, next){
  documentProvider.setType('userss')
  documentProvider.remove(req.params.id,function(){
    return next()
  })
}

exports.putUser = function(req, res){
  //TODO: We should check the type to ensure JSON
  res.set({
    'Content-Type': 'application/json',
    'type': 'get',
    'dataType': 'json'
  })
  documentProvider.setType('users')
  getIdFromString(req.body.id, function(err, id){
    if(err != undefined){
      //console.log(err)
      res.json(500, { error: err })
    }
    else{
      documentProvider.findByJSON({_id:id}, function(err,users){
        if(err != undefined){
           //console.log(err)
           res.json(500, { error: err })
        }
        else if(users.length <= 0){
          err = "There were no users found"
          //console.log(err)
          res.json(500, { error: err })
        }
        else{
          documentProvider.updateJSON({_id:id},updateObj.updateValues,function(err){
            if(err==undefined){
              res.json({ message: "User Updated" })
            }
            else{
              res.json(500, { error: err })
            }
          })
        }
      })
    }
  })
}
