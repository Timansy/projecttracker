$(document).ready(function() {
    // Getting references to our form and inputs
    var loginForm = $('form.login');
    var usernameInput = $('input#username-input');
    var passwordInput = $('input#password-input');
    var registerBtn = $('input.register-btn');
    var resetBtn = $('input.reset-btn');

    resetBtn.on('click', handleResetRedirect);
    registerBtn.on('click', handleRegisterRedirect);

    // When the form is submitted, validate there's an email and password entered
    loginForm.on('submit', function(event) {
        event.preventDefault();
        var userData = {
            username: usernameInput.val().trim(),
            password: passwordInput.val().trim()
        };

        if (!userData.username || !userData.password) {
            return;
        }

        // When username and password are validated, run the loginUser function and clear the form
        loginUser(userData.username, userData.password);
        usernameInput.val('');
        passwordInput.val('');
    });

    // loginUser posts "api/login" route and if successful, redirects to members page
    function loginUser(username, password) {
        $.post('/api/login', {
                username: username,
                password: password
            })
            .then(function() {
                //go into secure area
                window.location.replace('/in');
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    function handleRegisterRedirect(event) {
        event.preventDefault();

        window.location.replace('/signup');
    }

    function handleResetRedirect(event) {
        event.preventDefault();

        window.location.replace('/password-reset');
    }
});