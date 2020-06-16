var currentProjectId;

$(document).ready(function () {
    let userProjects = [];
    let projectPhases = [];

    projectNavContainer = $('#project-nav-container');
    projectDisplayArea = $('.phases-deck');

    let addPhaseBtn = $('#addPhaseBtn');
    let phaseSubmit = $('#phaseSubmit');
    let phaseTitleInput = $('#phase-title');
    let phaseProjectId = $('#projectId');

    let addTaskBtn = $('#addTaskBtn');
    let taskSubmit = $('#taskSubmit');
    let taskTitleInput = $('#task-title');
    let taskPhaseId = $('#phaseId');
    let taskAssigneeId = $('#assigneeId');

    // GET request to figure out which user is logged in; Updates the HTML on the page

    $.get('/api/user_data').then(function (data) {
        // Handles routing based upon auth_level
        $('.member-name').text(data.username);
        $('.member-id').text(data.id);
        $('.member-auth_level').text(`project_manager`);
        loadProjectNavigation(data.id);

        // Populates Project options for Add Phase
        getProjects(data.id);
    });

    $('.auth_selector').change(function () {
        var val = this.value;
        $.get('/api/user_data').then(function (data) {
            $.post(`/api/auth_level/${data.id}/${val}`);
            window.location.replace(`/${val}`);
        });
    });

    // <----------------------------------------------------------------------->//
    // CLICK EVENTS //
    $(phaseSubmit).on('click', handleNewPhase);
    $(taskSubmit).on('click', handleNewTask);
    $(document).on('click', '#phase-delete', handlePhaseDelete);
    $(document).on('click', '#task-delete', handleTaskDelete);

    $(addPhaseBtn).on('click', function () {
        $('#phaseCollapse.collapse').toggleClass('show');
    });

    $(addTaskBtn).on('click', function () {
        getAssignees();
        $('#taskCollapse.collapse').toggleClass('show');
    });

    // <------------------------------------------------------------------------>//
    // PROJECT NAV FUNCTIONS //
    function loadProjectNavigation(pm_id) {
        fetchArray('userProjects', pm_id);
    }

    function displayUserProjectsNav(data) {
        if (data.length > 0) {
            $('#active-project').empty().append(`<h5>${data[0].title}</h5>`);
            fetchArray('projectPhases', data[0].id);
        }
        userProjects = data;
        projectNavContainer.append(`<strong>Select a project:</strong>`);

        userProjects.forEach((project) => {
            projectNavContainer.append(`
            <a class=" project-nav-link" href="#" id="${project.id}-${project.title}" >${project.title}</a> | 
        `);
        });

        $('.project-nav-link').click(function () {
            let idstring = this.id;
            let id = idstring.split('-');
            loadProject(id[0]);
            $('#active-project').empty().append(`<h5>${id[1]}</h5>`);
        });
    }

    // <------------------------------------------------------------------------>//
    // PHASES  DISPLAY FUNCTIONS //

    function displayProjectPhases(projectId, data) {
        // Populates phase options for Add Task when phases are displayed
        getPhases(projectId);

        phaseArray = [];
        projectPhases = data;
        projectPhases.forEach((phase) => {
            $.get('/api/pmview/allofit/' + phase.id)
                .then((res) => {
                    var taskArrayText = '';
                    for (let i = 0; i < res.Tasks.length; i++) {
                        var userId = res.Tasks[i].UserId - 1;
                        taskArrayText += `
                           <div class="card task-card" style="width:auto">

                          <div class="card-body">
                          <button class="btn-sm btn-danger task-delete" id="task-delete"
                          style="float:right; margin: 5px;" data-id="${res.Tasks[i].id}">X</button>       
                          <h5>${res.Tasks[i].taskname}</h5>
                                  <ul>
                                      <li>Complete: <br> ${res.Tasks[i].isComplete}</li>
                                      <li> Assignee: <br> ${res.Users[userId].username}</li>
                                  </ul>
                                  </div>
                                  </div>`;
                    }
                    phaseArray.push(`<!--${phase.id}-->
                <div class="phase-card card col-fluid" id="phase-card" style="width:18rem;"> 
                    <div style="text-align: center; margin-top: 10px;">
                    <button class="phase-delete btn btn-danger" id="phase-delete" style="float:right; margin: 5px;" data-id="${phase.id}">X</button>
                        <h3>${phase.title}</h3>

                    </div> 

                    <div class="card-body" id="task-container-${phase.id}">
                             ${taskArrayText} 

                    </div>
                </div>`);
                })
                .then(() => {
                    phaseArray.sort();
                    projectDisplayArea.empty();
                    phaseArray.forEach((phase) => {
                        projectDisplayArea.append(phase);
                    });
                });
        });
    }

    //displays the called project in the projectDisplayArea
    function loadProject(project_id) {
        fetchArray('projectPhases', project_id);
        // Gets phases of currently loaded project to populate phase options for Add Task
        getPhases(project_id);
    }

    function fetchArray(arrayName, id_ref) {
        switch (arrayName) {
            case 'userProjects':
                $.get(`/api/projectsnav/${id_ref}`).then((data) => {
                    displayUserProjectsNav(data);
                });
                break;
            case 'projectPhases':
                projectDisplayArea.empty();
                $.get(`/api/project-phase/project_id=${id_ref}`).then(
                    (data) => {
                        currentProjectId = id_ref;
                        displayProjectPhases(currentProjectId, data);
                    }
                );
                break;
            case 'phaseTasks':
                $.get(`/api/tasks/phase/${id_ref}`, (req, res) => {
                    phaseTasks = res;
                });
                break;
        }
    }

    // <--------------------------------------------------------------------------->//
    // PHASE SUBMISSION //

    // Makes new phase object for DB population
    function handleNewPhase(event) {
        event.preventDefault();
        let newPhase = phaseTitleInput.val().trim();
        if (!newPhase) {
            $('#add-phase-alert').text('Please enter a Phase Title');
            $('#add-phase-alert').fadeIn(500);

            setTimeout(function () {
                $('#add-phase-alert').fadeOut(500);
            }, 2000);
            return;
        } else
            createPhase({
                title: newPhase,
                phaseComplete: false,
                ProjectId: $('#projectId').val()
            });
        phaseTitleInput.val('');
    }

    // Posts new phase object in DB
    function createPhase(phaseData) {
        $.post('/api/project-phase', phaseData).done(() => {
            loadProject(phaseData.ProjectId);
        });
    }

    function getProjects(mgrId) {
        $.get(`/api/projectsnav/${mgrId}`, renderProjectList);
    }

    // Gets and renders projects for phase submission on frontend //

    function renderProjectList(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createProjectRow(data[i]));
        }
        phaseProjectId.empty();
        phaseProjectId.append(rowsToAdd);
        phaseProjectId.val(projectId);
    }

    function createProjectRow(project) {
        var listOption = $('<option>');
        listOption.attr('value', project.id);
        listOption.text(project.title);
        return listOption;
    }

    // <--------------------------------------------------------------------------->//
    // TASK SUBMISSION //

    //Creates new task object for DB
    function handleNewTask(event) {
        event.preventDefault();
        let newTask = taskTitleInput.val().trim();
        if (!newTask) {
            $('#add-task-alert').text('Please enter a Task Title');
            $('#add-task-alert').fadeIn(500);

            setTimeout(function () {
                $('#add-task-alert').fadeOut(500);
            }, 2000);
            return;
        } else
            createTask({
                taskname: newTask,
                isComplete: false,
                ProjectPhaseId: $('#phaseId').val(),
                UserId: $('#assigneeId').val()
            });
        taskTitleInput.val('');
        loadProject(currentProjectId);
    }

    // Posts new task object for DB
    function createTask(taskData) {
        $.post('/api/tasks', taskData);
    }

    // Gets and renders phases for task submission on frontend //
    function getPhases(projectId) {
        $.get(`/api/project-phase/project_id=${projectId}`, renderPhaseList);
    }

    function renderPhaseList(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createPhaseRow(data[i]));
        }
        taskPhaseId.empty();
        taskPhaseId.append(rowsToAdd);
        taskPhaseId.val(phaseId);
    }

    function createPhaseRow(phase) {
        var listOption = $('<option>');
        listOption.attr('value', phase.id);
        listOption.text(phase.title);
        return listOption;
    }

    // Gets and renders assignees for task submission on frontend //
    function getAssignees() {
        $.get('/api/users', renderAssigneeList);
    }

    function renderAssigneeList(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createAssigneeRow(data[i]));
        }
        taskAssigneeId.empty();
        taskAssigneeId.append(rowsToAdd);
        taskAssigneeId.val(assigneeId);
    }

    function createAssigneeRow(assignee) {
        var listOption = $('<option>');
        listOption.attr('value', assignee.id);
        listOption.text(assignee.username);
        return listOption;
    }

    // <-------------------------------------------------------------------------> //
    // PHASE DELETE //

    function handlePhaseDelete() {
        let phaseId = $(this).attr('data-id');
        $.ajax({
            method: 'DELETE',
            url: '/api/project-phase/' + phaseId
        }).then(() => {
            loadProject(currentProjectId);
        });
    }

    // <-------------------------------------------------------------------------> //
    // TASK DELETE //

    function handleTaskDelete() {
        let taskId = $(this).attr('data-id');
        $.ajax({
            method: 'DELETE',
            url: '/api/tasks/' + taskId
        }).then(() => {
            loadProject(currentProjectId);
        });
    }
});
