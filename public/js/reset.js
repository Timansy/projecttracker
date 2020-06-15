$(document).ready(function () {
    var resetForm = $('form.reset');
    var usernameInput = $('input#username-input');
    var passwordInput = $('input#password-input');
    var passwordConfirm = $('input#password-confirm-input');
    var signupBtn = $('input.signup-btn');

    resetForm.on('submit', handleResetSubmit);

    function handleResetSubmit(event) {
        event.preventDefault();

        var userData = {
            username: usernameInput.val().trim(),
            password: passwordInput.val().trim(),
            passwordConfirm: passwordConfirm.val().trim()
        };

        if (
            !userData.username ||
            !userData.password ||
            !userData.passwordConfirm
        ) {
            $('div#alert').text('Please fill out entire form');
            $('#alert').fadeIn(500);
            return;
        } else if (userData.password !== userData.passwordConfirm) {
            $('div#alert').text('Passwords do not match');
            $('#alert').fadeIn(500);
            return;
        } else {
            resetPassword(userData.username, userData.password);
        }
    }

    function resetPassword(username, password) {
        $.ajax({
            type: 'PUT',
            url: '/api/user-password',
            data: { username: username, password: password }
        })
            .done(function () {
                $('div#alert').text('Password successfully updated');
                $('#alert').fadeIn(500);

                // Creates one second delay so user can see the success message before being redirected to login with new password
                setTimeout(function () {
                    window.location.replace('/');
                }, 1000);
            })
            .fail(function (err) {
                if (err) throw err;
                return;
            });
    }

    signupBtn.on('click', handleSignupRedirect);

    function handleSignupRedirect(event) {
        event.preventDefault();

        window.location.replace('/signup');
    }
});
