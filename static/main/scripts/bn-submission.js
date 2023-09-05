var unblockUI_timeout = 2000;

$(document).keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    }
);

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
                }, unblockUI_timeout); 
            }
        }
    });
});

$("#upvote-link" ).click(function(e) {

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
            $('#bandname-selected').attr("value", "")
            if (data.hasOwnProperty('vote_msg')){
                $.blockUI({ message: data['vote_msg']});  
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
                voted = true;
            }
            setTimeout(function() {
                $.unblockUI();
            }, unblockUI_timeout); 
        }
    });
});

$("#downvote-link" ).click(function(e) {
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
            $('#bandname-selected').attr("value", "")
            if (data.hasOwnProperty('vote_msg')){
                $.blockUI({ message: data['vote_msg']});
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
                voted = true;
            }
            setTimeout(function() {
                $.unblockUI();
            }, unblockUI_timeout); 
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