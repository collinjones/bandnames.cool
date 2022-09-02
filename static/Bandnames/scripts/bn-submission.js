$(document).on('submit', '#post-form', function (e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: null }); 
    $.ajax({
        type: 'POST',
        url: '/create',
        data: {
            bandname: $('#bandname').val(),
            username: $('#username').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            $.unblockUI();
            $('h1').html(data);
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
            dataType: "html",
            success: function (data) {
                $.unblockUI();
                console.log(data)
                $("#bandnames-list").append('<li>' + data + '</li>');
            }
        });
    });
});