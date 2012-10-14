var documentProvider = require('./document').DocumentProvider
var mongo = require('mongodb');
var BSON = mongo.BSONPure;

ScheduleProvider = function(){
  this.setType('schedules')
}

ScheduleProvider.prototype = new DocumentProvider()


ScheduleProvider.prototype.create = function(schedule, callback) {
  if(schedule.user === undefined){
    console.log("User not found")
    callback({errorMessage:"A Schedule needs to be associated with a user"})
  }
  else{
    this.getCollection(function(error, schedule_collection) {
      if( error ) callback(error)
      if(schedule.user === undefined){
        console.log("User not found")
        callback({errorMessage:"A Schedule needs to be associated with a user"})
      }
      else{
        console.log("Creating Schedule")
        if( schedule.days=== undefined || typeof(schedule.day.length)=="undefined")
          schedule.days = [
            {
              name:"Day 1",
              times:[
                {
                  _id:new BSON.ObjectID(),
                  startTime:"8:30am",
                  endTime:"12:00pm"
                },
                {
                  _id:new BSON.ObjectID(),
                  startTime:"1:30pm",
                  endTime:"5:00pm"
                }
              ]
            },
            {
              name:"Day 2",
              times:[
                {
                  _id:new BSON.ObjectID(),
                  startTime:"8:00pm",
                  endTime:"9:00am"
                },
                {
                  _id:new BSON.ObjectID(),
                  startTime:"9:15am",
                  endTime:"10:15am"
                },
                {
                  _id:new BSON.ObjectID(),
                  startTime:"10:30am",
                  endTime:"11:30am"
                },
                {
                  _id:new BSON.ObjectID(),
                  startTime:"1:15pm",
                  endTime:"2:15pm"
                },
                {
                  _id:new BSON.ObjectID(),
                  startTime:"2:30pm",
                  endTime:"3:30pm"
                },
                {
                  _id:new BSON.ObjectID(),
                  startTime:"3:45pm",
                  endTime:"4:45pm"
                },
              ] 
            }
          ]
        else{
          for( var i =0;i< schedule.times.length;i++ ) {
            time = schedule.times[i]
            time.created_at = new Date()
          }
        }
        schedule_collection.insert(schedule, function() {
          callback(null, schedule);
        })
      }
    })
  }
}


