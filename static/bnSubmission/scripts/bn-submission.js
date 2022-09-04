$(document).on('submit', '#post-form', function (e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: null }); 
    $.ajax({
        type: 'POST',
        url: '/create',
        data: {
            bandname: $('#bandname').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            $.unblockUI();
            if (data.hasOwnProperty('response_msg')){
                $('#submission-status').html(data['response_msg']);
            }
            if (data.hasOwnProperty('bandname_json')){
                $('#submission-status').empty()
                content = "<tr> \
                                <td> " + data['bandname_json']['bandname'] + " </td> \
                                <td> " + data['bandname_json']['upvotes'] + " </td> \
                                <td> " + data['bandname_json']['downvotes'] + " </td> \
                            </tr>"
                $("#bandnames-table-body").prepend(content);
            }
        }
    });
});

$(document).ready(function() {
    $(document).on('submit', '#refresh-button', function (e) {
        e.preventDefault(); // Stop page from refreshing
        $.blockUI({ message: null }); 
        $.ajax({
            type: 'GET',
            url: '/refreshNames',
            success: function (data) {
                $.unblockUI();
                $('#submission-status').html("<h2></h2>");
                
            }
        });
    });
});