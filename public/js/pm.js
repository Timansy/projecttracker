$(document).ready(function() {
    let addProjectBtn = $('#addProjectBtn');
    let projectTitleInput = $('#project-title');
    let projectLinkName = $('.project-link');
    let phasesDeck = $('.phases-deck');
    let phaseCard = $('.phase-card');
    let projectContainer = $("#project-nav")

    let addPhaseBtn = $("#addPhaseBtn");
    let phaseSubmit = $("#phaseSubmit");
    let phaseTitleInput = $("#phase-title");
    let phaseProjectId = $("#projectId")

    let addTaskBtn = $("#addTaskBtn");
    let taskSubmit = $("#taskSubmit");
    let taskTitleInput = $("#task-title");
    let taskPhaseId = $("#phaseId");
    let taskAssigneeId = $("#assigneeId");

    // Grabbing the URL, splitting it up into an array by '/', grabbing the last item in array and setting to integer
    // Storing to memory to be used when creating a new project or accessing an already created project
    let url = window.location.href;
    //disabled this so it would be handelled below.
    // let userId = +url.split('/')[4];
    var userId;


    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function(data) {
        //this is where we could handle routing based upon auth_level
        $(".member-name").text(data.username);
        $(".member-id").text(data.id);
        $(".member-auth_level").text(`project_manager`);
        userId = data.id;
        // window.location.replace(`/${data.auth_level}`);
    });

    $(".auth_selector").change(function() {
        var val = this.value;
        $.get("/api/user_data").then(function(data) {
            $.post(`/api/auth_level/${data.id}/${val}`);
            // $(".member-auth_level").text(val);
            window.location.replace(`/${val}`);
        });
    });


    //--------------------------------------------------------------------------------------//
    // PHASE SUBMISSION //

    // START THE SAVE FUNCTIONS FOR PHASE SUBMISSION
    $(phaseSubmit).on('click', handleNewPhase);

    // MAKES A NEW PHASE OBJECT TO BE PUT INTO THE DB
    function handleNewPhase(event) {
        event.preventDefault();
        let newPhase = phaseTitleInput.val().trim();
        if (!newPhase) {
            return;
        } else
            createPhase({
                title: newPhase,
                phaseComplete: false,
                ProjectId: $("#projectId").val()
            });
        phaseTitleInput.val("")
    }

    // POSTS THE NEW PHASE OBJECT IN THE DB
    function createPhase(phaseData) {
        console.log(phaseData);
        $.post('/api/project-phase', phaseData).then(
            getProjectPhases
        );
    };

    // THE FUNCTIONS BELOW RENDER THE PROJECT LIST IN THE PHASE CARD SO A PROJECT ID CAN BE OBTAINED AND ADDED TO THE PHASE TO BE ADDED

    let projectId;

    getProjects();

    function getProjects() {
        $.get("/api/projects", renderProjectList)
    }

    function renderProjectList(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createProjectRow(data[i]));
        }
        phaseProjectId.empty();
        console.log(rowsToAdd);
        console.log(phaseProjectId);
        phaseProjectId.append(rowsToAdd);
        phaseProjectId.val(projectId);
    }

    function createProjectRow(project) {
        var listOption = $("<option>");
        listOption.attr("value", project.id);
        listOption.text(project.title);
        return listOption;
    }

    // --------------------------------------------------------------------------------//
    // TASK SUBMISSION //


    // STARTS THE SAVE FUNCTION FOR TASKS SUBMISSION
    $(taskSubmit).on('click', handleNewTask);

    //CREATES A NEW TASK OBJECT TO BE PUT IN THE DB
    function handleNewTask(event) {
        event.preventDefault();
        let newTask = taskTitleInput.val().trim();
        if (!newTask) {
            return;
        } else
            createTask({
                taskname: newTask,
                isComplete: false,
                ProjectPhaseId: $("#phaseId").val(),
                UserId: $("#assigneeId").val()
            });
        taskTitleInput.val("")
    }

    //POST THE NEW TASK ITEM IN THE DB
    function createTask(taskData) {
        console.log(taskData);
        $.post('/api/tasks', taskData).then(
            getPhaseTasks
        );
    };

    // GETS PHASES TO POPULATE THE PHASE LIST FOR PHASE ID IN TASK OBJECT
    let phaseId;

    getPhases();

    function getPhases() {
        $.get("/api/project-phase", renderPhaseList)
    }

    function renderPhaseList(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createPhaseRow(data[i]));
        }
        taskPhaseId.empty();
        console.log(rowsToAdd);
        console.log(taskPhaseId);
        taskPhaseId.append(rowsToAdd);
        taskPhaseId.val(phaseId);
    }

    function createPhaseRow(phase) {
        var listOption = $("<option>");
        listOption.attr("value", phase.id);
        listOption.text(phase.title);
        return listOption;
    }


    // GETS THE USERS TO POPULATE THE ASSIGNEE LIST FOR THE TASK OBJECT
    let assigneeId;

    getAssignees();

    function getAssignees() {
        $.get("/api/users", renderAssigneeList)
    }

    function renderAssigneeList(data) {
        var rowsToAdd = [];
        for (var i = 0; i < data.length; i++) {
            rowsToAdd.push(createAssigneeRow(data[i]));
        }
        taskAssigneeId.empty();
        console.log(rowsToAdd);
        console.log(taskAssigneeId);
        taskAssigneeId.append(rowsToAdd);
        taskAssigneeId.val(assigneeId);
    }

    // Creates the author options in the dropdown
    function createAssigneeRow(assignee) {
        var listOption = $("<option>");
        listOption.attr("value", assignee.id);
        listOption.text(assignee.username);
        return listOption;
    }

    // ----------------------------------------------------------------------------//
    // PROJECT NAV BAR POPULATION //
    getNavBarProjects()

    function getNavBarProjects() {
        $.get("/api/projects", function(data) {
            initializeProjectNav(data)
        });
    };


    function initializeProjectNav(projects) {
        projectContainer.empty();
        var projectsToAdd = [];
        for (let i = 0; i < projects.length; i++) {
            projectsToAdd.push(createNewProject(projects[i]));
        }
        projectContainer.append(projectsToAdd)
    }

    function createNewProject(projects) {
        var newProject = `
                 <li class="nav-item">
                     <a class="nav-link" value="${projects.id}" href="#">${projects.title}</a>
                </li>`;

        return newProject
    }

    // --------------------------------------------------------------------------------------------//
    // PHASES POPULATION FOR PROJECT BOARD //

    getProjectPhases()

    function getProjectPhases() {
        $.get("/api/project-phase", function(data) {
            initializeProjectPhases(data)
        });
    };

    function initializeProjectPhases(phases) {
        phasesDeck.empty();
        var phasesToAdd = [];
        for (let i = 0; i < phases.length; i++) {
            phasesToAdd.push(createNewPhase(phases[i]));
        }
        phasesDeck.append(phasesToAdd)
    }

    function createNewPhase(phases) {
        var newPhase = `
        <div class="phase-card card col-fluid" id="phase-card" style="width: 18rem;">
        <div class="card-body">
            <h3>${phases.title}</h3>
        </div>
        <div class="card-body" value="${phases.id}" id="task-container">
        </div>
        </div>`;

        return newPhase
    }

    // ------------------------------------------------------------------------------------------//
    // TASK POPULATION FOR PHASES //

    getPhaseTasks()

    function getPhaseTasks() {
        $.get("/api/tasks", function(tasks) {
            $.get("/api/project-phase", function(phases) {
                initializePhaseTasks(tasks, phases)
            })
        })
    }

    function initializePhaseTasks(tasks, phases) {
        var taskContainers = document.querySelectorAll("#task-container");

        var phasesToAdd = []
        for (let i = 0; i < tasks.length; i++) {
            if (tasks.ProjectPhaseId == phases.id) {
                phasesToAdd.push(createNewTask(tasks[i]))
            }
        }
        console.log(phasesToAdd)

    }

    function createNewTask(tasks) {
        var newTask = `
        <div class="card task-card" value="${tasks.ProjectPhaseId} style="width:auto">
        <div class="card-body">
            <h5>${tasks.taskname}</h5>
        </div>
    </div>`;
        // <ul>
        //     <li>Andrew Reeves</li>
        //     <li>Working</li>
        // </ul>

        return newTask
    }

    // ----------------------------------------------------------------------------//
    // ADDITIONAL FUNCTIONALITY //
    $(addProjectBtn).on("click", function() {
        $("#projectCollapse.collapse").toggleClass("show")
    })

    $(addPhaseBtn).on("click", function() {
        getProjects();
        $("#phaseCollapse.collapse").toggleClass("show")
    })

    $(addTaskBtn).on("click", function() {
        getPhases();
        getAssignees();
        $("#taskCollapse.collapse").toggleClass("show")
    })


});