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

//publish
$('#release').on('click',function (event) {
    window.open('/publish/release/'+ $(this).data('id')+"/document.json" );
});

$('#release_package').on('click',function (event) {
    window.open('/publish/release-record/'+$(this).data('id')+"/document.json");
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
    $('#searchprocessbydate_result').load('/search-process-by-date/', $(this).serializeArray());
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

//update ocid
$("#updateocid_form").submit(function (event) {
    $.post('/update-ocid',$(this).serialize()).done(function (data) {
        alert(data);
    });
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

$('#myModalEditOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#org_table').val( button.data('table'));
    modal.find('.modal-body div').load( '/organization-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
});

$('#myModalEditTransactions').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/transaction-list/' ,{ ocid: button.data('ocid') });
});

$('#myModalEditItem').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#item_table').val( button.data('table'));
    modal.find('.modal-body div').load( '/item-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
});

$('#myModalEditDocuments').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/document-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
});

$('#myModalEditChanges').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/amendmentchange-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
});

$('#myModalEditMilestones').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('.modal-body div').load( '/milestone-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
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
