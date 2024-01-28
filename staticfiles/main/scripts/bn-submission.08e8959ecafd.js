var unblockUI_timeout = 2000;

$(document).keypress(
    function (event) {
        if (event.which == '13') {
            event.preventDefault();
        }
    }
);

// Retrieves the top 3 genres for that bandname
$(window).on('getGenresForBandname', function(e) {
    $.ajax({
        type: 'GET',
        url: '/get_genre_info',
        data: {
            bandname: $('#bandname-selected').attr("value"),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            if (data.hasOwnProperty('response_msg')){
                var genres_cells = $('.genres-cells')
                
                genres_cells.inner_html = ""
                for (var i = 0; i < data['response_msg'].length; i++) {
                    genres_cells.inner_html += '\
                        <td><button onclick="selectGenreCell(\'' + data["response_msg"][i] + '\')" class="btn mr-2 mb-2 btn-primary top3-genres-buttons disable-group " type="button">\
                            <span class="btn-text">' + data["response_msg"][i] + '</span>\
                        </button></td>\
                    '
                }

                // Shows or removes the 'Top Genres' text depending on if there are any genres to show
                if (data['response_msg'].length == 0) {
                    $('.top3-text').css('display', 'none')
                } else {
                    $('.top3-text').css('display', 'block')
                }
                genres_cells.html(genres_cells.inner_html)
            }
        }
    });
});

// Handles the code for submitting one of the top 3 genres for that bandname (by clicking the cell that appears)
function selectGenreCell(genre){
    // e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: "Applying genre to bandname..." }); 
    $.ajax({
        type: 'POST',
        url: '/new_genre_submit',
        data: {
            bandname: $('#bandname-selected').attr("value"),
            genre: genre,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            
            if (data.hasOwnProperty('response_msg')){
                $.blockUI({ message: data['response_msg']});  
                setTimeout(function() {
                    $.unblockUI();
                }, unblockUI_timeout); 
            }
        }
    });
}

// Code for submitting a new genre for a bandname
$("#new-genre-submit").click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: "Applying genre to bandname..." }); 
    $.ajax({
        type: 'POST',
        url: '/new_genre_submit',
        data: {
            bandname: $('#bandname-selected').attr("value"),
            genre: $('#genre-search').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            
            if (data.hasOwnProperty('response_msg')){
                $('#genre-search').val("")
                $.blockUI({ message: data['response_msg']});  
                setTimeout(function() {
                    $.unblockUI();
                }, unblockUI_timeout); 
            }
        }
    });
});

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
            $('#bandname-selected').attr("value", data['bandname'])
            if (data.hasOwnProperty('vote_msg')){
                $.blockUI({ message: data['vote_msg']});  
            }
            if (data.hasOwnProperty('bandname_json')) {
                if (data['bandname_json']['authenticated'] == "True") {
                    $.getScript("/static/main/scripts/remove_vote.js")
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
            $('#bandname-selected').attr("value", data['bandname'])
            if (data.hasOwnProperty('vote_msg')){
                $.blockUI({ message: data['vote_msg']});
            }
            if (data.hasOwnProperty('bandname_json')) {
                if (data['bandname_json']['authenticated'] == "True") {
                    $.getScript("/static/main/scripts/remove_vote.js")
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

$("#website-logo-gif").click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: "Refreshing Wheel..." }); 
    $.ajax({
        type: 'GET',
        url: '/refresh_wheel',
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            refresh_bn_wheel(data);
            setTimeout(function() {
                $.unblockUI();
            }, 500); 
        }
    });
})