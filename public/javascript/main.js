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
    }
});

// Crear organización
$('#neworg_form').submit(function (event) {
    $.post('/new-organization/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

// Edit publisher 
$('#updatepub_form').submit(function (event) {
    $.post('/update-publisher/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});
/*
$(function () {
    $.get("/organization_type",function(data){
        $.each(data, function (key, value) {
          $('#OrganizationType').append($('<option></option>').attr("value", value.id).text(value.name));
        });
    });
});
*/

$(function () {
    $('#release').click(function () {
        window.open('/publish/release/'+$('#ocid').val());
    });
    $('#release_package').click(function () {
        window.open('/publish/release-package/'+$('#ocid').val());
    });
})

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
$( "#planning_form" ).submit(function( event ) {
    if ($('#ocid').val() != "") {
        $.post('/update-planning/', $(this).serialize()).done(function (data) {
            alert(data);
        });
    }else{
        alert("Debes crear un nuevo proceso de contratación");
    }
    event.preventDefault();
});

$( "#updatebuyer_form" ).submit(function( event ) {
    $.post('/update-buyer/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

$( "#updateprocuringentity_form" ).submit(function( event ) {
    $.post('/update-procuringentity/', $(this).serialize()).done(function (data) {
        alert(data);
    });
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

$('#myModalNewOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipient = button.data('org'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    //modal.find('.modal-title').text('New message to ' + recipient)
    //modal.find('.modal-body input').val("");
    $('#org_type').val(recipient);
    //modal.find('#org_type').val(recipient);

});

$('#myModalEditOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipient = button.data('org'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    //modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('#org_type').val(recipient);
    //modal.find('.modal-body input').val(recipient)
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