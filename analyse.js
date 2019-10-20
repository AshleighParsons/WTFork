function loadFood(value, source) {
  var preview = $(".food-photo");
  var file    = document.querySelector("input[type=file]").files[0];
  var loader  = "https://media.giphy.com/media/5UG0A0ZV8APqnWYU0t/giphy.gif";
  var reader  = new FileReader();

  // load image
  reader.addEventListener("load", function () {
    preview.css('background-image','url(' + reader.result + ')');
    doPredict({ base64: reader.result.split("base64,")[1] });
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    $('#concepts').html('<img src="' + loader + '" class="loading" />');
  } else { alert("No file selcted!"); }
}