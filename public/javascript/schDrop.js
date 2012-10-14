$(document).ready(function() {
  $( ".droppable" ).droppable({
    drop: function( event, ui ) {
      var test = ui;
      alert("Quit dropping stuff on me");
    }
  });
});

