// 各要素を取得
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let cycles = 4;

let timerElement = document.getElementById("timer");
let startStopButton = document.getElementById("startStop");
let resetButton = document.getElementById("reset");
let workDurationInput = document.getElementById("workDuration");
let breakDurationInput = document.getElementById("breakDuration");
let statusElement = document.getElementById("status");
let cycleCountElement = document.getElementById("cycleCount");

let timeLeft = workDuration;
let cycleCount = 0;
let isWorking = true;
let isRunning = false;
let timer;

// 時間の表示を更新
function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// ステータスの表示を更新
function updateStatusDisplay() {
    statusElement.textContent = isWorking ? "作業中: " : "休憩中: ";
}

// サイクル数の表示を更新
function updateCycleCountDisplay() {
    cycleCountElement.textContent = `サイクル: ${cycleCount}/${cycles}`;
}

// ポモドーロタイマーのメイン関数
function pomodoroTimer() {
    // 時間が0になったら
    if (timeLeft === 0) {
        // 作業中なら休憩に、休憩中なら作業に切り替える
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
        updateStatusDisplay();
    }

    timeLeft--;
    updateTimerDisplay();
    updateCycleCountDisplay();
}

// 開始・停止ボタンのイベントリスナー
startStopButton.addEventListener("click", function () {
    if (!isRunning) {
        workDuration = workDurationInput.value * 60 || workDuration;
        breakDuration = breakDurationInput.value * 60 || breakDuration;
        timer = setInterval(pomodoroTimer, 1000);
        this.textContent = "ストップ";
        resetButton.disabled = false;
        isRunning = true;
    } else {
        clearInterval(timer);
        this.textContent = "開始";
        isRunning = false;
    }
});

// リセットボタンのイベントリスナー
resetButton.addEventListener("click", function () {
    clearInterval(timer);
    startStopButton.textContent = "開始";
    timeLeft = workDuration;
    cycleCount = 0;
    isWorking = true;
    isRunning = false;
    updateTimerDisplay();
    updateStatusDisplay();
    updateCycleCountDisplay();
    startStopButton.disabled = false;
    resetButton.disabled = true;
    // ここで🍅を全て削除するコードを追加
    tomatoes = [];
});

updateTimerDisplay();
updateStatusDisplay();
updateCycleCountDisplay();

// 以下をscript.jsの最後に追加

let tomatoes = [];
let canvas;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight - 100);
    canvas.parent("sketch-holder");
}

function draw() {
    background(255);

    if (frameCount % 60 === 0) {
        const size = random(10, 100);
        tomatoes.push(new Tomato(size));
    }

    for (let i = tomatoes.length - 1; i >= 0; i--) {
        tomatoes[i].display();
        tomatoes[i].update();
        tomatoes[i].checkCollision(tomatoes);

        if (tomatoes[i].isOutOfBounds()) {
            tomatoes.splice(i, 1);
        }
    }
}

class Tomato {
    constructor(size) {
        this.position = createVector(random(width), -size);
        this.size = size;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0.5);
    }

    display() {
        textAlign(CENTER, CENTER);
        textSize(this.size);
        textFont("Material Icons");
        text("🍅", this.position.x, this.position.y);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    }

    checkCollision(tomatoes) {
        for (let other of tomatoes) {
            if (other === this) continue;

            let distance = this.position.dist(other.position);
            let minDistance = (this.size + other.size) / 2;

            if (distance < minDistance) {
                this.velocity.y = 0;
                this.acceleration.y = 0;
            }
        }

        // canvasの下辺で停止するように修正
        if (this.position.y + this.size / 2 > height) {
            this.velocity.y = 0;
            this.acceleration.y = 0;
            this.position.y = height - this.size / 2;
        }
    }

    isOutOfBounds() {
        return this.position.y > height;
    }
}

