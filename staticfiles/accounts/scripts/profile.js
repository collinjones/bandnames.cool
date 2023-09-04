var table;

function reset_table(table, tableId) {
    table.clear().destroy()
    $(tableId + " tbody").empty();
    $(tableId + " thead").empty();
}

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

    $("#profanity_switch").click(function(e) {
        e.preventDefault(); // Stop page from refreshing
        $.blockUI({ message: null }); 
        var value = $(this).val();
        $.ajax({
            type: 'POST',
            url: "/registration/ProfanityToggle/",
            data: {
                profanity_filter: document.getElementById('profanity_switch').value,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (data) {
                $.unblockUI();

                console.log(data)
                if(data == "True") {
                    console.log('setting to false')
                    $("#profanity_switch").html("Profanity Off")
                    $("#profanity_switch").prop( "checked", false );
                } else {
                    console.log('setting to true')
                    $("#profanity_switch").html("Profanity On")
                    $("#profanity_switch").prop('checked', true );
                }

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
});