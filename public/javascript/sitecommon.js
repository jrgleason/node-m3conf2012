
$(document).ready(function() {
  $( "#mobileMenu" ).click(
    function(){
      $("#mobileHeaderContent").toggleClass("invisible");
    }
  );
  $('#timeSelect').change(
    function(){
      //$('.invisibleClass').toggleClass("invisibleClass");
      var value = $("#timeSelect option:selected").val();
      alert(Value);
      //$(value).toggleClass("invisibleClass");
    }
  );
});
