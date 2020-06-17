$(document).ready(function () {
    // Getting references to our form and input
    var signupForm = $('form.signup');
    var usernameInput = $('input#username-input');
    var passwordInput = $('input#password-input');
    var passwordConfirm = $('input#password-confirm-input');
    var loginBtn = $('input.login-btn');

    // When the signup button is clicked, we validate the username and password are not blank
    signupForm.on('submit', function (event) {
        event.preventDefault();
        var userData = {
            username: usernameInput.val().trim(),
            password: passwordInput.val().trim(),
            passwordConfirm: passwordConfirm.val().trim()
        };

        if (!userData.username || !userData.password) {
            $('div#alert').text('Please fill out entire form');
            $('#alert').fadeIn(500);

            setTimeout(function () {
                $('#alert').fadeOut(500);
            }, 2000);
        } else if (userData.password !== userData.passwordConfirm) {
            $('div#alert').text('Passwords do not match');
            $('#alert').fadeIn(500);

            setTimeout(function () {
                $('#alert').fadeOut(500);
            }, 2000);
        } else {
            signUpUser(userData.username, userData.password);
            usernameInput.val('');
            passwordInput.val('');
        }

        // If we have an username and password, run the signUpUser function
    });

    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpUser(username, password) {
        $.post('/api/register', {
            username: username,
            password: password
        })
            .then(function (data) {
                $('div#alert').text('Account successfully created');
                $('#alert').fadeIn(500);

                // Creates one second delay so user can see the success message before being redirected to Admin view
                setTimeout(function () {
                    window.location.replace('/in');
                }, 1000);
            })
            .catch(function (err) {
                if (err) {
                    $('div#alert').text('Username already exists');
                    $('#alert').fadeIn(500);
                }
            });
    }

    loginBtn.on('click', handleLoginRedirect);

    function handleLoginRedirect(event) {
        event.preventDefault();

        window.location.replace('/login');
    }
});
