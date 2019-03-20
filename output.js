function mv(speech) {
  theMovieDb.search.getMulti({ query: speech }, successCB, errorCB);

  function successCB(data) {
    $("#oscar").html("");
    $(".output").html("From The Movie Database");
    var obj = JSON.parse(data);
    var m;
    var movie = [];
    for (m = 0; m < obj.results.length; m++) {
      // console.log(obj.results[m]);
      movie[m] = new Oscar(obj.results[m], m);
      movie[m].show();
    }
  }
  function errorCB(data) {
    console.log("Error callback: " + data);
  }
}

class Oscar {
  constructor(data, contentId) {
    console.log(data);
    this.name = data.original_title;
    this.poster = data.poster_path;
    this.snipp = data.overview;
    this.rating = data.vote_average;
    this.poularity = data.popularity;
    this.first_air_date = data.first_air_date;
    this.contentId = contentId;
  }
  show() {
    var title = document.createElement("h4");
    title.innerHTML = this.name;
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
    container.id = "wrapper" + this.contentId;
    container.className = "wrapper text-center col-md-4";

    $("#oscar").append(container);
    $("#" + "wrapper" + this.contentId).append(title);
    $("#" + "wrapper" + this.contentId).append(pi);
    $("#" + "wrapper" + this.contentId).append(img);
    $("#" + "wrapper" + this.contentId).append(p);
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
      console.log(data.query.search);

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
  // console.log(utubeUrl);
  fetch(utubeUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson.items);
      recognition.stop();
      var str = [];
      var title = [];
      var p = [];
      var videoUrl = [];
      var container = [];
      for (m = 0; m < myJson.items.length; m++) {
        str[m] = myJson.items[m].id.videoId;
        videoUrl[m] =
          "<iframe width='420' height='315' src='https://www.youtube.com/embed/" +
          str[m] +
          "?autoplay=1&mute=1&enablejsapi=1'></iframe>";
        // $(".output").html(videoUrl);
        container[m] = document.createElement("div");
        container[m].id = "crapper" + m;
        container[m].className = "wrapper text-center col-md-4";
        title[m] = document.createElement("h4");
        title[m].innerHTML = myJson.items[m].snippet.title;
        p[m] = document.createElement("p");
        p[m].innerHTML = myJson.items[m].snippet.description;
        $("#oscar").append(container[m]);
        $("#" + "crapper" + m).append(title[m]);
        $("#" + "crapper" + m).append(p[m]);
        $("#" + "crapper" + m).append(videoUrl[m]);
      }
      // recognition.start();
    });
}

function userInfo(speech) {
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
        "http://167.99.65.107:8001/theia-ios/?content=" +
        speech +
        "&country=" +
        country +
        "&d_time=" +
        d_time +
        "&item=" +
        item +
        "&lat=" +
        lat +
        "&ln=bn&lon=" +
        lon +
        "&status=" +
        status +
        "&timezone=6&device_id=SHOHAN-PC";
      console.log(urlttsx);
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
  // console.log(myJson.text);

  switch (true) {
    case myJson.item == 0 && myJson.status == 0:
      $(".output").html(
        "I don't know the answer, please try a different question."
      );
      break;
    case myJson.item == 0 && myJson.status == 0:
      $(".output").html(
        "<iframe src=" + myJson.details + " height='200' width='300'></iframe>"
      );
      break;
    default:
      $(".output").html(myJson.text);
      break;
  }
}
