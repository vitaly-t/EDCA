/**
 * Created by mtorres on 19/04/16.
 */

/*window.onbeforeunload = function() {
        return "Si recarga la página perdera sus últimos cambios";
};*/

/* Date picker */
$(function () {
    $('#lici_date1, #lici_date2, #lici_date3, #lici_date4, #lici_date5, #lici_date6, #lici_date7').datetimepicker({
        //locale: ''
        format: 'DD/MM/YYYY HH:mm:ss'
    });
    $('#adju_date1, #adju_date2, #adju_date3, #adju_date4').datetimepicker({
        //locale: ''
        format: 'DD/MM/YYYY HH:mm:ss'
    });
    $('#cont_date1, #cont_date2, #cont_date3, #cont_date4').datetimepicker({
        //locale: ''
        format: 'DD/MM/YYYY HH:mm:ss'
    });

});

// Crear proceso de contratación.
$('#crear').click(function(){
  if (confirm("¿Está seguro de crear un nuevo proceso de contratación"+
              ($('#ocid').val()==""?
               "?":"?, perdera los cambios hechos al proceso actual")) == true ){
                 if(("#org-id").val() != ""){
                   $.get("/nuevo_proceso/" + ("#org-id").val(), function(data){
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
  if (confirm("¿Está seguro de crear una nueva organización") == true ){
                   $.get("/new-org/" + process.pulisher, function(data){
                     $("#org-id").val(data.id);
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

/* buscar proceso por fecha*/
$("#searchprocessbydate_form").submit(function ( event ) {
    $.post('/search-process-by-date/', $(this).serialize()).done(function(data){
        $.each(data,function (key, value) {
            //Resultados
        })
    });
    event.preventDefault();
});

/* UPDATE */
$( "#budget_form" ).submit(function( event ) {
    if ($('#ocid').val() != "") {
        $.post('/update-budget/', $(this).serialize()).done(function (data) {
            alert(data);
        });
    }else{
        alert("Debes crear un nuevo proceso de contratación");
    }
    event.preventDefault();
});

$("#tender_form").submit(function(event){
    if ( $('#ocid').val() !="") {
        $.post('/update-tender/', $(this).serialize()).done(function(data){
            alert(data);
        });
    }else{
        alert("Debes crear un nuevo proceso de contratación");
    }
    event.preventDefault();
});


$("#award_form").submit(function(event){
    if ( $('#ocid').val()!= "") {
        $.post('/update-award/', $(this).serialize()).done(function (data) {
            alert(data);
        });
    }else{
        alert("Debes crear un nuevo proceso de contratación");
    }
    event.preventDefault();
});

$("#contract_form").submit(function(event){
    if ( $('#ocid').val()!="") {
        $.post('/update-contract/', $(this).serialize()).done(function (data) {
            alert(data);
        });
    }else{
        alert("Debes crear un nuevo proceso de contratación");
    }
    event.preventDefault();
});
