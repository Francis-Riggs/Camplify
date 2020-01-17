// All scripts go inside this function
$(function () {
    // Sends post request for favorite button without refreshing page
    $('.favorite-form').submit(function(event) {
        event.preventDefault();
        let form = $(this),
            url = form.attr( "action" ),
            button = form.children('.favorite-btn'),
            count = form.find('.count'),
            countVal = Number(count.text()),
            statusRequest;
        if (button.hasClass('unfavorited')) {
            statusRequest = 'favorite';
        } else if (button.hasClass('favorited')) {
            statusRequest = 'unfavorite';
        }
        $.post(url, {statusRequest: statusRequest, modal: true})
            .done(function(data) {
                if (data['result'] === "favorited") {
                    button.removeClass('unfavorited');
                    button.addClass('favorited');
                    count.text(countVal + 1);
                } else if (data['result'] === "unfavorited") {
                    button.removeClass('favorited');
                    button.addClass('unfavorited');
                    count.text(countVal - 1);
                } else {
                    $('#login-modal').modal('show');
                }
        })
    });

    $('#login-modal').find('form').submit(function (event) {
        event.preventDefault();
        let form = $(this),
            url = form.attr("action");
        $.post(url, form.serialize(), function(data) {
            if (data['errorMsg']) {
                console.log(data.errorMsg);
            } 
            else {

                window.location.href = window.location['href'];
                // newHTML = $.parseHTML(data);
                // $('html').html(data);
            }
        });
        return true;
    });

});
