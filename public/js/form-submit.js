$(window).ready(function(){
    var PLEASE_FILL_ALL_REQUIRED_FIELDS = 'Please fill all required fields';
    // var THANK_YOU = 'Thank you';
    var COULD_NOT_PARSE_JSON = 'Could not parse JSON';
    var WE_RECEIVED_YOUR_MESSAGE = 'We received your message.';
    var requiredFieldsObject = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        position: document.getElementById('titel'),
        remarks: document.querySelector('textarea[name="message"]')
    };
    var inputDataObject = $.extend({
        company: document.getElementById('firma'),
    }, requiredFieldsObject);
    var submit = document.getElementById('submit');
    function checkRequiredFields() {
        var messageArray = [];
        for (var property in requiredFieldsObject) {
            if (requiredFieldsObject[property].value === '') {
                messageArray.push(property);
            }
        }
        if (messageArray.length > 0) {
            $('#contactModal')
                .find('.modal-body p')
                .text(PLEASE_FILL_ALL_REQUIRED_FIELDS);
            $('#contactModal').modal('show');
            return false;
        } else {
            return messageArray.length === 0;
        }
    }

    submit.addEventListener('click', function() {
        var isEmptyRequiredField = checkRequiredFields();
        if (isEmptyRequiredField) {
            for (var prop in inputDataObject) {
                inputDataObject[prop].value = inputDataObject[prop].value.replace(/(\s|s{1}c{1}r{1}i{1}p{1}t{1}|&{1}&{1}|\${1}\({1}|\^{1}\s)/g, ' ');
            }
            var formData = $("form").serialize();
            $.ajax({
                method: "POST",
                url: 'api/mail/sendMail',
                data: formData,
            }).done(function (response) {
                var responseObject = null;
                try {
                    responseObject = JSON.parse(response);
                    Object.values(inputDataObject).forEach((input) => (input.value = ''));
                } catch (e) {
                    console.error(COULD_NOT_PARSE_JSON);
                }
                if (responseObject) {
                    handleResponse(responseObject);
                }
            });
        }
    });
    function handleResponse(responseObject) {
        var messages = "";
        responseObject.messages.map(function(message) {
            messages += message + '</br>';
        });
        // $('#contactModal').find('.modal-header h5').text(THANK_YOU);
        $('#contactModal').find('.modal-body p').html(messages);
        $('#contactModal').modal('show');
    }
});
