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
            $('h2').html(data);
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
                console.log(data)
                content = "<tr> \
                            <td> " + data[data.length-1]['bandname'] + " </td> \
                            <td> " + data[data.length-1]['upvotes'] + " </td> \
                            <td> " + data[data.length-1]['downvotes'] + " </td> \
                           </tr>"
                $("#bandnames-table").append(content);
            }
        });
    });
});