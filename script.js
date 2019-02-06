var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral",
  "crimson",
  "cyan",
  "fuchsia",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lime",
  "linen",
  "magenta",
  "maroon",
  "moccasin",
  "navy",
  "olive",
  "orange",
  "orchid",
  "peru",
  "pink",
  "plum",
  "purple",
  "red",
  "salmon",
  "sienna",
  "silver",
  "snow",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "white",
  "yellow"
];
var grammar =
  "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector(".input");
var bg = document.querySelector("html");
var hints = document.querySelector(".hints");
var stt = document.getElementById("start");

var synth = window.speechSynthesis;
var inputForm = document.querySelector("form");
var inputTxt = document.querySelector(".output");
var voiceSelect = document.querySelector("select");
var pitch = document.querySelector("#pitch");
var pitchValue = document.querySelector(".pitch-value");
var rate = document.querySelector("#rate");
var rateValue = document.querySelector(".rate-value");
var voices = [];
var str;
var newStr;
var newStr2;
var colorHTML = "";

colors.forEach(function(v, i, a) {
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + " </span>";
});



stt.onclick = function() {
  event.preventDefault();
  recognition.start();
  console.log("Ready to receive a command.");
};


recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var speech = event.results[last][0].transcript;
  diagnostic.textContent = "Received Audio Input : '" + speech + "'.";  
  bg.style.backgroundColor = speech;
  userInfo();

  // var urltts2 = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + speech + "&utf8=&format=json" ;

  // $.ajax({
  //   url: urltts2 ,
  //   type: "GET",
  //   crossDomain: true,
  //   // contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  //   dataType: "json",
  //   // jsonp: false,
  //   headers: {
  //     Accept: "application/json",
  //     "Access-Control-Allow-Origin": "*",
  //     "content-type": "application/json"
  //   },
  //   success: function(json) {
  //     var obj = JSON.parse(json);
  //     // $(".output").html(data.query.search[0].snippet + ",,,");
  //     // $(".output").html(data.text);
  //     console.log(obj.text);
  //     // console.log(inputTxt.textContent);

  //     // speak();

  //     // inputTxt.blur();
  //   }
  // });
};

function userInfo (){
 var userUrl="http://geoip-db.com/json/";
 // var userUrl="http://gd.geobytes.com/GetCityDetails";
 // var country = "";
 // var lat = "";
 // var lon = "";
  fetch(userUrl)
    .then(function(response) {
      return response.json();
    })
  .then(function(myJson) {
    var country = myJson.country_name;
    var lat = myJson.latitude;
    var lon = myJson.longitude;
    console.log(lat);
    var d = new Date();
    var d_time = d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate()+"/"+d.getHours()+"/"+d.getMinutes() ; 
    console.log("Confidence: " + event.results[0][0].confidence);
    var urlttsx = "http://178.128.144.197:8000/willy/?content=" + speech + "&country=bd&d_time=" + d_time + "&item=6&lat=" + lat + "&ln=en&lon=" + lon + "&status=202&timezone=6&device_id=SHOHAN-PC";
    fetch(urlttsx)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        $(".output").html(myJson.text);
        console.log(JSON.stringify(myJson.text));
      });

  });
}
recognition.onaudiostart = function() {
  diagnostic.textContent = "Ready to receive audio";  
  console.log('Audio capturing started');
}
recognition.onspeechend = function() {
  recognition.stop();
};

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise what you said .";
};

recognition.onerror = function(event) {
  diagnostic.textContent = "Error occurred in recognition: " + event.error;
};

function populateVoiceList() {
  voices = synth.getVoices().sort(function(a, b) {
    const aname = a.name.toUpperCase(),
      bname = b.name.toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });
  voiceSelect.innerHTML = "";
  for (i = 0; i < voices.length; i++) {
    var option = document.createElement("option");
    option.textContent = voices[i].name + " (" + voices[i].lang + ")";

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }
    if (voices[i].lang==='en-US') {
      option.setAttribute("selected", "");
    }

    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
  recognition.stop();
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  if (inputTxt.textContent !== "") {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.textContent);
    utterThis.onend = function(event) {
      console.log("SpeechSynthesisUtterance.onend");
      recognition.start();
    };
    utterThis.onerror = function(event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );
    for (i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  speak();

  inputTxt.blur();
};

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
};

rate.onchange = function() {
  rateValue.textContent = rate.value;
};

voiceSelect.onchange = function() {
  speak();
};

// Page visibilitychange

var hiddenProperty = 'hidden' in document ? 'hidden' :
                    'webkitHidden' in document ? 'webkitHidden' :
                    'mozHidden' in document ? 'mozHidden' :
                    null;
var visibilityStateProperty = 'visibilityState' in document ? 'visibilityState' :
                             'webkitVisibilityState' in document ? 'webkitVisibilityState' :
                             'mozVisibilityState' in document ? 'mozVisibilityState' :
                             null;

if (hiddenProperty === null || visibilityStateProperty === null) {
  document.getElementById('pv-unsupported').removeAttribute('hidden');
} else {
  var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
  function onVisibilityChange() {
     if (!document[hiddenProperty]) {
      recognition.start();
     }else{
      recognition.stop();
     }

  }
  document.addEventListener(visibilityChangeEvent, onVisibilityChange);

}
onVisibilityChange();
