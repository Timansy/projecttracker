$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function (data) {
    //this is where we could handle routing based upon auth_level
    $(".member-name").text(data.username);
    $(".member-id").text(data.id);
    $(".member-auth_level").text(`administrator`);
    // window.location.replace(`/${data.auth_level}`);
  });

  $(".auth_selector").change(function () {
    var val = this.value;
    $.get("/api/user_data").then(function (data) {
      $.post(`/api/auth_level/${data.id}/${val}`);
      $(".member-auth_level").text(val);
      window.location.replace(`/${val}`);
    });
  });
});
