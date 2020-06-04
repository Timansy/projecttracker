$(document).ready(function() {

    const addPhaseBtn = $("#addPhaseBtn");
    const addProjectBtn = $("#addProjectBtn");

    addProjectBtn.on("click", function() {
        var projectTitle = $("#project-title").val();
        var projectNav = $("#project-nav");
        console.log(projectTitle)
        var newProjectNav = `
        <li class="nav-item">
            <a class="nav-link" href="#">${projectTitle}</a>
        </li>`;
        $("#project-title").val("");
        projectNav.append(newProjectNav);
    });

    addPhaseBtn.on("click", function() {
        var phaseTitle = $("#newPhaseTitle").val();
        var board = $(".board");
        var newPhase = `
        <div class="card col-fluid" id="phase-card" style="width: 18rem;">
            <div class="card-body">
                <h1>${phaseTitle}</h1>
            </div>
        </div>`
        $("#newPhaseTitle").val("");
        board.append(newPhase)
    })

})