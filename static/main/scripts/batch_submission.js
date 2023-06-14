$(document).on('submit', '#batch-submission-form', function (e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: "Please wait! This may take a long time depending on the length of your list" }); 
    $.ajax({
        type: 'POST',
        url: '/batch-create',
        data: {
            bandnames: $('#bandnames').val(),
            numbered: $('#id_numbered').is(":checked"),
            dated: $('#id_dated').is(":checked"),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            $.unblockUI();
            if (data.hasOwnProperty('response_msg')){
                $('#batch-submission-response').html(data['response_msg']);
            }           
        }
    });
});