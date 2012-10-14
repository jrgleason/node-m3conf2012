//Generic Document Provider
var documentProvider = require('./document').DocumentProvider,
    documentProvider = new DocumentProvider()

//Schedule Document Provider
var scheduleProvider = require('./schedule').ScheduleProvider,
    scheduleProvider = new ScheduleProvider()

exports.getSchedule = function(req,res,next){
  if(req.session.schedule === undefined){
    if(req.session.user === undefined || req.session.user == null){
      //no user means no schedule fo you!
      return next()
    }
    else{
      scheduleProvider.findByJSON({user:req.session.user.id}, function(err,schedules){
        if(schedules === undefined || schedules.length < 1){
          //Strange things are afoot in the circle K
          scheduleProvider.create({user:req.session.user.id},function(error, schedule){
            req.session.schedule = schedule;
            return next()
          })
        }
        else if(schedules.length > 1){
          //Strange things are afoot in the circle K
          console.log("Too many schedules found for a user");
          return next()
        }
        else{
          //something weird happened
          //TODO: Need to handle exception
          req.session.schedule = schedules[0];
          return next();
        }
      })
    }
  }
  else{
    return next();
  }
}
exports.saveSchedule = function(req,res,next){
  scheduleProvider.save(req.session.schedule, function(){
    return next();
  })
}

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
  if(req.session.user.name != undefined){
    var user = {
      name:req.session.user.name
    }
    documentProvider.setType('users')
    documentProvider.findByJSON(
      user
      , function(err, results){
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


getIdFromString = function(id, callback){ 
  try{ 
    var objectId=new BSON.ObjectID(id); 
    callback(null,objectId)     
  } 
  catch(exception){ 
    callback(exception,null) 
  } 
}

