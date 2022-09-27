$("#profile-submit" ).click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: null }); 
    $.ajax({
        type: 'POST',
        url: "/accounts/ProfanityToggle/",
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
        'columnDefs': [{ 'orderable': false, 'targets': 0 , className: 'dt-center'}],
        "scrollY": "375",
        'order': [[ 2, "dec" ]],
        "scrollX": false
    });
});