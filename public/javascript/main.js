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
      $.get("/new-process/1");
      /*if(("#org-id").val() != ""){
                   $.get("/nuevo_proceso/1");
                 }else{
                   alert("Debe registrar la dependencia que publica");
                 }*/
               }
});

// Crear organización
/*
$('#crear-org').click(function(){
  if (confirm("¿Está seguro de crear una nueva organización") == true ){
                   $.get("/new-org/" + process.pulisher, function(data){
                     $("#org-id").val(data.id);
                   });
               }
});*/

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
        $('#searchprocessbydate_result').empty();
        $.each(data,function (key, value) {
            $('#searchprocessbydate_result').append( "<a class='list-group-item' href='/main/"+value.id+"'value='"+value.id+"'> Proceso "+value.id+"</a>");
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


/* */

$(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'DD/MM/YYYY', //HH:mm:ss'
    });
    $('#datetimepicker2').datetimepicker({
        format: 'DD/MM/YYYY',// HH:mm:ss',
        useCurrent: false
    });
    $("#datetimepicker1").on("dp.change", function (e) {
        $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker2").on("dp.change", function (e) {
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });
});


/*
$(document).ready(function(){
    if($("#ocid").val() != ""){
        $("#jumbotron").hide();
        $("#all-contents").show(1000);
        $("#pills").show(1000);
        //$("#all-ids").show(1050);
    }else {
        $("#all-contents").hide();
        $("#pills").hide();
        //$("#all-ids").hide();
    }
});*/

/*
$(document).ready(function(){
    $("#panel-buyer").click(function(){
        $("#panel-supplier").toggle(100);
        $("#panel-procuring").toggle(100);
        $("#panel-tenderer").toggle(100);
    });
    $("#panel-supplier").click(function(){
        $("#panel-buyer").toggle(100);
        $("#panel-procuring").toggle(100);
        $("#panel-tenderer").toggle(100);
    });
    $("#panel-procuring").click(function(){
        $("#panel-buyer").toggle(100);
        $("#panel-supplier").toggle(100);
        $("#panel-tenderer").toggle(100);
    });
    $("#panel-tenderer").click(function(){
        $("#panel-buyer").toggle(100);
        $("#panel-procuring").toggle(100);
        $("#panel-supplier").toggle(100);
    });
});*/