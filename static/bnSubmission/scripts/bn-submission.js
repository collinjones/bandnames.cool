$("#bandname-submit" ).click(function(e) {
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
                console.log(data['response_msg'])
                $('#submission-status').html(data['response_msg']);
            }
        }
    });
});

$("#upvote-button" ).click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: null }); 
    $.ajax({
        type: 'POST',
        url: '/vote',
        data: {
            bandname: $('#bandname-selected').attr("value"),
            val: "up",
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            $.unblockUI();
            if (data.hasOwnProperty('vote-msg')){
                $('#submission-status').html(data['vote-msg']);
            }
            content = "<tr>\
                            <td class='tooltip'>" + data['bandname_json']['bandname'] + "\
                                <span class='tooltiptext'>" + data['bandname_json']['username'] + "</span>\
                            </td>\
                        <td>" + data['bandname_json']['score'] + "</td>\
                    </tr>"
            $('#bandnames-table-body').prepend(content)
        }
    });
});
$("#downvote-button" ).click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: null }); 
    $.ajax({
        type: 'POST',
        url: '/vote',
        data: {
            bandname: $('#bandname-selected').attr("value"),
            val: "down",
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            $.unblockUI();
            if (data.hasOwnProperty('vote-msg')){
                $('#submission-status').html(data['vote-msg']);
            }
        }
    });
});

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
