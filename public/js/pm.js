$(document).ready(function () {
  let addProjectBtn = $('#addProjectBtn');
  let projectTitleInput = $('#project-title');
  let projectLinkName = $('.project-link');
  let phasesDeck = $('.phases-deck');
  let phaseCard = $('.phase-card');

  // Grabbing the URL, splitting it up into an array by '/', grabbing the last item in array and setting to integer
  // Storing to memory to be used when creating a new project or accessing an already created project
  let url = window.location.href;
  //disabled this so it would be handelled below.
  // let userId = +url.split('/')[4];
  let userId;
  
  
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function (data) {
    //this is where we could handle routing based upon auth_level
    $(".member-name").text(data.username);
    $(".member-id").text(data.id);
    $(".member-auth_level").text(`project_manager`);
    userId=data.id;
    // window.location.replace(`/${data.auth_level}`);
  });

  $(".auth_selector").change(function () {
    var val = this.value;
    $.get("/api/user_data").then(function (data) {
      $.post(`/api/auth_level/${data.id}/${val}`);
      // $(".member-auth_level").text(val);
      window.location.replace(`/${val}`);
    });
  });


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
