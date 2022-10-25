function add_bandname_to_voted_history(data) {
    var bandname = data['bandname_json']['bandname']
    var score = data['bandname_json']['score']
    var table = $('#bandnames-table-voted').DataTable();

    console.log(bandname, score)
    console.log(table)
    table.row.add({
        "bandname": bandname,
        "score": score
    }).draw();
}

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
            
            if (data.hasOwnProperty('response_msg')){
                $.blockUI({ message: data['response_msg']});  
                $('#bandname').val("")
                setTimeout(function() {
                    if (data.hasOwnProperty('bandname')){ 
                        var bn_count = $('#bandnames-count')
                        var count = parseInt(bn_count.text().split(" ")[1])
                        var count = count + 1
                        bn_count.html("");
                        bn_count.html("Bandnames: " + count)
                    }
                    $.unblockUI();
                }, 1000); 
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
            bandname: $('#bandname-selected').text(),
            val: "up",
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            if (data.hasOwnProperty('vote-msg')){
                $.blockUI({ message: data['vote-msg']});  
            }
            if (data.hasOwnProperty('bandname_json')) {
                if (data['bandname_json']['authenticated'] == "True") {
                    $.getScript("/static/main/scripts/remove_vote.js")
                    add_bandname_to_voted_history(data)
                }
                
                var bandnames = {}
                for (var i = 0; i < data['bandname_json']['filtered_new_bandnames'].length; i++) {
                    bandnames[data['bandname_json']['new_bandnames'][i]] = data['bandname_json']['filtered_new_bandnames'][i]
                }
                wheel.setNewBandnames(bandnames)
                wheel.repopulateWheel()
            }
            setTimeout(function() {
                $.unblockUI();
            }, 1000); 
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
            bandname: $('#bandname-selected').text(),
            val: "down",
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            if (data.hasOwnProperty('vote-msg')){
                $.blockUI({ message: data['vote-msg']});
            }
            if (data.hasOwnProperty('bandname_json')) {
                if (data['bandname_json']['authenticated'] == "True") {
                    $.getScript("/static/main/scripts/remove_vote.js")
                    add_bandname_to_voted_history(data)
                }
                var bandnames = {}
                for (var i = 0; i < data['bandname_json']['filtered_new_bandnames'].length; i++) {
                    bandnames[data['bandname_json']['new_bandnames'][i]] = data['bandname_json']['filtered_new_bandnames'][i]
                }
                wheel.setNewBandnames(bandnames)
                wheel.repopulateWheel()
            }
            setTimeout(function() {
                $.unblockUI();
            }, 1000); 
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
        "order": [ 1, 'desc' ],
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