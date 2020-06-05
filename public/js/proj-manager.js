$(document).ready(() => {
    let addProjectBtn = $('#addProjectBtn');
    let projectTitleInput = $('#project-title');
    let projectLinkName = $('.project-link');
    let phasesDeck = $('.phases-deck');
    let phaseCard = $('.phase-card');

    // Grabbing the URL, splitting it up into an array by '/', grabbing the last item in array and setting to integer
    // Storing to memory to be used when creating a new project or accessing an already created project
    let url = window.location.href;
    let userId = +url.split('/')[4];
    // console.log(userId, typeof userId);

    $(addProjectBtn).on('click', handleNewProject);

    function handleNewProject(event) {
        event.preventDefault();
        let newProject = projectTitleInput.val().trim();
        // console.log(newProject);

        if (!newProject) {
            return;
        } else
            createProject({
                title: newProject,
                complete: false,
                UserId: userId
            });
    }

    function createProject(projectData) {
        console.log(projectData);
        $.post('/api/projects', projectData).then(
            console.log('New Project Created!')
        );
    }
});
