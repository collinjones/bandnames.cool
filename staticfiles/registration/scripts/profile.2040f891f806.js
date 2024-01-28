var table;
var unblockUI_timeout = 100;

function reset_table(table) {
    table.clear().destroy()
    $(table.id + " tbody").empty();
    $(table.id + " thead").empty();
}

function generateDataTable(id, url, height) {
    reset_table($('#' + id).DataTable())
    $('#' + id).DataTable({
        "processing": true,
        "serverSide": true,
        "scrollY": height,
        "scrollX": false,
        "order": [ 1, 'desc' ],
        ajax: {
            "type" : "GET",
            "url": url
        },
        columns: [
            {data: "bandname"},
            {data: "score"},
        ]
    });
}

$(document).ready(function () {

    $('#bandnames-table-voted').DataTable({
        "processing": true,
        "serverSide": true,
        "scrollY": "260",
        "scrollX": false,
        "order": [ 1, 'desc' ],
        ajax: {
            "type" : "GET",
            "url": "/registration/profile/get_voted_history"
        },
        columns: [
            {data: "bandname"},
            {data: "score"},
        ]
    });

    table = $('#bandnames-table-submissions').DataTable({
        "processing": true,
        "serverSide": true,
        "scrollY": "340",
        "scrollX": false,
        "order": [ 1, 'desc' ],
        ajax: {
            "type" : "GET",
            "url": "/registration/profile/get_user_submissions"
        },
        columns: [
            {data: "bandname"},
            {data: "score"},
        ]
    });

    $("#profanity_switch").click(function(e) {
        e.preventDefault();
        $.blockUI({ message: null }); 
        var value = $("#profanity_switch").prop('checked')

        $.ajax({
            type: 'POST',
            url: "/registration/profile/toggle_profanity/",
            data: {
                profanity_filter: document.getElementById('profanity_switch').value,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (data) {

                if (data == "True") {
                    $("#profanity_switch").prop('checked', false)
                } else {
                    $("#profanity_switch").prop('checked', true)
                }

                setTimeout(function() {
                    $.unblockUI();
                }, unblockUI_timeout); 
            }
        });
    });
});