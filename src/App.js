import React, { useState } from 'react'
import './App.css'

import styled from "styled-components"
import Clarifai from "clarifai"
// import axios from "axios"

import Background from "./background.png"
import Placeholder from "./placeholder.jpg"

const WtfWrapper = styled.div`
  background-color: #f9dfe0;
  background-image: url(${Background});
  background-repeat: repeat;
  color: #3d8b7d;
  min-height: 100vh;
  padding: 1.5em;
  text-align: center;
  h1 {
    font-family: 'Ubuntu Condensed', sans-serif;
    font-size: 2.2em;
    padding: 0.4em 0;
  }
  h3 {
    font-size: 1.7em;
    text-transform: capitalize;
    font-family: 'Ubuntu Condensed', sans-serif;
  }
  img {
    height: 14em;
  }
  .loading {
    height: 10em;
  }
  form {
    padding: 1.5em 0;
    width: 8em;
    display: inline-table;
  }
  #foodPic {
    height: 14em;
    background-image: url(${Placeholder});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  button {
    padding: 1.2em 1em;
    margin-top: 1em;
    background-color: #8fbc91;
    border: #8fbc91;
    width: 18em;
    border-radius: 3px;
  }
  input {
    width: 12.9em;
  }
  .btn {
    background-color: #8fbc91;
    border: #8fbc91;
    color: #3d8b7d; 
    padding: 0.7em 1em;
    border-radius: 3px;
  }
  #foodInfo {
    .loader {
      height: 8em;
    }
  }
`

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  // const [nutriImage, setNutriImage] = useState(null)

  var myClarifaiApiKey = '62569dcb57b347df8031ed6a0a50bdee';
  var myWolframAppId = 'RWU4HE-Q9UPPVXHQU';

  var app = new Clarifai.App({apiKey: myClarifaiApiKey});

  const fileSelected = e => {
    console.log(URL.createObjectURL(e.target.files[0]))
    setSelectedFile(URL.createObjectURL(e.target.files[0]))
  }

  const loadFood = (value, source) => {
    var preview = document.getElementById('foodPic');
    var file    = document.querySelector("input[type=file]").files[0];
    var loader  = "https://media.giphy.com/media/5UG0A0ZV8APqnWYU0t/giphy.gif";
    var reader  = new FileReader();

    // load image
    reader.addEventListener("load", (e) => { 
      preview.style.backgroundImage = "url(" + selectedFile + ")"
      analyseFood({ 
        base64: reader.result.split("base64,")[1] 
      });
    }, false);

    if (file) {
      reader.readAsDataURL(file);
      document.getElementById('foodInfo').innerHTML = '<img src="' + loader + '" className="loading" />';
    } else { 
      alert("No file selcted!"); 
    }
  }

  // get food name from Clarifai
  const analyseFood = (value, result) => {
    app.models.predict(Clarifai.FOOD_MODEL, value).then(function(response) {
        if(response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
          var tag = response.rawData.outputs[0].data.concepts[0].name;
          // link to Wolfram
          var url = 'http://api.wolframalpha.com/v2/query?input='+tag+'%20nutrition%20facts&appid='+myWolframAppId;

          // document.getElementById('foodInfo').innerHTML = '<h3>'+ tag + '</h3>';

          // post nutritional info
          const getNutritionalInfo = (url, result => {
            document.getElementById('foodInfo').innerHTML = '<h3>'+ tag + '</h3> <img src=' + result + '>';
          });
          getNutritionalInfo()
        }
      }, function(err) { console.log(err); }
    );
  }

  return (
    <WtfWrapper>
      <h1>What The Fork?</h1>

      <div id="foodPic">
      </div>

      <form action="#">
          <div className="btn btn-mdb-color btn-rounded float-left">
            <input type="file" id="filename" placeholder="Filename" size="100" onChange={fileSelected}/>
          </div>
        <button onClick={() => loadFood(document.getElementById('filename').value, 'file')}>What's on my Fork?</button>
      </form>

      <div id="foodInfo">
        <h3>Your Food :</h3>
      </div>
    </WtfWrapper>
  )
}

export default App
