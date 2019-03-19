function mv(speech) {
  theMovieDb.search.getMulti({ query: speech }, successCB, errorCB);

  function successCB(data) {
    var obj = JSON.parse(data);
    var movie = new Oscar(obj.results[0]);
    movie.show();
  }
  function errorCB(data) {
    console.log("Error callback: " + data);
  }
}

class Oscar {
  constructor(data) {
    console.log(data);
    this.poster = data.poster_path;
    this.snipp = data.overview;
    this.rating = data.vote_average;
    this.poularity = data.popularity;
    this.first_air_date = data.first_air_date;
  }
  show() {
    $(".output").html("From The Movie Database");
    var pi = document.createElement("p");
    pi.innerHTML =
      "Rating= " +
      this.rating +
      " | Popularity= " +
      this.poularity +
      " | Air-date=" +
      this.first_air_date;
    var p = document.createElement("p");
    p.innerHTML = this.snipp;
    var img = document.createElement("img");
    img.src = theMovieDb.common.images_uri + "w200/" + this.poster;

    var container = document.createElement("div");
    container.id = "wrapper";
    container.className = "text-center";

    $("#oscar").append(container);
    $("#wrapper").append(pi);
    $("#wrapper").append(p);
    $("#wrapper").append(img);
  }
}

function wk(speech) {
  $.ajax({
    url:
      "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
      speech +
      "&utf8=&format=json",
    type: "GET",
    crossDomain: true,
    dataType: "jsonp",
    headers: {
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json"
    },
    success: function(data) {
      $(".output").html(data.query.search[0].snippet + ",,,");
      console.log(inputTxt.textContent);

      speak();

      inputTxt.blur();
    }
  });
}

function youtb(speech) {
  var utubeUrl =
    "https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&q=" +
    speech +
    "&key=AIzaSyCwW7ir6ShfUu4gFOo5fZa_bCprsSwWoCY";
  console.log(utubeUrl);
  fetch(utubeUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson.items);
      recognition.stop();
      var str = myJson.items[0].id.videoId;
      var videoUrl =
        "<iframe width='420' height='315' src='https://www.youtube.com/embed/" +
        str +
        "?autoplay=1&mute=1&enablejsapi=1'></iframe>";
      $(".output").html(videoUrl);
      // recognition.start();
    });
}

function userInfo() {
  var userUrl = "http://geoip-db.com/json/";
  // var userUrl="http://gd.geobytes.com/GetCityDetails";

  fetch(userUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      country = myJson.country_code.toLowerCase();
      lat = myJson.latitude;
      lon = myJson.longitude;
      d_time =
        d.getFullYear() +
        "/" +
        d.getMonth() +
        "/" +
        d.getDate() +
        "/" +
        d.getHours() +
        "/" +
        d.getMinutes();
      var urlttsx =
        "http://178.128.144.197:8000/willy/?content=" +
        speech +
        "&country=" +
        country +
        "&d_time=" +
        d_time +
        "&item=" +
        item +
        "&lat=" +
        lat +
        "&ln=en&lon=" +
        lon +
        "&status=" +
        status +
        "&timezone=6&device_id=SHOHAN-PC";
      fetch(urlttsx)
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          handleResponse(myJson);
          speak();
          item = myJson.item;
          status = myJson.status;
          inputTxt.blur();
        });
    });
}

function handleResponse(myJson) {
  console.log(myJson.item);
  console.log(myJson.status);
  console.log(myJson.text);

  switch (myJson.item | myJson.item) {
    case 0 | 0:
      $(".output").html(
        "I don't know the answer, please try a different question."
      );
      break;
    case 5 | 0:
      $(".output").html(
        "<iframe src=" + myJson.details + " height='200' width='300'></iframe>"
      );
      break;
    default:
      $(".output").html(myJson.text);
      break;
  }
}
