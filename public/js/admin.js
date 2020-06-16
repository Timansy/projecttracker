var adminId;

$(document).ready(function () {
    // GET request to figure out which user is logged in; Updates the HTML on the page
    $.get('/api/user_data').then(function (data) {
        // Handles routing based upon auth_level

        $('.member-name').text(data.username);
        $('.member-id').text(data.id);
        $('.member-auth_level').text(`administrator`);
        adminId = data.id;

        // Renders Admin's current projects
        renderProjects(adminId);
    });

    // Changes Auth_level
    $('.auth_selector').change(function () {
        var val = this.value;
        $.get('/api/user_data').then(function (data) {
            $.post(`/api/auth_level/${data.id}/${val}`);
            $('.member-auth_level').text(val);
            window.location.replace(`/${val}`);
        });
    });

    // <----------------------------------------------------------------------->//
    // CLICK EVENTS //
    $('.project-form').on('submit', handleNewProjSubmit);
    $('.user-form').on('submit', handleNewUserSubmit);
    $(document).on('click', '#project-delete', handleProjectDelete);

    // <------------------------------------------------------------------------>//
    // PROJECT FUNCTIONS //

    function handleNewProjSubmit(event) {
        event.preventDefault();

        let titleInput = $('#title-input').val().trim();
        let mgrUsernameInput = $('#pm-input').val().trim();

        if (!titleInput || !mgrUsernameInput) {
            $('#new-proj-alert').text('Please fill out entire form');
            $('#new-proj-alert').fadeIn(500);

            return;
        } else {
            $.get(`/api/users/username/${mgrUsernameInput}`)
                .then(function (data) {
                    createProject(titleInput, data.id, adminId);

                    $('#title-input').val('');
                    $('#pm-input').val('');
                })
                .catch(function (err) {
                    if (err) {
                        $('#new-proj-alert').text('Username does not exist');
                        $('#new-proj-alert').fadeIn(500);
                    }
                });
        }
    }

    function createProject(title, projectMgrId, adminId) {
        $.post(`/api/projects`, {
            title: title,
            complete: false,
            projectMgrIdId: projectMgrId,
            UserId: adminId
        }).done(function (msg) {
            $('#new-proj-alert').text(`${msg.title} successfully created`);
            $('#new-proj-alert').fadeIn(500);
            $('#new-proj-alert').fadeOut(500);

            renderProjects(adminId);
        });
    }

    function renderProjects(userId) {
        $('.project-cards').empty();

        $.get(`/api/projects/${userId}`).then(function (data) {
            data.forEach(function (project) {
                let statusIcon;

                if (project.complete === true) {
                    statusIcon = `<i class="fas fa-check"></i>`;
                } else {
                    statusIcon = `<i class="fas fa-times"></i>
                    `;
                }
                console.log(statusIcon);
                $('.project-cards').append(`
                <div class="w-33">
                    <div class="card m-2">
                        <div class="card-body">
                            <button class="project-delete btn btn-danger" id="project-delete" style="float:right;" data-id="${project.id}">X</button>
                            <h4>${project.title}</h4><br>
                            <p id="pm-name">Manager Id: ${project.projectMgrIdId}</p>
                            <p>Complete: ${statusIcon}</p>
                        </div>
                    </div>
                </div>
                `);
            });
        });
    }

    // <------------------------------------------------------------------------>//
    // USER FUNCTIONS //

    function handleNewUserSubmit(event) {
        event.preventDefault();
        $('.password-auth').empty();

        let usernameInput = $('#username-input').val().trim();
        let passwordInput = $('#password-input').val().trim();
        let confirmInput = $('#confirm-input').val().trim();
        let roleInput = $('#roles').val().trim();

        let userData = {
            username: usernameInput,
            password: passwordInput,
            passwordConfirm: confirmInput
        };

        if (!userData.username || !userData.password) {
            $('#new-user-alert').text('Please fill out entire form');
            $('#new-user-alert').fadeIn(500);

            setTimeout();
            return;
        } else if (userData.password !== userData.passwordConfirm) {
            $('#new-user-alert').text('Passwords do not match');
            $('#new-user-alert').fadeIn(500);
            return;
        } else {
            createUser(userData.username, userData.password, roleInput);
        }

        $('#username-input').val('');
        $('#password-input').val('');
        $('#confirm-input').val('');
    }

    // Creates new user and posts to DB from user input
    function createUser(username, password, authLevel) {
        $.post('/api/users/create-user', {
            username: username,
            password: password,
            auth_level: authLevel
        })
            .then(function (data) {
                $('#new-useralert').text('User successfully created');
                $('#new-user-alert').fadeIn(500);
                $('#new-user-alert').fadeOut(500);
            })
            .catch(function (err) {
                if (err) {
                    $('#new-user-alert').text('Username already exists');
                    $('#new-user-alert').fadeIn(500);
                }
            });
    }

    //<-------------------------------------------------------------------------------------------->//
    // PROJECT DELETE //
    $(document).on('click', '#project-delete', handleProjectDelete);

    //<--------------------------------------------------------------------------->//
    // PROJECT DELETE FUNCTIONS //

    function handleProjectDelete() {
        let projectId = $(this).attr('data-id');
        $.ajax({
            method: 'DELETE',
            url: '/api/projects/' + projectId
        }).then(() => {
            $('.project-cards').empty();
            renderProjects(adminId);
        });
    }
});
