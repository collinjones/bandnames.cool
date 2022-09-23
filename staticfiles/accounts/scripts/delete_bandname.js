$("[id^=delete-button-profile]").click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: "Deleting bandname... This may take a while..." }); 
    $.ajax({
        type: 'POST',
        url: '/delete_bandname',
        data: {
            bandname: $(this).attr("value"),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            
            if (data.hasOwnProperty('response_msg')){
                $('#submission-status').html(data['response_msg']);
            }  
            console.log(data['bandname'])
            document.getElementById(data['bandname']).remove();
            $.unblockUI();
        }
    });
});