$(document).ready(function () {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get('/api/user_data').then(function (data) {
        //this is where we could handle routing based upon auth_level
        $('.member-name').text(data.username);
        $('.member-id').text(data.id);
        $('.member-auth_level').text(`developer`);
        // window.location.replace(`/${data.auth_level}`);
        renderProjectBtns(data.id);
    });

    $('.auth_selector').change(function () {
        var val = this.value;
        $.get('/api/user_data').then(function (data) {
            $.post(`/api/auth_level/${data.id}/${val}`);
            $('.member-auth_level').text(val);
            window.location.replace(`/${val}`);
        });
    });

    function renderProjectBtns(userId) {
        $.get(`/api/projects/${userId}`).then(function (data) {
            // console.log(data);

            data.forEach(function (project) {
                $('.user-projects').append(`
                <button class="project-btn" id="${project.id}">${project.title}</button)
                `);
            });
        });
    }

    // When specific project button is clicked
    $('.user-projects').on(
        'click',
        'button.project-btn',
        handleProjectBtnClick
    );

    // Handles Project Button click
    function handleProjectBtnClick(event) {
        event.preventDefault();
        $('.tasks-deck').empty();

        let userId = $('.member-id').text();
        // 'This' represents the project button that was clicked
        let projectId = $(this).attr('id');

        // console.log(`User Id: ${userId}`);
        // console.log(`Project Id: ${projectId}`);

        // GETS all phases associated with the selected project
        $.get(`/api/project-phase/project_id=${projectId}`).then(function (
            phaseData
        ) {
            // Render projects with user id and all phase data
            renderProjectTasks(userId, phaseData);
        });
    }

    function renderProjectTasks(userId, phaseData) {
        // Loops through Phase data and gets every task assigned to the user for a specific phase
        phaseData.forEach(function (phase) {
            $.get(`/api/tasks/user_id=${userId}/phase_id=${phase.id}`).then(
                function (data) {
                    appendTasks(data);
                }
            );
        });
    }

    function appendTasks(taskData) {
        // console.log(taskData);

        // Loops through all task data and appends task to project task list
        taskData.forEach(function (task) {
            // console.log(task);

            if (!task.isComplete) {
                $('.tasks-deck').append(`
                    <div class="card task-card" style="width: 18rem;">
                      <div class="card-body">
                        <h3>${task.taskname}</h3>
                        <ul>
                            <li>
                                <h5>Phase Id: ${task.ProjectPhaseId}</h5>
                            <li>
                                <h5>Status:</h5>
                                <div class="status-dropdown">
                                    <select 
                                      class="status_selector"
                                      name="isComplete"
                                      id="isComplete_selector"
                                    >
                                    <option
                                    value="false" selected>In progress</option>
                                    <option
                                    value="true">Complete</option>
                                </div>
                            </li>
                        </ul>
                      </div>
                    </div>
        `);
            }
        });
    }
});
