// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  $("#search-button").attr("disabled", false);
}

// Search for a specified string.

// function search() {
//   var q = $("#query").val();
//   var request = gapi.client.youtube.search.list({
//     q: q,
//     part: "snippet"
//   });

//   request.execute(function(response) {
//     var str = JSON.stringify(response.result);
//     $("#search-container").html("<pre>" + str + "</pre>");
//   });
// }

// function search() {
//   console.log("Search Started");
//   var apiKey = "AIzaSyCwW7ir6ShfUu4gFOo5fZa_bCprsSwWoCY";
//   var q = $("#query").val();
//   gapi.client.setApiKey(apiKey);
//   gapi.client.load("youtube", "v3", function() {
//     isLoad = true;
//   });
//   console.log("Search Request");

//   request = gapi.client.youtube.search.list({
//     q: "q",
//     part: "id, snippet",
//     type: "video",
//     order: "date"
//   });

//   request.execute(function(response) {
//     var str = JSON.stringify(response.result);
//     $("#search-container").html("<pre>" + str + "</pre>");
//   });
// }

// GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key={YOUR_API_KEY}
function search() {
  var q = $("#query").val();
  //   part= "id, snippet",
  //   type = "video";
  var userUrl =
    "https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&q=" +
    q +
    "&key=AIzaSyCwW7ir6ShfUu4gFOo5fZa_bCprsSwWoCY";

  fetch(userUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson.items);
      var str = myJson.items[0].id.videoId;
      var url =
        "<iframe width='420' height='315' src='https://www.youtube.com/embed/" +
        str +
        "?autoplay=1'></iframe>";
      $("#search-container").html(url);
    });
}
