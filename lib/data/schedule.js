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
        if( schedule.times=== undefined || typeof(schedule.times.length)=="undefined")
          schedule.times = []
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


