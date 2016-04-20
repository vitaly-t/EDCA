/**
 * Created by mtorres on 19/04/16.
 */


/* Date picker */
$(function () {
    $('#date1, #date2, #date3, #date4, #date5, #date6, #date7').datetimepicker();

});


var nuevoProceso = $('#nuevo');

nuevoProceso.click(function(){
    if ( confirm("¿Está seguro de crear un nuevo proceso de contratación?") == true ){
      
    }
});

