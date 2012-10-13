var documentProvider = require('./document').DocumentProvider

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
                  startTime:"8:30am",
                  endTime:"12:00pm"
                },
                {
                  startTime:"12:00pm",
                  endTime:"1:30pm"
                },
                {
                  startTime:"1:30pm",
                  endTime:"5:00pm"
                }
              ]
            },
            {
              name:"Day 2",
              times:[
                {
                  startTime:"7:00am",
                  endTime:"8:00am"
                },
                {
                  startTime:"8:00pm",
                  endTime:"9:00am"
                },
                {
                  startTime:"9:00am",
                  endTime:"9:15am"
                },
                {
                  startTime:"9:15am",
                  endTime:"10:15am"
                },
                {
                  startTime:"10:15am",
                  endTime:"10:30am"
                },
                {
                  startTime:"10:30am",
                  endTime:"11:30am"
                },
                {
                  startTime:"11:30am",
                  endTime:"1:00pm"
                },
                {
                  startTime:"1:00pm",
                  endTime:"1:15pm"
                },
                {
                  startTime:"1:15pm",
                  endTime:"2:15pm"
                },
                {
                  startTime:"2:15pm",
                  endTime:"2:30pm"
                },
                {
                  startTime:"2:30pm",
                  endTime:"3:30pm"
                },
                {
                  startTime:"3:30pm",
                  endTime:"3:45pm"
                },
                {
                  startTime:"3:45pm",
                  endTime:"4:45pm"
                },
                {
                  startTime:"4:45pm",
                  endTime:"5:51pm"
                }
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


