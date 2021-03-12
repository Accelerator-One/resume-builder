"use strict";

// State variables
let curr  = 0;
let selected = -1;
let score = 0;

// Your questions here
let questions = [
    'Question 1',
    'Question 2',
    'Question 3',
    'Question 4',
    'Question 5',
    'Question 6',
    'Question 7',
    'Question 8',
    'Question 9',
    'Question 10'
];

// Your options here
let options = [
    ['option1 1', 'option1 2', 'option1 3', 'option4 1'],
    ['option2 1', 'option2 2', 'option2 3', 'option4 2'],
    ['option3 1', 'option3 2', 'option3 3', 'option4 3'],
    ['option4 1', 'option4 2', 'option4 3', 'option4 4'],
    ['option5 1', 'option5 2', 'option5 3', 'option4 5'],
    ['option6 1', 'option6 2', 'option6 3', 'option4 6'],
    ['option7 1', 'option7 2', 'option7 3', 'option4 7'],
    ['option8 1', 'option8 2', 'option8 3', 'option4 8'],
    ['option9 1', 'option9 2', 'option9 3', 'option4 9'],
    ['option10 1', 'option10 2', 'option10 3', 'option4 10']
]

// Your answers here
let answers = [1, 2, 3, 4, 1, 1, 2, 3, 4, 1]

// Renders current quesiton
function renderQuestion(id) {

    document.getElementById('qid').innerText = id+1+'.';
    document.getElementById('ques').innerText = questions[id];
 
    document.getElementById('text1').innerText = options[id][0];
    document.getElementById('text2').innerText = options[id][1];
    document.getElementById('text3').innerText = options[id][2];
    document.getElementById('text4').innerText = options[id][3];

}

// Start rendering quiz
document.addEventListener('DOMContentLoaded',(evt) => {
   
   selected = -1;
   renderQuestion(curr);
   curr++;

    // Update question
    document.getElementById('submit').addEventListener('click',(evt) => {

        if(selected == -1) {
            alert('Please select an option!');
            return;
        }

        // Right answer
        if(selected == answers[curr-1]) {
            score++;
            document.getElementById('score').innerText = score;
            alert('Correct!');
        }
        else
            // Wrong Answer
            alert('Incorrect!');

        // Display final results
        if(curr > 9) {

            let index = 0;
            let answer_list = "Answers: <br/>";
            answers.forEach(data => {
                answer_list += (questions[index] + " => " + options[index++][data-1]+"<br/>");
            });

            // Give an option for reload
            document.getElementById('content').innerHTML = answer_list + "<br/><button onclick=window.location.reload()>Reload</button>";
            return;
        }

        document.getElementById('score').click;
        renderQuestion(curr);
        curr++;

    });

    // Restart quiz
    document.getElementById('restart').addEventListener('click',(evt) => {
        evt.preventDefault();
        window.location.reload();
    });

});
