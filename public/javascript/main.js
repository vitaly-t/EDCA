/**
 * Created by mtorres on 19/04/16.
 */

var currentocid = "";


window.onbeforeunload = function() {
        return "Si recarga la página perdera sus últimos cambios";
    }


/* Date picker */
$(function () {
    $('#lici_date1, #lici_date2, #lici_date3, #lici_date4, #lici_date5, #lici_date6, #lici_date7').datetimepicker();
    $('#adju_date1, #adju_date2, #adju_date3, #adju_date4').datetimepicker();
    $('#cont_date1, #cont_date2, #cont_date3, #cont_date4').datetimepicker();

});


$('#nuevo').click(function(){
    if ( confirm("¿Está seguro de crear un nuevo proceso de contratación"+($('#ocid').val()==""?
                "?":"?, perdera los cambios hechos al proceso actual")) == true ){
      $.get("/nuevo_proceso",function(data){
          $("#ocid").val(data.id);
          currentocid = value.id;
      });
    }
});


$(function () {
    $.get("/organization_type",function(data){
        $.each(data, function (key, value) {
          $('#OrganizationType').append($('<option></option>').attr("value", value.id).text(value.name));
        });
    });
});

