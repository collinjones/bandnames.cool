$("#bandname-submit" ).click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: "Submitting bandname..." }); 
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
    $.blockUI({ message: "Voting up..." }); 
    $.ajax({
        type: 'POST',
        url: '/vote',
        data: {
            bandname: $('#bandname-selected').attr("value"),
            val: "up",
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            if (data.hasOwnProperty('vote_msg')){
                $('#submission-status').html(data['vote_msg']);
            }
            if (data.hasOwnProperty('bandname_json')) {
                if (data['bandname_json']['authenticated'] == "True") {
                    $.getScript("/static/main/scripts/remove_vote.js")
                    $('#bandnames-table-body').prepend(data['bandname_json']['table_content_template'])
                }
                
                var bandnames = {}
                for (var i = 0; i < data['bandname_json']['filtered_new_bandnames'].length; i++) {
                    bandnames[data['bandname_json']['new_bandnames'][i]] = data['bandname_json']['filtered_new_bandnames'][i]
                }
                wheel.setNewBandnames(bandnames)
                wheel.repopulateWheel()
            }
            
            $.unblockUI();
        }
    });
});
$("#downvote-button" ).click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: "Voting down..." }); 
    $.ajax({
        type: 'POST',
        url: '/vote',
        data: {
            bandname: $('#bandname-selected').attr("value"),
            val: "down",
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            if (data.hasOwnProperty('vote_msg')){
                $('#submission-status').html(data['vote_msg']);
            }
            if (data.hasOwnProperty('bandname_json')) {
                if (data['bandname_json']['authenticated'] == "True") {
                    $.getScript("/static/main/scripts/remove_vote.js")
                    $('#bandnames-table-body').prepend(data['bandname_json']['table_content_template'])
                }
                var bandnames = {}
                for (var i = 0; i < data['bandname_json']['filtered_new_bandnames'].length; i++) {
                    bandnames[data['bandname_json']['new_bandnames'][i]] = data['bandname_json']['filtered_new_bandnames'][i]
                }
                wheel.setNewBandnames(bandnames)
                wheel.repopulateWheel()
            }

            $.unblockUI();
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

$("[id^=delete-button]").click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: "Removing bandname..." }); 
    $.ajax({
        type: 'POST',
        url: '/remove_bandname',
        data: {
            bandname: $(this).attr("value"),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            
            if (data.hasOwnProperty('response_msg')){
                $('#submission-status').html(data['response_msg']);
            }  
            
            // Javascript here!
            document.getElementById(data['bandname']).remove();
            $.unblockUI();
        }
    });
});

$(document).ready(function () {
    $('#bandnames-table-voted').DataTable({
        "processing": true,
        "serverSide": true,
        "scrollY": "160",
        "scrollX": false,
        "columnDefs": [
            { "width": "20px", "targets": 1 }
        ],
        ajax: {
            "type" : "GET",
            "url": "/get_voted_history"
        },
        columns: [
            {data: "bandname"},
            {data: "score"},
        ]
    });
});




