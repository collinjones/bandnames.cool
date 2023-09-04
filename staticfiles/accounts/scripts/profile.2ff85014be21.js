var table;

function reset_table(table, tableId) {
    table.clear().destroy()
    $(tableId + " tbody").empty();
    $(tableId + " thead").empty();
}

$("#profanity_switch").change(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: null }); 
    $.ajax({
        type: 'POST',
        url: "/registration/ProfanityToggle/",
        data: {
            profanity_filter: document.getElementById('id_profanity_filter').checked,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            $.unblockUI();
            var tableId = "#bandalytics-table"
            reset_table(table, tableId);
            table = $('#bandnames-table-profile').DataTable({
                "processing": true,
                "serverSide": true,
                "scrollY": "340",
                "scrollX": false,
                "order": [ 1, 'desc' ],
                ajax: {
                    "type" : "GET",
                    "url": "/registration/profile/get_rows"
                },
                columns: [
                    {data: "bandname"},
                    {data: "score"},
                ]
            });
        }
    });
});

$(document).ready(function () {
    table = $('#bandnames-table-profile').DataTable({
        "processing": true,
        "serverSide": true,
        "scrollY": "340",
        "scrollX": false,
        "order": [ 1, 'desc' ],
        ajax: {
            "type" : "GET",
            "url": "/registration/profile/get_rows"
        },
        columns: [
            {data: "bandname"},
            {data: "score"},
        ]
    });
});