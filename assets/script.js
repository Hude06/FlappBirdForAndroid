import {Rect} from "./RectUtils.js" 
let canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let score = 0;
let highScore = 0;
let mode = "menu";
let background = new Image();
let ground = new Image();
ground.src = "../assets/Ground.png"
background.src = "../assets/Background.png"
let Jump = new Audio
Jump.src = "../assets/Swoosh.wav"
class Bird {
    constructor() {
        this.started = false;
        this.bounds = new Rect(30,400, 50,50)
        this.gravity = 0.2;
        this.velocity = 0.10;
        this.alive = true;
        this.image = new Image();
        this.image.src = "../assets/Balloon.png"
    }
    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = "black"
        ctx.drawImage(this.image,this.bounds.x-18,this.bounds.y-15,this.bounds.w*1.8,this.bounds.h*1.8)
        ctx.globalAlpha = 0.5;
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.globalAlpha = 1;

    }
    update() {
        if (this.started) {
            if (this.bounds.y <= 20) {
                bird.alive = false;
            }
            if (this.bounds.y >= canvas.height) {
                bird.alive = false;
            }
            this.gravity += this.velocity;
            this.bounds.y -= this.gravity
            if (canvasClicked) {
                this.gravity -= 1
                Jump.play();
                
            } 
        }
    }
    reset() {
        this.started = false;
        this.bounds.x = 5;
        this.bounds.y = 200
        this.gravity = 0.2;
        this.velocity = 0.10;
        this.alive = true;
    }
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
let groundX = 0;
let groundY = canvas.height/1.03;
let groundX2 = canvas.width-25;
class Pipe {
    constructor(x) {
        this.x = x;
        this.Top = new Rect(x,getRndInteger(-900,-300),10,900)
        this.speed = 1;
        this.Bottom = new Rect(x,this.Top.y+this.Top.h+175,10,1000)
        this.Hole = new Rect(this.Top.x,this.Top.y+900,10,175)

    }
    draw() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.Top.x,this.Top.y,this.Top.w,this.Top.h)
        ctx.fillRect(this.Bottom.x,this.Bottom.y,this.Bottom.w,this.Bottom.h)

    }
    update() {
        if (bird.started) {
            this.speed += 0.001
            this.Hole.x -= this.speed
            this.Top.x -= this.speed;
            this.Bottom.x -= this.speed;
            if (this.Top.x <= -20) {
                this.Top.x = 600
                this.Bottom.x = 600
                this.Hole.x = 600        
            }
            if (bird.bounds.intersects(this.Top) || this.Top.intersects(bird.bounds) || this.Bottom.intersects(bird.bounds) || bird.bounds.intersects(this.Bottom)) {
                bird.alive = false;
            }
            if (bird.bounds.intersects(this.Hole) || this.Hole.intersects(bird.bounds)) {
                score += this.speed/20
            }
        }
    }
    reset() {
        score = 0;
        this.Top.x = this.x
        this.Top.y = getRndInteger(-900,-300) 
        this.Top.w = 10
        this.Top.h = 900
        this.speed = 1;
        this.Bottom.x = this.x
        this.Bottom.y = this.Top.y+this.Top.h +175
        this.Bottom.w = 10
        this.Bottom.h = 1000
        this.Hole.x = this.Top.x
        this.Hole.y = this.Top.y+900
        this.Hole.w = 10
        this.Hole.h = 175
    }
}
let pipe = new Pipe(400);
let pipe2 = new Pipe(650);
let pipe3 = new Pipe(850);
let bird = new Bird();
let pipes = [pipe,pipe2,pipe3]
let canvasClicked = false;
let zoom = 1;
let zoomIncerment = 2;
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if (mode != "menu") {
        document.getElementById("Start").style.visibility = "hidden"
        document.getElementById("Settings").style.visibility = "hidden"   
        document.getElementById("About").style.visibility = "hidden"    
        document.getElementById("title").style.visibility = "hidden"  
    }
    if (bird.alive === false) {
        mode = "dead"
    }
    if(mode === "game" || mode === "dead") {
        ctx.drawImage(background,0,0,canvas.width,canvas.height+25)
        ctx.drawImage(ground,groundX,groundY,canvas.width,canvas.height/30)
        ctx.drawImage(ground,groundX2,groundY,canvas.width,canvas.height/30)
    }
    if (mode === "about") {
        document.getElementById("Menu").style.visibility = "visible" 
        ctx.textAlign = "center"
        ctx.fillStyle = "#1c1626"
        ctx.fillRect(0,0,canvas.width,canvas.height)
        ctx.font = "30px Arial";
        ctx.fillStyle = "white"
        ctx.fillText("Coding - Jude Hill", 250, canvas.height/2-100);
        ctx.fillText("Artwork - Jude Hill", 250, canvas.height/2-50);
        ctx.fillText("Soundeffcts - SFXR", 250, canvas.height/2+0);
        ctx.fillText("Music - Online", 250, canvas.height/2+50);
    }
    if (mode === "menu") {
        ctx.fillStyle = "#1c1626"
        ctx.fillRect(0,0,canvas.width,canvas.height)
        document.getElementById("Start").style.visibility = "visible"
        document.getElementById("Settings").style.visibility = "visible"   
        document.getElementById("About").style.visibility = "visible"    
        document.getElementById("title").style.visibility = "visible" 
        document.getElementById("Menu").style.visibility = "hidden"  

    }
    if (mode === "dead") {
        if (score >= localStorage.getItem("HighScore")) {
            localStorage.setItem("HighScore", score);
        }
        if (localStorage == null) {
            localStorage.setItem("HighScore", score);
        }
        highScore = localStorage.getItem("HighScore")
        zoom += zoomIncerment;
        if (zoom >= 55) {
            zoomIncerment = 0;
        }
        zoom += zoomIncerment
        ctx.font = zoom+"px serif";
        ctx.fillStyle = "black"
        ctx.textAlign = "center";
        let vertiaclOffset = 150;
        ctx.fillText("Score", canvas.width/2-(18*zoom/2)+(zoom*9),canvas.height/2+(-7*zoom/2)+vertiaclOffset);              
        ctx.fillText(Math.floor(Math.round(score)), canvas.width/2-(18*zoom/2)+(zoom*9),canvas.height/2+(-5*zoom/2)+vertiaclOffset);    
        ctx.fillText("Best", canvas.width/2-(18*zoom/2)+(zoom*9),canvas.height/2+(-3*zoom/2)+vertiaclOffset);     
        ctx.fillText(Math.floor(Math.round(highScore)), canvas.width/2-(18*zoom/2)+(zoom*9),canvas.height/2+(-1*zoom/2)+vertiaclOffset);    
        ctx.fillText("Click To Restart", canvas.width/2-(18*zoom/2)+(zoom*8.9),canvas.height/2+(-10*zoom/2)+vertiaclOffset);     
        document.getElementById("Menu").style.visibility = "visible" 
        if (canvasClicked && buttonClicked === false) {
                mode = "game"
                bird.reset();
                for (let i = 0; i < pipes.length; i++) {
                    pipes[i].reset();
                }
            }
    }
    if (mode === "game") {
        document.getElementById("Menu").style.visibility = "hidden" 
        ctx.fillStyle = "black"
        ctx.font = "80px Arial";
        ctx.fillText(Math.floor(Math.round(score)), canvas.width/2, 100);    
        if (bird.alive && bird.started) {
            groundX -= pipe2.speed
            groundX2 -= pipe2.speed
            console.log(groundX)
            if (groundX2 <= -480) {
                groundX2 = 455
            }
            if (groundX <= -480) {
                groundX = 455
            }
        }    
        bird.draw();
        pipe.draw();
        pipe2.draw();
        pipe3.draw();
        bird.update();
        pipe.update();
        pipe2.update();
        pipe3.update();
    }
    console.log(mode)  

    requestAnimationFrame(loop)
}
let buttonClicked = false;
function init() {
    document.getElementById("Menu").addEventListener("click", function (event) {
        buttonClicked = true;
        bird.alive = true;
        mode = "menu"
        console.log(mode)
        setTimeout(() => {
            buttonClicked = false;
        }, 200);
    });
    window.addEventListener("click", function (event) {
        // console.log(event)
        canvasClicked = true;
        bird.started = true;
        setTimeout(() => {
            canvasClicked = false;

        }, 50);
          
    });
        document.getElementById("Start").addEventListener("click", function (event) {
        mode = "game"    
    });
    document.getElementById("About").addEventListener("click", function (event) {
        mode = "about"    
    });
    loop();
}
init();