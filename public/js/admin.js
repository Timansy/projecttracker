$(document).ready(function() {
    var adminId;

    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page

    $.get('/api/user_data').then(function(data) {
        //this is where we could handle routing based upon auth_level
        $('.member-name').text(data.username);
        $('.member-id').text(data.id);
        $('.member-auth_level').text(`administrator`);
        // window.location.replace(`/${data.auth_level}`);
        adminId = data.id;

        // Renders Admin's current projects
        renderProjects(adminId);
    });

    $('.auth_selector').change(function() {
        var val = this.value;
        $.get('/api/user_data').then(function(data) {
            $.post(`/api/auth_level/${data.id}/${val}`);
            $('.member-auth_level').text(val);
            window.location.replace(`/${val}`);
        });
    });

    $('.project-form').on('submit', handleNewProjSubmit);

    function handleNewProjSubmit(event) {
        event.preventDefault();

        let titleInput = $('#title-input').val().trim();
        let mgrUsernameInput = $('#pm-input').val().trim();
        // let adminId = $('.member-id').text();

        $.get(`/api/username/${mgrUsernameInput}`)
            .then(function(data) {
                createProject(titleInput, data.id, adminId);

                // Renders the Admin's projects with the newly created project
                $('.project-cards').empty();
                renderProjects(adminId);
            })
            .catch(function(err) {
                // Here's where we can handle a username typo...
                if (err) {
                    $('#manager-input-err').append(`
                    <p>Username does not exist</p>
                    `);
                }
            });

        $('#title-input').val('');
        $('#pm-input').val('');
    }

    function createProject(title, projectMgrId, adminId) {
        $.post(`/api/projects`, {
            title: title,
            complete: false,
            projectMgrIdId: projectMgrId,
            UserId: adminId
        }).done(function(msg) {
            console.log(`${msg.title} has been created!`);
        });
    }

    function renderProjects(userId) {
        $.get(`/api/projects/${userId}`).then(function(data) {
            data.forEach(function(project) {
                $('.project-cards').append(`
                <div class="col card">
                <div class="card-body">
                  <p>Title: ${project.title}</p>
                  <p id="pm-name">Project Manager Id: ${project.projectMgrIdId}</p>
                  <p>Complete: ${project.complete}</p>
                  </div>
                </div>
                <br>
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
            createUser(usernameInput, passwordInput, roleInput);
        } else {
            $('.password-auth').empty();
            $('.password-auth').append(`<p>Password Does Not Match</p>`);
        }
        $('#username-input').val('');
        $('#password-input').val('');
        $('#confirm-input').val('');
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