var table;

function reset_table(table, tableId) {
    table.clear().destroy()
    $(tableId + " tbody").empty();
    $(tableId + " thead").empty();
}

function get_column_titles(data) {
    var columns = [];
    $.each( data['data'][0], function( key, value ) {

        var my_item = {};
        my_item.data = key
        my_item.title = key.replace("_", " ");

        // Replace date submitted with Submitted
        if (my_item.title == "date submitted") {
            my_item.title = "Submitted"
        }
        columns.push(my_item);
    });
    return columns
}

// Gets called when page loads 
$(document).ready(function () {
    const selectedVal = $("#bandalytics_selection option:selected").val();
    const url = '/' + selectedVal

    console.log(selectedVal, url)
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            bandname: $(this).attr("value"),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            if (data.hasOwnProperty('response_msg')){
                $('#submission-status').html(data['response_msg']);
            }
            var columns = get_column_titles(data)

            console.log(data, columns)
            table = $('#bandalytics-table').DataTable({
                "scrollY": "180",
                "scrollX": false,
                "paging": false,
                "bInfo" : false,
                "searching": false,
                "autoWidth": false, 
                "bDestroy": true,
                "order": selectedVal == 'get_top_ten_users' ? [ 1, 'desc' ] : [ 2, 'desc' ],
                ajax: {
                    "type" : "GET",
                    "url": url
                },
                "columns": columns
            });
        }
    });    
});

// Gets called when user selects a new option from the dropdown
$(document).on('change','#bandalytics_selection',function(){

    var selectedVal = $("#bandalytics_selection option:selected").val();
    const tableId = "#bandalytics-table"
    const url = '/' + selectedVal

    if (selectedVal == "get_top_ten_bandnames") {
        $.ajax({
            type: 'GET',
            url: url,
            data: {
                bandname: $(this).attr("value"),
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (data) {
                if (data.hasOwnProperty('response_msg')){
                    $('#submission-status').html(data['response_msg']);
                }

                const columns = get_column_titles(data)
                reset_table(table, tableId)
                table = $(tableId).DataTable({
                    "scrollY": "180",
                    "scrollX": false,
                    "paging": false,
                    "bInfo" : false,
                    "searching": false,
                    "bDestroy": true,
                    "autoWidth": false, 
                    "order": [ 2, 'desc' ],
                    ajax: {
                        "type" : "GET",
                        "url": url
                    },
                    "columns": columns
                });
            }
        }); 
    }
    else if (selectedVal == "get_top_ten_users") {
        $.ajax({
            type: 'GET',
            url: url,
            data: {
                user: $(this).attr("value"),
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (data) {
                if (data.hasOwnProperty('response_msg')){
                    $('#submission-status').html(data['response_msg']);
                }
                const columns = get_column_titles(data)
                reset_table(table, tableId)
                table = $(tableId).DataTable({
                    "scrollY": "180",
                    "scrollX": false,
                    "paging": false,
                    "bInfo" : false,
                    "autoWidth": false, 
                    "searching": false,
                    "bDestroy": true,
                    "order": [ 1, 'desc' ],
                    ajax: {
                        "type" : "GET",
                        "url": url
                    },
                    "columns": columns
                });
            }
        }); 
    }

    else if (selectedVal == "get_righteous_ratio") {
        $.ajax({
            type: 'GET',
            url: url,
            data: {
                user: $(this).attr("value"),
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (data) {
                if (data.hasOwnProperty('response_msg')){
                    $('#submission-status').html(data['response_msg']);
                }
                const columns = get_column_titles(data)
                reset_table(table, tableId)

                table = $(tableId).DataTable({
                    "scrollY": "180",
                    "scrollX": false,
                    "paging": false,
                    "bInfo" : false,
                    "autoWidth": false, 
                    "searching": false,
                    "bDestroy": true,
                    "order": [ 2, 'desc' ],
                    ajax: {
                        "type" : "GET",
                        "url": url
                    },
                    "columns": columns
                });
            }
        }); 
    }

    else if (selectedVal == "recent_bandnames") {
        $.ajax({
            type: 'GET',
            url: url,
            data: {
                user: $(this).attr("value"),
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (data) {
                if (data.hasOwnProperty('response_msg')){
                    $('#submission-status').html(data['response_msg']);
                }
                const columns = get_column_titles(data)
                reset_table(table, tableId)

                table = $(tableId).DataTable({
                    "scrollY": "180",
                    "scrollX": false,
                    "paging": false,
                    "bInfo" : false,
                    "autoWidth": false, 
                    "searching": false,
                    "bDestroy": true,
                    "order": [ 2, 'desc' ],
                    ajax: {
                        "type" : "GET",
                        "url": url
                    },
                    "columns": columns
                });
            }
        }); 
    }
});      
