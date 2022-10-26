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
            if (data.hasOwnProperty('vote_msg')){
                $('#submission-status').html(data['vote_msg']);
            }
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
            if (data.hasOwnProperty('vote_msg')){
                $('#submission-status').html(data['vote_msg']);
            }
        }
    });
});

$(document).on('submit', '#batch-submission-form', function (e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: null }); 
    $.ajax({
        type: 'POST',
        url: '/batch-create',
        data: {
            bandnames: $('#bandnames').val(),
            numbered: $('#id_numbered').checked,
            dated: $('#id_dated').checked,
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
