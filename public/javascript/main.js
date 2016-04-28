/**
 * Created by mtorres on 19/04/16.
 */

var process = {
  ocid: 1,
  publisher: 0
};


/*window.onbeforeunload = function() {
        return "Si recarga la página perdera sus últimos cambios";
};*/


/* Date picker */
$(function () {
    $('#lici_date1, #lici_date2, #lici_date3, #lici_date4, #lici_date5, #lici_date6, #lici_date7').datetimepicker();
    $('#adju_date1, #adju_date2, #adju_date3, #adju_date4').datetimepicker();
    $('#cont_date1, #cont_date2, #cont_date3, #cont_date4').datetimepicker();

});

// Crear proceso de contratación.
$('#crear').click(function(){
  if (confirm("¿Está seguro de crear un nuevo proceso de contratación"+
              ($('#ocid').val()==""?
               "?":"?, perdera los cambios hechos al proceso actual")) == true ){
                 if(process.publisher != ""){
                   $.get("/nuevo_proceso/" + process.pulisher, function(data){
                     $("#ocid").val(data.id);
                     currentocid = value.id;
                   });
                 }else{
                   alert("Debe registrar la dependencia que publica");
                 }
               }
});

// Crear organización
$('#crear-org').click(function(){
  if (confirm("¿Está seguro de crear una nueva organización" +
              (process.ocid==0?
               "?":"?, perdera los cambios hechos al proceso actual")) == true ){
                 if(process.publisher != 0){
                   $.get("/nuevo_proceso/" + process.pulisher, function(data){
                     $("#ocid").val(data.id);
                     currentocid = value.id;
                   });
                 }else{
                   alert("Debe registrar la dependencia que publica");
                 }
               }
});

$(function () {
    $.get("/organization_type",function(data){
        $.each(data, function (key, value) {
          $('#OrganizationType').append($('<option></option>').attr("value", value.id).text(value.name));
        });
    });
});

$( "#budget_form" ).submit(function( event ) {
    if (process.ocid != 0) {
        $.post('/update_budget/'+process.ocid, $(this).serialize());
        event.preventDefault();
    }else{
        alert("Debes crear un nuevo proceso de contratación");
    }
});