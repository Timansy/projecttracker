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
            return;
        } else if (userData.password !== userData.passwordConfirm) {
            return;
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
        $.post('/api/signup', {
            username: username,
            password: password
        })
            .then(function (data) {
                window.location.replace('/in');
            })
            .catch(handleLoginErr);
    }

    function handleLoginErr(err) {
        $('#alert .msg').text(err.responseJSON);
        $('#alert').fadeIn(500);
    }

    loginBtn.on('click', handleLoginRedirect);

    function handleLoginRedirect(event) {
        event.preventDefault();

        window.location.replace('/login');
    }
});
