var className,
    dayTime;

$(document).ready(function() {
  //init();
  $( "#mobileMenu" ).click(
    function(){
      $("#mobileHeaderContent").toggleClass("invisible");
    }
  );
  $('.dayselect').change(
    function(){
      $('.timeselect').addClass("invisibleTime");
      var value = $(this).val();
      $("#selectDay").val(value);
      $("#"+value).toggleClass("invisibleTime");
    }
  );
  $('.timeselect').change(
    function(){
      $('.classselect').addClass("invisibleClass");
      var value = $(this).val();
      $("#selectTime").val(value);
      dayTime = value;
      $("#"+value).toggleClass("invisibleClass");
    }
  );
  $('.classselect').change(
    function(){
      var value = $(this).val();
      $("#selectClass").val(value);
      className = value;
      $('#submitMobile').toggleClass('invisible');
    }
  );
  $('#submitMobile').click(
    function(){
      window.location.href="/schedule/addClass?classname="+className+"&dayTime="+dayTime;
    }
  );
});


function touchHandler(event)
{
 var touches = event.changedTouches,
    first = touches[0],
    type = "";

     switch(event.type)
{
    case "touchstart": type = "mousedown"; break;
    case "touchmove":  type="mousemove"; break;        
    case "touchend":   type="mouseup"; break;
    default: return;
}
var simulatedEvent = document.createEvent("MouseEvent");
simulatedEvent.initMouseEvent(type, true, true, window, 1,
                          first.screenX, first.screenY,
                          first.clientX, first.clientY, false,
                          false, false, false, 0/*left*/, null);

first.target.dispatchEvent(simulatedEvent);
event.preventDefault();
}

function init()
{
   document.addEventListener("touchstart", touchHandler, true);
   document.addEventListener("touchmove", touchHandler, true);
   document.addEventListener("touchend", touchHandler, true);
   document.addEventListener("touchcancel", touchHandler, true);    
}
