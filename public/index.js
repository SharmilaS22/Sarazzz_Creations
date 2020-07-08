$(document).ready(function() {
  let i_count = 0;
  let a_count = 0;
  let v_count = 0;
  $(".image-count").val(i_count + 1);
  $(".about-count").val(a_count + 1);
  $(".video-count").val(v_count + 1);
  $("#addImage").on("click", function() {
    i_count = i_count + 1;
    $("#image-container").append(`<input
              type="text"
              name="prodImage"
              class="my-1 form-control image-class"
            />`);
    $(".image-count").val(i_count + 1);
  });
  $("#removeImage").on("click", function() {
    $(".image-class")[i_count].remove();
    i_count = i_count - 1;
    $(".image-count").val(i_count + 1);
  });


   $("#addVideo").on("click", function () {
     i_count = i_count + 1;
     $("#video-container").append(`<input
              type="text"
              name="prodVideo"
              class="my-1 form-control video-class"
            />`);
     $(".video-count").val(i_count + 1);
   });
   $("#removeVideo").on("click", function () {
     $(".video-class")[i_count].remove();
     i_count = i_count - 1;
     $(".video-count").val(i_count + 1);
   });
  
  
  $("#addAbout").on("click", function() {
    a_count = a_count + 1;
    $("#about-container").append(`<input
              type="text"
              name="prodAbout"
              class="my-1 form-control about-class" 
            />`);
    $(".about-count").val(a_count + 1);
  });
  $("#removeAbout").on("click", function() {
    $(".about-class")[a_count].remove();
    a_count = a_count - 1;
    $(".about-count").val(a_count + 1);
  });
});
