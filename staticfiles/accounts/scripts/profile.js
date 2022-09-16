$("#profile-submit" ).click(function(e) {
    e.preventDefault(); // Stop page from refreshing
    $.blockUI({ message: null }); 
    $.ajax({
        type: 'POST',
        url: "/accounts/ProfanityToggle/",
        data: {
            profanity_filter: document.getElementById('id_profanity_filter').checked,
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (data) {
            $.unblockUI();
        }
    });
});