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

    $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false,
        locale: 'es'
    }).on("dp.change", function (e) {
        $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
    });

    $('#datetimepicker2').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: true,
        locale: 'es'
    }).on("dp.change", function (e) {
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });

});


// Tooltips
$(document).ready(function(){
    $('[data-tooltip="crear_proceso"]').tooltip();

    $('#newprocessform').submit(function (e) {

        if ( confirm('¿Está seguro de crear un nuevo proceso de contratación?')) {

            $.post('/new-process').done(function (data) {
                alert("Se ha creado un nuevo proceso de contratación");
                window.location.href = data.url;
            });
        }

        e.preventDefault();
    });
});

//update ocid
$("#updateocid_form").submit(function (event) {
    $.post('/update-ocid',$(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

//publish
$('#release').on('click',function (event) {
    window.open('/publish/release/'+ $(this).data('id')+"/document.json" );
});

$('#release_package').on('click',function (event) {
    window.open('/publish/release-record/'+$(this).data('id')+"/document.json");
});

// buscar proceso por fecha
$("#searchprocessbydate_form").submit(function ( event ) {
    $('#searchprocess_result').load('/search-process-by-date/', $(this).serializeArray());
    event.preventDefault();
});

//buscar por ocid
$("#searchprocessbyocid_form").submit(function ( event ) {
    $('#searchprocess_result').load('/search-process-by-ocid/', $(this).serializeArray());
    event.preventDefault();
});

// UPDATE planning
$( "#planning_form" ).submit(function( event ) {
    $.post('/update-planning/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

//Update tender
$("#tender_form").submit(function(event){
    $.post('/update-tender/', $(this).serialize()).done(function(data){
        alert(data);
    });
    event.preventDefault();
});

//update award
$("#award_form").submit(function(event){
    $.post('/update-award/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

//update contract
$("#contract_form").submit(function(event){
    $.post('/update-contract/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

$('#myModalEditSingleOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    $('#updatesingleorg_fields').load('/org-fields/',{ localid: button.data('localid') ,table : button.data('table') }, function () {
        //Update buyer - procuring entity event
        $( "#updatesingleorg_form" ).submit(function( event ) {
            $.post('/update-organization/', $(this).serialize()).done(function (data) {
                alert(data);
            });
            event.preventDefault();
        });
    });
});

/*----- Manuales -----*/
$("#manualEntry").hide();

$("#textoPlaneacion").hide();
$("#textoLicitacion").hide();
$("#textoAdjudicacion").hide();
$("#textoContratacion").hide();
$("#textoImplementacion").hide();

$("#creacionManual").click(function(){
  $("#manualEntry").show(500);
  $("#textoPlaneacion").hide();
  $("#textoLicitacion").hide();
  $("#textoAdjudicacion").hide();
  $("#textoContratacion").hide();
  $("#textoImplementacion").hide();
});

$("#publicacionManual").click(function(){
  $("#manualEntry").hide(500);
  $("#textoPlaneacion").hide();
  $("#textoLicitacion").hide();
  $("#textoAdjudicacion").hide();
  $("#textoContratacion").hide();
  $("#textoImplementacion").hide();
});

$("#manualPlan").click(function(){
  $("#manualEntry").hide(500);
  $("#textoLicitacion").hide();
  $("#textoAdjudicacion").hide();
  $("#textoContratacion").hide();
  $("#textoImplementacion").hide();
  $("#textoPlaneacion").show(500);
});

$("#manualLic").click(function(){
  $("#manualEntry").hide(500);
  $("#textoLicitacion").show(500);
  $("#textoAdjudicacion").hide();
  $("#textoContratacion").hide();
  $("#textoImplementacion").hide();
  $("#textoPlaneacion").hide();
});

$("#manualAdj").click(function(){
  $("#manualEntry").hide(500);
  $("#textoLicitacion").hide();
  $("#textoAdjudicacion").show(500);
  $("#textoContratacion").hide();
  $("#textoImplementacion").hide();
  $("#textoPlaneacion").hide();
});

$("#manualCont").click(function(){
  $("#manualEntry").hide(500);
  $("#textoLicitacion").hide();
  $("#textoAdjudicacion").hide();
  $("#textoContratacion").show(500);
  $("#textoImplementacion").hide();
  $("#textoPlaneacion").hide();
});

$("#manualImp").click(function(){
  $("#manualEntry").hide(500);
  $("#textoLicitacion").hide();
  $("#textoAdjudicacion").hide();
  $("#textoContratacion").hide();
  $("#textoImplementacion").show(500);
  $("#textoPlaneacion").hide();
});
/*----- Manuales -----*/

$('#myModalEditPub').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    $('#updatepub_fields').load('/publisher/',{ localid: button.data('localid') }, function () {
        // Edit publisher submit event
        $('#updatepub_form').submit(function (event) {
            $.post('/update-publisher/', $(this).serialize()).done(function (data) {
                alert(data);
            });
            event.preventDefault();
        });
    });
});

$('#myModalNewOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    $('#neworg_fields').load('/neworg-fields/',{ localid: button.data('localid') ,table : button.data('table') }, function () {
        //submit new organization event (tenderers, providers)
        $('#neworg_form').submit(function (event) {
            $.post('/new-organization/', $(this).serialize()).done(function (data) {
                alert(data);
            });
            event.preventDefault();
        });
    });
});

$('#myModalNewDoc').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#newdoc_fields').load('/newdoc-fields', { localid: button.data('localid'), table: button.data('table') }, function () {
        //Date picker
        $('#newdoc_date1, #newdoc_date2').datetimepicker({
            locale: 'es',
            format: 'YYYY-MM-DD HH:mm:ss'
        });
        //submit new document event
        $('#newdoc_form').submit(function (event) {
            $.post('/new-document/', $(this).serialize()).done(function (data) {
                alert(data);
            });
            event.preventDefault();
        });
    });
});

$('#myModalNewItem').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#newitem_fields').load('/newitem-fields', {localid : button.data('localid'), table: button.data('table')}, function () {
        //submit new item event
        $('#newitem_form').submit(function (event) {
            $.post('/new-item/', $(this).serialize()).done(function (data) {
                alert(data);
            });
            event.preventDefault();
        });
    });
});

$('#myModalNewTransaction').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#newtransaction_fields').load('/newtransaction-fields', {localid : button.data('localid')}, function () {
        //datepicker
        $('#newtrans_date1').datetimepicker({
            locale: 'es',
            format: 'YYYY-MM-DD HH:mm:ss'
        });
        //submit new transaction event
        $('#newtransaction_form').submit(function (event) {
            $.post('/new-transaction', $(this).serialize()).done(function(data){
                alert(data);
            });
            event.preventDefault();
        });
    });
});

$('#myModalNewMilestone').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#newmilestone_fields').load('/newmilestone-fields',{localid: button.data('localid'), table : button.data('table')}, function () {
        // Submit new milestone event
        $('#newmilestone_form').submit(function (event) {
            $.post('/new-milestone/', $(this).serialize()).done(function (data) {
                alert(data);
            });
            event.preventDefault();
        });
        //datepickers
        $('#newmilestone_date1, #newmilestone_date2').datetimepicker({
            locale: 'es',
            format: 'YYYY-MM-DD HH:mm:ss'
        });
    });
});

$('#myModalNewAmendmentChange').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#newamendmentchange_fields').load('/newamendmentchange-fields', {localid : button.data('localid'), table: button.data('table') }, function () {
        //submit new amendment change event
        $('#newamendmentchange_form').submit(function (event) {
            $.post('/new-amendment-change',$(this).serialize()).done(function (data) {
                alert(data);
            });
            event.preventDefault();
        });
    });
});

$('#myModalEditOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/organization-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
    //button events
    var div = modal.find('.modal-body div');
    div.off('click','.btn');
    div.on('click', '.btn', function (event) {
        var b = $(this);
        $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
            alert(data.msg);
            if ( data.status == 0 ){
                b.parent().parent().remove();
            }
        });
    });
});

$('#myModalEditTransactions').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/transaction-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
    //button events
    var div = modal.find('.modal-body div');
    div.off('click','.btn');
    div.on('click', '.btn', function (event) {
        var b = $(this);
        $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
            alert(data.msg);
            if ( data.status == 0 ){
                b.parent().parent().remove();
            }
        });
    });
});

$('#myModalEditItem').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#item_table').val( button.data('table'));
    modal.find('.modal-body div').load( '/item-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
    //button events
    var div = modal.find('.modal-body div');
    div.off('click','.btn');
    div.on('click', '.btn', function (event) {
        var b = $(this);
        $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
            alert(data.msg);
            if ( data.status == 0 ){
                b.parent().parent().remove();
            }
        });
    });
});

$('#myModalEditDocuments').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/document-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
    //button events
    var div = modal.find('.modal-body div');
    div.off('click','.btn');
    div.on('click', '.btn', function (event) {
        var b = $(this);
        $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
            alert(data.msg);
            if ( data.status == 0 ){
                b.parent().parent().remove();
            }
        });
    });
});

$('#myModalEditChanges').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/amendmentchange-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
    //button events
    var div = modal.find('.modal-body div');
    div.off('click','.btn');
    div.on('click', '.btn', function (event) {
        var b = $(this);
        $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
            alert(data.msg);
            if ( data.status == 0 ){
                b.parent().parent().remove();
            }
        });
    });
});

$('#myModalEditMilestones').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/milestone-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
    //button events
    var div = modal.find('.modal-body div');
    div.off('click','.btn');
    div.on('click', '.btn', function (event) {
        var b = $(this);
        $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
            alert(data.msg);
            if ( data.status == 0 ){
                b.parent().parent().remove();
            }
        });
    });
});

$('#myModalImportData').on('show.bs.modal', function (event) {
    var button    = $(event.relatedTarget);
    var modal     = $(this);
    modal.find('#uploadfile_fields').load ('/uploadfile-fields', { localid : button.data('localid'), stage: button.data('stage') });
});

$('#blockchain').click( function () {
    $.post( "/publish/blockchain", { contractingprocess_id : $(this).data("id")}, function (data) {

        alert("Se ha publicado el proceso: "+ data.ocid );
    });
});