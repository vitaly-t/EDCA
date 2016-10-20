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

//OCDS JSON, publish
$('#release').click(function () {
    window.open('/publish/release/'+ $(this).data('id')+"/document.json" );
});

$('#release_package').click(function () {
    window.open('/publish/release-record/'+$(this).data('id')+"/document.json");
});

$('#blockchain').click(function () {
    $.post( "/publish/rpc", { contractingprocess_id : $(this).data("id")}, function (data) {
        alert(data.message);
    });
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
/*----- Fin Manuales -----*/


$('#myModalEditSingleOrg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);
    $('#updatesingleorg_fields').load('/org-fields/',{ localid: button.data('localid') ,table : button.data('table') }, function () {
        //Update buyer - procuring entity event
        $( "#updatesingleorg_form" ).submit(function( event ) {
            $.post('/update-organization/', $(this).serialize()).done(function (data) {
                alert(data.description);
                if (data.status == 'Ok'){modal.modal('hide');}
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

$('#genericModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var modal = $(this);

    switch ( button.data('action') ){
        //import data from csv files
        case "import_data":
            modal.find('.modal-title').text('Importar datos');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load ('/uploadfile-fields', { localid : button.data('contractingprocess_id'), stage: button.data('stage') });
            break;
        //add new elements
        case "new_item":
            modal.find('.modal-title').text('Nuevo artículo');
            modal.find('#modal_content').load('/newitem-fields', {localid : button.data('contractingprocess_id'), table: button.data('table')}, function () {
                //submit new item event
                $('#newitem_form').submit(function (event) {
                    $.post('/new-item/', $(this).serialize()).done(function (data) {
                        alert(data.description);
                        if (data.status == 'Ok'){modal.modal('hide');}
                    });
                    event.preventDefault();
                });
            });
            break;
        case "new_milestone":
            modal.find('.modal-title').text('Nuevo hito');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load('/newmilestone-fields',{localid: button.data('contractingprocess_id'), table : button.data('table')}, function () {
                // Submit new milestone event
                $('#newmilestone_form').submit(function (event) {
                    $.post('/new-milestone/', $(this).serialize()).done(function (data) {
                        alert(data.description);
                        if (data.status == 'Ok'){ modal.modal('hide');}
                    });
                    event.preventDefault();
                });
                //datepickers
                $('#newmilestone_date1, #newmilestone_date2').datetimepicker({
                    locale: 'es',
                    format: 'YYYY-MM-DD HH:mm:ss'
                });
            });
            break;
        case "new_document":
            modal.find('.modal-title').text('Nuevo documento');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load('/newdoc-fields', { localid: button.data('contractingprocess_id'), table: button.data('table') }, function () {
                //Date picker
                $('#newdoc_date1, #newdoc_date2').datetimepicker({
                    locale: 'es',
                    format: 'YYYY-MM-DD HH:mm:ss'
                });
                //submit new document event
                $('#newdoc_form').submit(function (event) {
                    $.post('/new-document/', $(this).serialize()).done(function (data) {
                        alert(data.description);
                        if (data.status == 'Ok'){ modal.modal('hide');}
                    });
                    event.preventDefault();
                });
            });
            break;
        case "new_change":
            modal.find('.modal-title').text('Nuevo cambio de enmienda');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load('/newamendmentchange-fields', {localid : button.data('contractingprocess_id'), table: button.data('table') }, function () {
                //submit new amendment change event
                $('#newamendmentchange_form').submit(function (event) {
                    $.post('/new-amendment-change',$(this).serialize()).done(function (data) {
                        alert(data.description);
                        if ( data.status == 'Ok' ){modal.modal('hide');}
                    });
                    event.preventDefault();
                });
            });
            break;
        case "new_transaction":
            modal.find('.modal-title').text('Nueva transacción');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load('/newtransaction-fields', {localid : button.data('contractingprocess_id')}, function () {
                //datepicker
                $('#newtrans_date1').datetimepicker({
                    locale: 'es',
                    format: 'YYYY-MM-DD HH:mm:ss'
                });
                //submit new transaction event
                $('#newtransaction_form').submit(function (event) {
                    $.post('/new-transaction', $(this).serialize()).done(function(data){
                        alert(data.description);
                        if (data.status == 'Ok'){ modal.modal('hide');}
                    });
                    event.preventDefault();
                });
            });
            break;
        case "new_organization":
            modal.find('.modal-title').text('Nueva organización');
            modal.find('#modal_content').html("");
            $('#modal_content').load('/neworg-fields/',{ localid: button.data('contractingprocess_id') ,table : button.data('table') }, function () {
                //submit new organization event (tenderers, suppliers)
                $('#neworg_form').submit(function (event) {
                    $.post('/new-organization/', $(this).serialize()).done(function (data) {
                        alert(data.description);
                        if (data.status == 'Ok'){ modal.modal('hide');}
                    });
                    event.preventDefault();
                });
            });
            break;
        //edit elements
        case "edit_changes":
            modal.find('.modal-title').text('Editar cambios de enmienda');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load( '/amendmentchange-list/' ,{ ocid: button.data('contractingprocess_id'), table : button.data('table') }, function () {
                //button events
                var div = modal.find('#modal_content');
                div.find('.btn').click(function () {
                    var b = $(this);
                    $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
                        alert(data.msg);
                        if ( data.status == 0 ){
                            b.parent().parent().remove();
                        }
                    });
                });
            });
            break;
        case "edit_items":
            modal.find('.modal-title').text('Editar artículos');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load( '/item-list/' ,{ ocid: button.data('ocid'), table : button.data('table') });
            //button events
            var div = modal.find('#modal_content');
            div.find('.btn').click(function () {
                var b = $(this);
                $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
                    alert(data.msg);
                    if ( data.status == 0 ){
                        b.parent().parent().remove();
                    }
                });
            });
            break;
        case "edit_transactions":
            modal.find('.modal-title').text('Editar transacciones');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load( '/transaction-list/' ,{ ocid: button.data('contractingprocess_id'), table : button.data('table') }, function () {
                //button events
                var div = modal.find('#modal_content');
                div.find('.btn').click(function () {
                    var b = $(this);
                    $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
                        alert(data.msg);
                        if ( data.status == 0 ){
                            b.parent().parent().remove();
                        }
                    });
                });
            });
            break;
        case "edit_documents":
            modal.find('.modal-title').text('Editar documentos');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load( '/document-list/' ,{ ocid: button.data('contractingprocess_id'), table : button.data('table') }, function(){
                //button events
                var div = modal.find('#modal_content');
                div.find('.btn').click(function () {
                    var b = $(this);
                    $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
                        alert(data.msg);
                        if ( data.status == 0 ){
                            b.parent().parent().remove();
                        }
                    });
                });
            });
            break;
        case "edit_milestones":
            modal.find('.modal-title').text('Editar hitos');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load( '/milestone-list/' ,{ ocid: button.data('contractingprocess_id'), table : button.data('table') },function () {
                //button events
                var div = modal.find('#modal_content');
                div.find('.btn').click(function () {
                    var b = $(this);
                    $.post('/delete', { id : b.data('id'), table: b.data('table') }).done(function(data){
                        alert(data.msg);
                        if ( data.status == 0 ){
                            b.parent().parent().remove();
                        }
                    });
                });
            });
            break;
        case "edit_publisher":
            modal.find('.modal-title').text('Editar');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load('/publisher/',{ localid: button.data('contractingprocess_id') }, function () {
                // Edit publisher submit event
                $('#updatepub_form').submit(function (event) {
                    $.post('/update-publisher/', $(this).serialize()).done(function (data) {
                        alert( data.description );
                        if ( data.status == 'Ok'){ modal.modal('hide');}
                    });
                    event.preventDefault();
                });
            });
            break;
        case "edit_organizations":
            modal.find('.modal-title').text('Editar organizaciones');
            modal.find('#modal_content').html("");
            break;
        case "edit_organization":
            break;
        case "edit_uris":
            modal.find('.modal-title').text('Editar URIs de publicación');
            modal.find('#modal_content').html("");
            modal.find('#modal_content').load('/uris/',{ id: button.data('contractingprocess_id') }, function () {
                // Edit publisher submit event
                $('#uri_form').submit(function (event) {
                    $.post('/update-uris/', $(this).serialize()).done(function (data) {
                        alert(data.description);
                        if (data.status == 'Ok'){ modal.modal('hide');}
                    });
                    event.preventDefault();
                });
            });
            break;
        case "edit_user":
            modal.find('.modal-title').text('Actualizar información del usuario');
            modal.find('#modal_content').html("");
            break;
    }
});