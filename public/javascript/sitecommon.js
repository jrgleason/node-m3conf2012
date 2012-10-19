
$(document).ready(function() {
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
      $("#selectTime").val(value)
      $("#"+value).toggleClass("invisibleClass");
    }
  );
  $('.classselect').change(
    function(){
      var value = $(this).val();
      $("#selectClass").val(value);
      $('#submitMobile').toggleClass('invisible');
    }
  );
  $('#submitMobile').click(
    function(){
      $('#mobileform').submit();
    }
  );
});
