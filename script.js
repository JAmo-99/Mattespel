// Att göra: Ta bort alla variabler som är dubbelt, ex om det står samma innan och i själva funktionen. 
function showSections(sectionId){
    document.getElementById('menu').style.display='none';

    const section = document.querySelectorAll('.section');
    section.forEach(sec => sec.style.display ='none');

    document.getElementById(sectionId).style.display='block';
}

function backToMainMenu(){
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec=> sec.style.display ='none');

    document.getElementById('menu').style.display='block';
}

function backToPlayMenu(){
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec=> sec.style.display ='none');

    document.getElementById('play').style.display='block';
}

let num1, num2;
let timeInterval;
let score = 0;
let timeLeft = 30;
let currentOperation ="";
let currentQuestionOperation="";
let highScores = loadHighScores();

function gameStart(operation){
    currentOperation = operation;
    score = 0;
    timeLeft = 30;
    document.getElementById("score").innerText = score;
    document.getElementById("timer").innerText = timeLeft;

    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById("game").style.display ="block";

    let title="";
    if(operation == "add") title = "Addition Game";
    if(operation == "sub") title = "Subtraction Game";
    if (operation == "mul") title = "Multiplication Game";
    if(operation == "div") title = "Division Game";
    if (operation =="all") title = "All operations Game";
    if(operation =="addnsub") title = "Addition & Subtration Game";
    if(operation =="mulndiv") title ="Multiplication & Division Game"    
    document.getElementById("gameTitle").innerText = title;

    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if (timeLeft <= 0){
            clearInterval(timeInterval);
            gameEnd();
        }
    }, 1000);

    solveProblem();
}

function solveProblem() {
    let op = currentOperation;
    if (currentOperation === "all") {
        const ops = ["add", "sub", "mul", "div"];
        op = ops[Math.floor(Math.random() * 4)];
    }

    if(currentOperation ==="addnsub"){
        const ops = ["add", "sub"];
        op = ops[Math.floor(Math.random() * 2)]
    }

    if(currentOperation ==="mulndiv"){
        const ops =["mul", "div"];
        op = ops[Math.floor(Math.random()*2)]
    }

    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    let problemText = "";

    switch (op) {
        case "add":
            problemText = `${num1} + ${num2} = ?`;
            break;

        case "sub":
            if (num1 < num2) [num1, num2] = [num2, num1]; 
            problemText = `${num1} - ${num2} = ?`;
            break;

        case "mul":
            problemText = `${num1} * ${num2} = ?`;
            break;

        case "div":
            num1 = Math.floor(Math.random() * 9) + 1; 
            num2 = num1 * (Math.floor(Math.random() * 9) + 1); 
            problemText = `${num2} / ${num1} = ?`;
            break;
    }

    document.getElementById("problem").innerText = problemText;
    document.getElementById("answer").value = "";

    focusAnswerInput();
    currentQuestionOperation = op;
}

function checkAnswer() {
    if (timeLeft <= 0) return;

    const userAnswer = parseInt(document.getElementById("answer").value);
    let correctAnswer;

    switch (currentQuestionOperation) {
        case "add":
            correctAnswer = num1 + num2;
            break;
        case "sub":
            correctAnswer = num1 - num2;
            break;
        case "mul":
            correctAnswer = num1 * num2;
            break;
        case "div":
            correctAnswer = num2 / num1; 
    }

    if (userAnswer === correctAnswer) {
        score++;
        document.getElementById("problem").innerText = "Correct";
    }
    else {
        document.getElementById("problem").innerText = `Wrong! Correct answer: ${correctAnswer}`;       
    }
    document.getElementById("score").innerText = score;
    document.getElementById("answer").value = ""; 

    setTimeout(() => {
        solveProblem(); 
    }, 2000);
}

function focusAnswerInput()
{
    const input = document.getElementById("answer");
    input.focus();
}

function gameEnd() 
{
    clearInterval(timeInterval);
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("finalScore").innerText = score;

}



function loadHighScores() 
{
    let stored = localStorage.getItem("highScores");
    if (!stored) return []; 

    return stored.split(";").map(entry => {
        let [name, sc] = entry.split(":");
        return { name, score: parseInt(sc) };
    });
}

function savePlayerScore() 
{
    const nameInput = document.getElementById("playerName");
    const playerName = nameInput.value.trim() || "Anonymous";

    const newPlayer = { name: playerName, score: score };

    highScores.push(newPlayer);

    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);

    const saveString = highScores.map(e => `${e.name}:${e.score}`).join(";");
    localStorage.setItem("highScores", saveString);

    nameInput.value = ""; 
    showHighScore();
}

function showHighScore() 
{
    const hscorelist = document.getElementById("highscoreList");
    hscorelist.innerHTML = "";

    highScores.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1}: ${entry.name} - ${entry.score} points`;
        hscorelist.appendChild(li);
    });

    showSections("hscore");
}


document.getElementById("answer").addEventListener("keydown", function(event){
    if (event.key== "Enter"){
        checkAnswer();
    }
  })