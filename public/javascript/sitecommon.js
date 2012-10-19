
$(document).ready(function() {
  $( "#mobileMenu" ).click(
    function(){
      $("#mobileHeaderContent").toggleClass("invisible");
    }
  );
  $('.timeSelect').change(
    function(){
      $('.timemobile').addClass("invisibleClass");
      var value = $(".timemobile option:selected").val();
      alert("#"+value);
      $("#"+value).toggleClass("invisibleClass");
    }
  );
});
