/**
 * Created by mtorres on 19/04/16.
 */


/* Date picker */
$(function () {
    $('#lici_date1, #lici_date2, #lici_date3, #lici_date4, #lici_date5, #lici_date6, #lici_date7').datetimepicker();
    $('#adju_date1, #adju_date2, #adju_date3, #adju_date4').datetimepicker();
    $('#cont_date1, #cont_date2, #cont_date3, #cont_date4').datetimepicker();

});


var nuevoProceso = $('#nuevo');

nuevoProceso.click(function(){
    if ( confirm("¿Está seguro de crear un nuevo proceso de contratación?") == true ){
      $.get("/nuevo_proceso",function(data){
          $("#ocid").val(data.id);
      });
    }
});

/*
$(function () {
    $.get("/organization_type",function(data){
        //$("OrganizationType").
    });
});*/