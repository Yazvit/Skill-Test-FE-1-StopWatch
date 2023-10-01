var timerInterval;
var startTime = 0;
var isRunning = false;
var lapCount = 0;
var pauseTime = 0 ;
var isPaused = false;
var prevLapTime = "00:00:00:00";


// formating the time if hr,min,sec,msec < 9 append 0 before the degit 
function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

// calculating the currentTime in Hours,Mins,Secs and Msecs
function updateTimer() {

    var currentTime = new Date().getTime() - startTime;
    var hours = Math.floor(currentTime / 3600000);
    var minutes = Math.floor((currentTime % 3600000) / 60000);
    var seconds = Math.floor((currentTime % 60000) / 1000);
    var milliseconds = Math.floor(currentTime % 1000 / 10);

    document.getElementById("hr").textContent = formatTime(hours);
    document.getElementById("min").textContent = formatTime(minutes);
    document.getElementById("sec").textContent = formatTime(seconds);
    document.getElementById("count").textContent = formatTime(milliseconds);
}

// call the function for upDating the Timer if startStop button was clicked
function startStopTimer() {
    var startStopButton = document.getElementById("startStop");

    if (startStopButton.innerHTML === '<i class="far fa-pause-circle"></i>') {
        // Pause the timer
        clearInterval(timerInterval);
        startStopButton.innerHTML = '<i class="far fa-play-circle"></i>';
        isPaused = true;
        pauseTime = new Date().getTime();
    } else {
        // Resume or start the timer
        if (startTime === 0) {
            // Set startTime to the current time if it's the first time starting the timer
            startTime = new Date().getTime();
        } else if (isPaused) {
            // Adjust the start time to account for the paused time
            var currentTime = new Date().getTime();
            startTime += currentTime - pauseTime;
        }

        timerInterval = setInterval(updateTimer, 10);
        startStopButton.innerHTML = '<i class="far fa-pause-circle"></i>';
        isPaused = false;
    }

    isRunning = !isRunning;
}



function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById("startStop").innerHTML = '<i class="far fa-play-circle"></i>';
    startTime = new Date().getTime() ;
    isRunning = false;
    updateTimer();
    document.getElementById("lapList").innerHTML = "";
    lapCount = 0;
    prevLapTime = "00:00:00:00";

    // Hide the lap table when resetting
    document.getElementById("record-container").style.display = "none";
}

function lapTimer() {
    if (!isRunning) return; // Only record laps when the timer is running

    var lapTime = document.getElementById("hr").textContent + ":" +
                  document.getElementById("min").textContent + ":" +
                  document.getElementById("sec").textContent + ":" +
                  document.getElementById("count").textContent;

    var lapList = document.getElementById("lapList");

    var lapItem = document.createElement("tr");

    lapCount++;

    if (lapCount % 2 !== 0) { // Only add rows for odd lap counts
        var lapNumberCell = document.createElement("td");
        lapNumberCell.textContent = lapCount;

        var lapTimeCell = document.createElement("td");
        lapTimeCell.textContent = lapTime;

        var lapDifferenceCell = document.createElement("td");
        if (lapCount > 1) {
            var lapDifference = calculateLapDifference(lapTime);
            lapDifferenceCell.textContent = lapDifference;
        } else {
            lapDifferenceCell.textContent = "N/A";
        }

        lapItem.appendChild(lapNumberCell);
        lapItem.appendChild(lapTimeCell);
        lapItem.appendChild(lapDifferenceCell);

        lapList.appendChild(lapItem);

        prevLapTime = lapTime;
    }
}


function calculateLapDifference(currentLapTime) {
    var currentMillis = lapTimeToMillis(currentLapTime);
    var prevMillis = lapTimeToMillis(prevLapTime);

    var diffMillis = currentMillis - prevMillis;

    return millisToLapTime(diffMillis);
}

function lapTimeToMillis(lapTime) {
    var lapTimeParts = lapTime.split(":");
    var hours = parseInt(lapTimeParts[0]);
    var minutes = parseInt(lapTimeParts[1]);
    var seconds = parseInt(lapTimeParts[2]);
    var milliseconds = parseInt(lapTimeParts[3]);

    var totalMillis = (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + milliseconds;

    return totalMillis;
}

function millisToLapTime(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    var minutes = Math.floor((milliseconds % 3600000) / 60000);
    var seconds = Math.floor((milliseconds % 60000) / 1000);
    var millis = milliseconds % 1000;

    return formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds) + ":" + formatTime(millis);
}

// Function to clear laps and hide the lap table
function clearLap() {
    document.getElementById("lapList").innerHTML = "";
    lapCount = 0;
    prevLapTime = "00:00:00:00";

    // Hide the lap table if clearLap button was clicked
    document.getElementById("record-container").style.display = "none";
}

// Add event listeners to the reset and clear lap buttons

document.getElementById("reset").addEventListener("click", resetTimer);
document.getElementById("clearlap").addEventListener("click", clearLap);

// Add an event listener to the lap button

document.getElementById("lap").addEventListener("click", function () {
    lapTimer();
    // Display the lap table if the lap button was clicked; otherwise, keep it hidden
    document.getElementById("record-container").style.display = "block";
});
