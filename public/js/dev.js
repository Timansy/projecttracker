$(document).ready(function () {
    // GET request for user login info; Updates the HTML on the page
    $.get('/api/user_data').then(function (data) {
        // Handles routing based upon auth_level
        $('.member-name').text(data.username);
        $('.member-id').text(data.id);
        $('.member-auth_level').text(`developer`);
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

    $('.user-projects').on(
        'click',
        'button.project-btn',
        handleProjectBtnClick
    );

    // <------------------------------------------------------------------------>//
    // PROJECT BUTTON FUNCTIONS //

    function renderProjectBtns(userId) {
        $.get(`/api/tasks/task-data/user/${userId}`)
            .then(function (data) {
                var projectIdArr = [];

                // Loop through query data -- push all project Id's from data to array
                data.forEach(function (task) {
                    projectIdArr.push(task.ProjectPhase.ProjectId);
                });

                // Removes duplicate Project Id's
                projectIdArr = [...new Set(projectIdArr)];

                return projectIdArr;
            })
            .then(function (projectIdArr) {
                appendProjectBtn(projectIdArr);
            });
    }

    function appendProjectBtn(array) {
        array.forEach(function (id) {
            $.get(`/api/projects/id/${id}`).then(function (data) {
                $('.user-projects').append(`
                <button type="submit" id="${data.id}" class="project-btn btn">${data.title}</button>
                `);
            });
        });
    }

    // Handles Project FrontEnd //
    function handleProjectBtnClick(event) {
        event.preventDefault();
        $('.tasks-deck').empty();

        let userId = $('.member-id').text();

        // Setting projectId to the clicked button's id value and also converting to integer using Unary plus(+) operator
        let projectId = +$(this).attr('id');
        let userTasksArr = [];

        // Getting all task data by user
        $.get(`/api/tasks/task-data/user/${userId}`).then(function (data) {
            // Loop through query data and add objects, with a project id that matches this buttons id, to the user tasks array -- will create an array of objects that contains this users tasks by project
            data.forEach(function (task) {
                if (task.ProjectPhase.ProjectId === projectId) {
                    userTasksArr.push(task);
                }
            });

            // Calling our append function with this users id and tasks associated with the project selected
            appendTasks(userTasksArr);
        });
    }

    // <------------------------------------------------------------------------>//
    // TASK FRONT-END FUNCTIONS //

    function appendTasks(array) {
        // Creating variables to be used in status selector of tasks
        var oppositeVal;
        var statusText;
        var oppositeStatusText;

        // Looping through the array and appending tasks...
        array.forEach(function (task) {
            // Setting the variables values based on task status
            if (task.isComplete === true) {
                oppositeVal = false;
            } else oppositeVal = true;

            if (task.isComplete === true) {
                statusText = 'Complete';
                oppositeStatusText = 'In Progress';
            } else {
                statusText = 'In Progress';
                oppositeStatusText = 'Complete';
            }

            $('.tasks-deck').append(`
            <div class="w-33">
                <div class="task-card card m-2">
                    <div class="card-body">
                        <h3 class="text-center">${task.taskname}</h3>
                        <ul>
                            <li>
                                <h5>${task.ProjectPhase.title}</h5>
                            </li>
                            <li>
                            <h5>Status:</h5>
                                <div class="status-dropdown">
                                    <select
                                    class="status_selector"
                                    name="isComplete"
                                    id="${task.id}"
                                    >
                                        <option value="${task.isComplete}" selected>${statusText}</option>
                                        <option value="${oppositeVal}">${oppositeStatusText}</option>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>   
            `);
        });

        handleTaskStatusChange();
    }

    // Updates task status
    function handleTaskStatusChange() {
        $('.status_selector').change(function () {
            $.ajax({
                type: 'PUT',
                url: '/api/tasks',
                data: { id: this.id, isComplete: this.value }
            })
                .done(function () {
                    console.log('Task successfully updated');
                })
                .fail(function (err) {
                    if (err) throw err;
                });
        });
    }
});
