$(document).ready(function () {
    var usedID;

    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page

    $.get('/api/user_data').then(function (data) {
        //this is where we could handle routing based upon auth_level
        $('.member-name').text(data.username);
        $('.member-id').text(data.id);
        $('.member-auth_level').text(`administrator`);
        // window.location.replace(`/${data.auth_level}`);
        usedID = data.id;

        // Renders Admin's current projects
        renderProjects(usedID);

        populateManagerOptions();
    });

    $('.auth_selector').change(function () {
        var val = this.value;
        $.get('/api/user_data').then(function (data) {
            $.post(`/api/auth_level/${data.id}/${val}`);
            $('.member-auth_level').text(val);
            window.location.replace(`/${val}`);
        });
    });

    $('.project-form').on('submit', handleNewProjSubmit);

    function handleNewProjSubmit(event) {
        event.preventDefault();

        let titleInput = $('#title-input').val().trim();
        let managerIdInput = +$('#project-managers').val().trim();
        let adminId;

        $.get('/api/user_data').then(function (data) {
            adminId = data.id;

            createProject(titleInput, managerIdInput, adminId);

            // Empty's projects div and renders with new project added
            $('.project-cards').empty();
            renderProjects(adminId);
        });
    }

    function createProject(title, projectMgrId, adminId) {
        $.post(`/api/projects`, {
            title: title,
            complete: false,
            projectMgrIdId: projectMgrId,
            UserId: adminId
        });
    }

    function renderProjects(userId) {
        $.get(`/api/projects/${userId}`).then(function (data) {
            data.forEach(function (project) {
                $('.project-cards').append(`
                <div>
                  <p>Title: ${project.title}</p>
                  <p>Project Manager ID: ${project.projectMgrIdId}</p>
                  <p>Complete: ${project.complete}</p>
                </div>
                <br>
                `);
            });
        });
    }

    // Makes all users available in Select Project Manager drop down
    function populateManagerOptions() {
        $.get(`/api/users`).then(function (data) {
            $('#project-managers').empty();
            data.forEach((user) => {
                $('#project-managers').append(`
                  <option value="${user.id}">${user.username}</option>
           `);
            });
        });
    }

    $('.user-form').on('submit', handleNewUserSubmit);

    function handleNewUserSubmit(event) {
        event.preventDefault();
        $('.password-auth').empty();

        let usernameInput = $('#username-input').val().trim();
        let passwordInput = $('#password-input').val().trim();
        let confirmInput = $('#confirm-input').val().trim();
        let roleInput = $('#roles').val().trim();

        if (passwordInput === confirmInput) {
            console.log(usernameInput, passwordInput, roleInput);

            createUser(usernameInput, passwordInput, roleInput);

            populateManagerOptions();
        } else {
            $('.password-auth').empty();
            $('.password-auth').append(`<p>Password Does Not Match</p>`);
        }
    }

    // Creates new user and posts to DB from user input
    function createUser(username, password, authLevel) {
        $.post('/api/users', {
            username: username,
            password: password,
            auth_level: authLevel
        });
    }
});
