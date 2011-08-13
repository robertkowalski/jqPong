/*
 *
 * Copyright 2011, R. Kowalski
 *
 *
 */

var gLoop;
var height = 500;
var width = 500;
var speed = 20;

var counter = [];
counter[0] = 0;
counter[1] = 0;

var c = document.getElementById('canvas');

canvas = c.getContext('2d');
c.width = width;
c.height = height;

//create paddels
var pads = [];
// x-pos, y-pos, width, height
pads[0] = [0, 100, 20, 150];
pads[1] = [width-20, 100, 20, 150];


var clear = function() {
    canvas.fillStyle = '#d0e7f9';
    canvas.beginPath();
    canvas.rect(0, 0, width, height);
    canvas.closePath();
    canvas.fill();
};


var DrawPads = function() {
    for(var i = 0; i < pads.length; i++) {
        canvas.fillStyle = 'rgba(255, 0, 0, 1)';
        canvas.beginPath();
        //rect(x, y, width, height)
        canvas.rect(pads[i][0], pads[i][1], pads[i][2], pads[i][3]);
        canvas.closePath();
        canvas.fill();
    }
};


var MovePads = function(deltaY, pad) {
    for (var i = 0; i < 2; i++) {
        pads[pad][1] -= deltaY;
    }
};


var Ball = {
    pos: [200, 200, 10, 10],

    dir: "right",

    pong: "up",

    speed: 2
};


var DrawCounter = function() {
    canvas.fillStyle = 'rgba(255, 0, 0, 1)';
    canvas.beginPath();
    canvas.font = "bold 30px sans-serif";

    var dim = canvas.measureText(counter[0]+":"+counter[1]);
    canvas.fillText(counter[0]+":"+counter[1],width/2-dim.width/2,35);
    canvas.closePath();
    canvas.fill();
};

var DrawBall = function() {
    canvas.fillStyle = 'rgba(255, 0, 0, 1)';
    canvas.beginPath();
    canvas.rect(Ball.pos[0], Ball.pos[1], Ball.pos[2], Ball.pos[3]);
    canvas.closePath();
    canvas.fill();
};


var Moveball = {
    move: function() {
        this.checkXY();
        if(Ball.dir == "right") {
            this.right();
        }
        if(Ball.dir == "left") {
            this.left();
        }
    },
    right: function() {
        Ball.pos[0] = Ball.pos[0] + Ball.speed;

        if(Ball.pong == "up") {
            Ball.pos[1] = Ball.pos[1]-Math.cos(180);
        } else {
            Ball.pos[1] = Ball.pos[1]+Math.cos(180);
        }
    },
    left: function() {
        Ball.pos[0] = Ball.pos[0] - Ball.speed;

        if(Ball.pong == "up") {
            Ball.pos[1] = Ball.pos[1]-Math.cos(180);
        } else {
            Ball.pos[1] = Ball.pos[1]+Math.cos(180);
        }
    },
    checkXY: function() {

        var halfPad = [];
        var absHalfPad = [];

        halfPad[0] = pads[0][3]/2;
        absHalfPad[0] = pads[0][1] + halfPad[0];

        halfPad[1] = pads[1][3]/2;
        absHalfPad[1] = pads[1][1] + halfPad[1];

        //ball hits paddels
        if((Ball.pos[0] === (0+pads[0][2])) && (Ball.pos[1]>pads[0][1] && Ball.pos[1]<(pads[0][1]+pads[0][3]))    ) {
            Ball.dir = "right";
            if(Ball.pos[1] >= absHalfPad[0]) {
                Ball.pong = "down";
            }
            if(Ball.pos[1] < absHalfPad[0]) {
                Ball.pong = "up";
            }
            if(speed > 5){
                speed = speed-1;
            }
        }
        if ((Ball.pos[0] === (width-Ball.pos[2]-pads[1][2])) && (Ball.pos[1]>pads[1][1] && Ball.pos[1]<(pads[1][1]+pads[1][3]))  ) {
            Ball.dir = "left";
            if(Ball.pos[1] >= absHalfPad[1]) {
                Ball.pong = "down";
            }
            if(Ball.pos[1] < absHalfPad[1]) {
                Ball.pong = "up";
            }
            if(speed > 5){
                speed = speed-1;
            }
        }


        //upper wall & downer wall collision
        if(Ball.pos[1] <= (0+Ball.pos[3])) {
            Ball.pong = "up";
        }
        if(Ball.pos[1] >= (height - Ball.pos[3])) {
            Ball.pong = "down";
        }

        //game over
        if(Ball.pos[0] < 0 || Ball.pos[0] > width) {

            if(Ball.pos[0] > width) {
                counter[1]++;
            } else if(Ball.pos[0] < 0){
                counter[0]++;
            }

            var clT = clearTimeout(gLoop);
            //alert("Hit Enter to restart");
            ResetGame();
        }

    }
};


var GameLoop = function() {
    clear();
    DrawPads();
    Moveball.move();
    DrawBall();

    DrawCounter();
    gLoop = setTimeout(GameLoop, speed);
};

var ResetGame = function() {
    pads[0] = [0, 100, 20, 150];
    pads[1] = [width-20, 100, 20, 150];

    if(Ball.dir == "right") {
        var newDir = "left";
    }else {
        var newDir = "right";
    }

    if(Ball.pong == "up") {
        var newPong = "down";
    } else {
        var newPong = "up";
    }

    Ball = {
        pos: [200, 200, 10, 10],
        dir: newDir,
        pong: newPong,
        speed: 2
    };
    speed = 20;

};


function keyDown(e) {
    var evt=(e)?e:(window.event)?window.event:null;
    if(evt) {
        var key=(evt.charCode)?evt.charCode:
        ((evt.keyCode)?evt.keyCode:((evt.which)?evt.which:0));
        //left pad
        //w & s

        //@todo switchcase
        if(key=="83") {
            if(pads[0][1] < (height-pads[1][3])) {
                MovePads(-5, 0);
            }
        }
        if(key=="87") {
            if(pads[0][1] > 0) {
                MovePads(5, 0);
            }
        }
        //right pad
        if(key=="40") {
            if(pads[1][1] < (height-pads[0][3])) {
                MovePads(-5, 1);
            }
        }
        if(key=="38") {
            if(pads[1][1] > 0) {
                MovePads(5, 1);
            }
        }
    }

};



GameLoop();

document.onkeydown=keyDown;