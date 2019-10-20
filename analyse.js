var myClarifaiApiKey = '62569dcb57b347df8031ed6a0a50bdee';
var myWolframAppId = 'RWU4HE-Q9UPPVXHQU';

var app = new Clarifai.App({apiKey: myClarifaiApiKey});

function loadFood(value, source) {
  var preview = $(".food-photo");
  var file    = document.querySelector("input[type=file]").files[0];
  var loader  = "https://media.giphy.com/media/5UG0A0ZV8APqnWYU0t/giphy.gif";
  var reader  = new FileReader();

  // load image
  reader.addEventListener("load", function () {
    preview.css('background-image','url(' + reader.result + ')');
    analyseFood({ 
      base64: reader.result.split("base64,")[1] 
    });
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    $('#concepts').html('<img src="' + loader + '" class="loading" />');
  } else { 
    alert("No file selcted!"); 
  }
}

// get food name from Clarifai
function analyseFood(value) {
  app.models.predict(Clarifai.FOOD_MODEL, value).then(function(response) {
      if(response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
        var tag = response.rawData.outputs[0].data.concepts[0].name;
        $('#concepts').html('<h3>'+ tag + '</h3>');
      }
    }, function(err) { console.log(err); }
  );
}