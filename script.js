// 以前のコードを削除し、p5.jsを使用したコードに置き換えます

let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let cycles = 4;

let timerElement = document.getElementById("timer");
let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");

let timeLeft = workDuration;
let cycleCount = 0;
let isWorking = true;
let timer;

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

function pomodoroTimer() {
    if (timeLeft === 0) {
        if (isWorking) {
            cycleCount++;
            if (cycleCount === cycles) {
                clearInterval(timer);
                timerElement.textContent = "全てのサイクルが終了しました。お疲れ様でした！";
                resetButton.disabled = false;
                return;
            }
            timeLeft = breakDuration;
        } else {
            timeLeft = workDuration;
        }
        isWorking = !isWorking;
    }

    timeLeft--;
    updateTimerDisplay();
}

startButton.addEventListener("click", function () {
    timer = setInterval(pomodoroTimer, 1000);
    startButton.disabled = true;
    resetButton.disabled = false;
});

resetButton.addEventListener("click", function () {
    clearInterval(timer);
    timeLeft = workDuration;
    cycleCount = 0;
    isWorking = true;
    updateTimerDisplay();
    startButton.disabled = false;
    resetButton.disabled = true;
});

updateTimerDisplay();

// p5.jsのコード

class Tomato {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = random(1, 3);
        this.bottom = height;
    }

    update() {
        this.y += this.speed;

        for (let t of tomatoes) {
            if (t !== this && this.collidesWith(t)) {
                this.bottom = t.y - t.size / 2 - this.size / 2;
                break;
            }
        }

        if (this.y > this.bottom) {
            this.y = this.bottom;
        }
    }
    collidesWith(other) {
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let minDistance = (this.size + other.size) / 2;
        return distance < minDistance;
    }

    draw() {
        textSize(this.size);
        text("🍅", this.x, this.y);
    }
}

let tomatoes = [];

function setup() {
    createCanvas(800, 600);
    textAlign(CENTER, CENTER);
}

function addTomato() {
    let size = random(10, 100);
    let x = random(size / 2, width - size / 2);
    let y = size / 2;
    let tomato = new Tomato(x, y, size);
    tomatoes.push(tomato);
}

function drawTomatoes() {
    background(255);

    for (let tomato of tomatoes) {
        tomato.update();
        tomato.draw();
    }
}

function draw() {
    drawTomatoes();
}

startButton.addEventListener("click", function () {
    timer = setInterval(pomodoroTimer, 1000);
    startButton.disabled = true;
    resetButton.disabled = false;

    // 🍅のアニメーションを開始
    setInterval(addTomato, 1000);
});
