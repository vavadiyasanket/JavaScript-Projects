var wake_up_time = 7;
var noon = 12;
var lunch_time = 12;
var nap_time;
var party_time;
var evening = 18;

// Getting it to show the current time on the page
var showCurrentTime = function () {
  // display the string on the webpage
  var clock = document.getElementById("clock");

  var currentTime = new Date();

  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();
  var meridian = "AM";

  // Set hours
  if (hours >= noon) {
    meridian = "PM";
  }

  if (hours > noon) {
    hours = hours - 12;
  }

  // Set Minutes
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  // Set Seconds
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // put together the string that displays the time
  var clockTime = hours + ":" + minutes + ":" + seconds + " " + meridian;

  clock.innerText = clockTime;
};

// Getting the clock to increment on its own and change out messages and pictures
var updateClock = function () {
  var time = new Date().getHours();
  var message_text;
  var image =
    "https://s3.amazonaws.com/media.skillcrush.com/skillcrush/wp-content/uploads/2016/08/normalTime.jpg";

  var time_event = document.getElementById("time_event");
  var lol_cat_image = document.getElementById("lol_cat_image");

  if (time == party_time) {
    image =
      "https://s3.amazonaws.com/media.skillcrush.com/skillcrush/wp-content/uploads/2016/08/partyTime.jpg";
    message_text = "Let's party!";
  } else if (time == wake_up_time) {
    image =
      "https://s3.amazonaws.com/media.skillcrush.com/skillcrush/wp-content/uploads/2016/09/cat1.jpg";
    message_text = "Wake up!";
  } else if (time == lunch_time) {
    image =
      "https://s3.amazonaws.com/media.skillcrush.com/skillcrush/wp-content/uploads/2016/09/cat2.jpg";
    message_text = "Let's have some lunch!";
  } else if (time == nap_time) {
    image =
      "https://s3.amazonaws.com/media.skillcrush.com/skillcrush/wp-content/uploads/2016/09/cat3.jpg";
    message_text = "Sleep tight!";
  } else if (time < noon) {
    image =
      "https://pbs.twimg.com/profile_images/378800000532546226/dbe5f0727b69487016ffd67a6689e75a.jpeg";
    message_text = "Good morning!";
  } else if (time >= evening) {
    image = "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cat_sleep.jpg";
    message_text = "Good evening!";
  } else {
    image =
      "https://s3.amazonaws.com/media.skillcrush.com/skillcrush/wp-content/uploads/2016/08/normalTime.jpg";
    message_text = "Good afternoon!";
  }
  time_event.innerText = message_text;
  lol_cat_image.src = image;

  showCurrentTime();
};
updateClock();

// Getting the clock to increment once a second
setInterval(updateClock, 1000);

// Getting the Party Time Button To Work
var partyButton = document.getElementById("party_time_button");

var partyEvent = function () {
  if (party_time < 0) {
    party_time = new Date().getHours();
    party_time_button.innerText = "Party Over!";
    party_time_button.style.backgroundColor = "#0A8DAB";
  } else {
    party_time = -1;
    party_time_button.innerText = "Party Time!";
    party_time_button.style.backgroundColor = "#222";
  }
};

partyButton.addEventListener("click", partyEvent);
partyEvent();

// Activates Wake-Up selector
var wake_up_time_selector = document.getElementById("wake_up_time_selector");

var wakeUpEvent = function () {
  wake_up_time = wake_up_time_selector.value;
};

wake_up_time_selector.addEventListener("change", wakeUpEvent);

// Activates Lunch selector
var lunch_time_selector = document.getElementById("lunch_time_selector");

var lunchEvent = function () {
  lunch_time = lunch_time_selector.value;
};

lunch_time_selector.addEventListener("change", lunchEvent);

// Activates Nap-Time selector
var nap_time_selector = document.getElementById("nap_time_selector");

var napEvent = function () {
  nap_time = nap_time_selector.value;
};

nap_time_selector.addEventListener("change", napEvent);
