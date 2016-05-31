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


//Update buyer - procuring entity
$( "#updatesingleorg_form" ).submit(function( event ) {
    $.post('/update-organization/', $(this).serialize()).done(function (data) {
        alert(data);
    });
    event.preventDefault();
});

$('#myModalEditSingleOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    $('#updatesingleorg_fields').load('/org-fields/',{ localid: button.data('localid') ,table : button.data('table') });
});

//update ocid
$("#updateocid_form").submit(function (event) {
    $.post('/update-ocid',$(this).serialize()).done(function (data) {
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

$('#myModalEditPub').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    $('#updatepub_fields').load('/publisher/',{ localid: button.data('localid') });
});

$('#myModalNewOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    $('#neworg_fields').load('/neworg-fields/',{ localid: button.data('localid') ,table : button.data('table') });
});

$('#myModalNewDoc').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    modal.find('#newdoc_fields').load('/newdoc-fields', { localid: button.data('localid'), table: button.data('table') }, function () {
        //Date pickers
        $('#newdoc_date1, #newdoc_date2').datetimepicker({
            locale: 'es',
            format: 'YYYY-MM-DD HH:mm:ss'
        });
    });
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
