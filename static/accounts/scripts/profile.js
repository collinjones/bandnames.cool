$("#profile-submit" ).click(function(e) {
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
        }
    });
});

$(document).ready(function () {
    $('#bandnames-table-profile').DataTable({
        "processing": true,
        "serverSide": true,
        "scrollY": "275",
        "scrollX": false,
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