$(document).ready(function() {
    // GET request to figure out which user is logged in; Updates the HTML on the page
    $.get("/api/user_data").then(function(data) {
        window.location.replace(`/${data.auth_level}`);
    });
});