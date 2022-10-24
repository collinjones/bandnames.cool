$(document).ready(function () {
    $('#bandalytics-top-ten-users').DataTable({
        "scrollY": "340",
        "scrollX": false,
        "order": [ 1, 'desc' ],
        ajax: {
            "type" : "GET",
            "url": "/get_top_ten_bandnames"
        },
        columns: [
            {data: "username"},
            {data: "score"},
        ]
    });
});