/**
 * Created by mtorres on 19/04/16.
 */

/*window.onbeforeunload = function() {
        return "Si recarga la página perdera sus últimos cambios";
 };*/


/* Date picker */
$(function () {
    $('#lici_date1, #lici_date2, #lici_date3, #lici_date4, #lici_date5, #lici_date6, #lici_date7').datetimepicker({
        locale: 'es',
        format: 'YYYY-MM-DD HH:mm:ss'//'DD/MM/YYYY HH:mm:ss'
    });
    $('#adju_date1, #adju_date2, #adju_date3, #adju_date4').datetimepicker({
        locale: 'es',
        format: 'YYYY-MM-DD HH:mm:ss'//'DD/MM/YYYY HH:mm:ss'
    });
    $('#cont_date1, #cont_date2, #cont_date3, #cont_date4').datetimepicker({
        locale: 'es',
        format: 'YYYY-MM-DD HH:mm:ss'//'DD/MM/YYYY HH:mm:ss'
    });
    $('#docs_date1, #docs_date2').datetimepicker({
        locale: 'es',
        format: 'YYYY-MM-DD HH:mm:ss'
    });
    $('#newitem_date1, #newitem_date2').datetimepicker({
        locale: 'es',
        format: 'YYYY-MM-DD HH:mm:ss'
    });

    $('#newmilestone_date1, #newmilestone_date2').datetimepicker({
        locale: 'es',
        format: 'YYYY-MM-DD HH:mm:ss'
    });

    $('#newtrans_date1').datetimepicker({
        locale: 'es',
        format: 'YYYY-MM-DD HH:mm:ss'
    })
});

/*
 // Crear proceso de contratación.
$('#crear').click(function(){
    if (confirm("¿Está seguro de crear un nuevo proceso de contratación"+
            ($('#ocid').val()==""?
                "?":"?, perdera los cambios hechos al proceso actual")) == true ){
        $.get("/new-process/1");
    }
});*/

//publish
$(function () {
    $('#release').click(function () {
        window.open('/publish/release/'+$('#ocid').val());
    });
    $('#release_package').click(function () {
        window.open('/publish/release-record/'+$('#ocid').val());
    });
});

// Crear organización
$('#neworg_form').submit(function (event) {
    $.post('/new-organization/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

// Nuevo docto
$('#newdoc_form').submit(function (event) {
    $.post('/new-document/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

// New milestone
$('#newmilestone_form').submit(function (event) {
    $.post('/new-milestone/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

// New item
$('#newitem_form').submit(function (event) {
    $.post('/new-item/', $(this).serialize()).done(function (data) {
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

//new transaction
$('#newtransaction_form').submit(function (event) {
    $.post('/new-transaction', $(this).serialize()).done(function(data){
        alert(data);
    });
    event.preventDefault();
});

$('#newamendmentchange_form').submit(function (event) {
    $.post('/new-amendment-change',$(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

// buscar proceso por fecha
$("#searchprocessbydate_form").submit(function ( event ) {
    $.post('/search-process-by-date/', $(this).serialize()).done(function(data){
        $('#searchprocessbydate_result').empty();
        $.each(data,function (key, value) {
            $('#searchprocessbydate_result').append( "<a class='list-group-item' href='/main/"+value.id+"'value='"+value.id+"'> Proceso "+value.id+"</a>");
        })
    });
    event.preventDefault();
});

// UPDATE planning
$( "#planning_form" ).submit(function( event ) {
    $.post('/update-planning/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

//update buyer
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
    $.post('/update-tender/', $(this).serialize()).done(function(data){
        alert(data);
    });
    event.preventDefault();
});

$("#award_form").submit(function(event){
    $.post('/update-award/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

$("#contract_form").submit(function(event){
    $.post('/update-contract/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

$('#myModalURL').on('show.bs.modal', function (event) {
    var button    = $(event.relatedTarget);
    var recipient = button.data('org');
    var modal     = $(this);
    modal.find('#org_type').val(recipient);
});

$('#myModalNewOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipient = button.data('org'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    //modal.find('.modal-title').text('New message to ' + recipient)
    //modal.find('.modal-body input').val("");
    $('#org_type').val(recipient);
    //modal.find('#org_type').val(recipient);
});

$('#myModalEditOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var recipient = button.data('org');
    var modal = $(this);
    modal.find('#org_type').val(recipient);
});

$('#myModalNewDoc').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#doc_table').val( button.data('doctable') );
});

$('#myModalNewItem').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#item_table').val( button.data('itemtable') );
});

$('#myModalNewMilestone').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#milestone_table').val( button.data('milestonetable') );
});

$('#myModalNewAmendmentChange').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#amendmentchanges_table').val( button.data('changestable') );
});




$('#myModalEditTransactions').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/transaction-list/' ,{ ocid: '2' });//val( button.data('changestable') );
});






/* */

$(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD',
        locale: 'es'
    });
    $('#datetimepicker2').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false,
        locale: 'es'
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
