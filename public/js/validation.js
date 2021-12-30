var captcha_flag = 0;
function check_fields() {
    var name = $('#name').val();
    var email = $('#email').val();
    var titel = $('#titel').val();
    var message = $('#message').val();
    if (name && email && titel && message && captcha_flag) {
        $('#submit').removeAttr('disabled');
    } else {
        $('#submit').attr('disabled');
    }
}

$('form').on('change', 'input', function () {
    check_fields();
});

$('form').on('change', 'textarea', function () {
    check_fields();
});
function recaptchaCallback() {
    captcha_flag = 1;
    check_fields();
}
$.validator.addMethod(
    "regex",
    function (value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    },
    "Please check your input."
);

$(document).ready(function () {
    $('form').validate({
        rules: {
            name: {
                required: true,
                minlength: 3,
                maxlength: 120,
                regex: /^[\u00C0-\u017FaA-\u00C0-\u017FZa-\u00C0-\u017Fz' -]+$/
            },
            email: {
                required: true,
                email: true,
                regex: /^[aA-zZ0-9](\.?[aA-zZ0-9_-]){0,}@[aA-zZ0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/
            },
            titel: {
                required: true,
                minlength: 3,
                maxlength: 120,
            },
            message: {
                required: true,
                minlength: 3,
                maxlength: 120,
            }
        },
        messages: {
            name: {
                minlength: "Geben Sie bitte mindestens 3 Zeichen ein",
                regex: "Bitte verwenden Sie nur Buchstaben, 'Raum' oder '-'",
                maxlength: "Bitte geben Sie nicht mehr 120 Zeichen ein",
                required: "Dieses Feld wird benötigt",
            },
            email: {
                email: "Geben Sie bitte eine gültige e-Mail Adresse ein",
                required: "Dieses Feld wird benötigt",
                regex: "Geben Sie bitte eine gültige e-Mail Adresse ein, Beispiel: name@company.com",
            },
            titel: {
                minlength: "Geben Sie bitte mindestens 3 Zeichen ein",
                required: "Dieses Feld wird benötigt",
                maxlength: "Bitte geben Sie nicht mehr 120 Zeichen ein",
            },
            message: {
                required: "Dieses Feld wird benötigt",
                minlength: "Geben Sie bitte mindestens 3 Zeichen ein",
                maxlength: "Bitte geben Sie nicht mehr 120 Zeichen ein",
            }
        }
    });
});