'use strict';

/* -- Global variables for state -- */

// pomodoro intervals
let timer = 0;
let break_time = 0;

// Session count track
let sessionCount = 0;
let state = true;

// Current time left
let hour = 0;
let min = 0;

let resultInterval = null;
let running = false;

/* -- Global functions -- */

// Reset function
function reset() {

    hour = 0;
    min = 0;

    document.getElementById('time').innerText = "00:00";

}

function timerFunction(time) {

    min = 0;
    hour = parseInt(time);

    let result = setInterval(() => {

        if (min == -1) {
            min = 59;
            hour -= 1;
        }

        if (hour === 0 && min <= 0) {

            // Clear current state
            clearInterval(resultInterval);
            reset();
            // Update state
            state = !state;
            // Recursive call to counter setup
            counterFunction();

        }

        document.getElementById('time').innerText = `${hour}:${min}`;
        min -= 1;

    }, 1000);

    resultInterval = result;

}

function counterFunction() {

    let status;

    if (state) {
        sessionCount++;
        status = `Session Count: ${sessionCount}`;
        timerFunction(timer);
    }
    else {
        status = 'break!';
        timerFunction(break_time);
    }

    // Define session
    document.getElementById('status').innerHTML = status;

}

/* -- DONE -- */

// Reset everything
document.getElementById('reset')
    .addEventListener('click', () => {

        alert("Pomodoro clock reset!");
        window.location.reload();

    });

// Timer controls
document.getElementById('a1')
    .addEventListener('click', () => {

        if (timer <= 0) {
            alert("Timer cannot be negative!");
            return;
        }

        if(running) {
            alert("Reset the clock to update timer");
            return;
        }

        timer -= 20;
        document.getElementById('s-time').innerText = timer;

    });

document.getElementById('a2')
    .addEventListener('click', () => {

        if(running) {
            alert("Reset the clock to update timer");
            return;
        }

        timer += 20;
        document.getElementById('s-time').innerText = timer;

    });

document.getElementById('b1')
    .addEventListener('click', () => {

        if (break_time <= 0) {
            alert("Break time cannot be negative!");
            return;
        }

        if(running) {
            alert("Reset the clock to update timer");
            return;
        }

        break_time -= 5;
        document.getElementById('b-time').innerText = break_time;

    });

document.getElementById('b2')
    .addEventListener('click', () => {

        if(running) {
            alert("Reset the clock to update timer");
            return;
        }

        break_time += 5;
        document.getElementById('b-time').innerText = break_time;

    });

// Start timer
document.getElementById('start')
    .addEventListener('click', () => {

        // Validation checks
        if (timer <= 0) {
            alert("Please set your work timer");
            return;
        }

        if (break_time <= 0) {
            alert("Please set your break timer");
            return;
        }

        // Counter function
        running = true;
        counterFunction();

    });
    