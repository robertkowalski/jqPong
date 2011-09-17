/*
 * jqPong Plugin for jQuery JavaScript Library
 * http://www.github.com/robertkowalski
 *
 * Copyright (c) 2011 R. Kowalski
 * licensed under the MIT license.
 *  - http://www.opensource.org/licenses/mit-license.php
 *
 * Author: R. Kowalski
 * Version: 0.4
 * Date: 06th Sep 2011
 *
 */

(function ($){
    $.fn.jqPong = function(options) {

        var settings = {
          'height': 500,
          'width': 500
        };
        
        //@todo: allow other colors by option
        //canvas.fillStyle = 'rgba(1, 1, 1, 0)';

        return this.each(function() {
            if (options) {
                $.extend(settings, options);
            }

            $this = $(this);

            var randomId = 'canvas';
            randomId += Math.random();

            $this.html('<canvas style="border: 1px solid black;" id="'+randomId+'" width="400" height="400"> \
                            Your Browser does not support canvas. :( \
                        </canvas>');

            var gLoop,
                height = settings.height,
                width = settings.width,
                gameSpeed = 20,
                pause = false,
                counter = [0, 0];

            var c = document.getElementById(randomId);

            canvas = c.getContext('2d');
            c.width = width;
            c.height = height;

            //create paddels
            var pads = [];
            // x-pos, y-pos, width, height
            pads[0] = [0, 100, 20, 150];
            pads[1] = [width-20, 100, 20, 150];


            var clear = function() {
                canvas.clearRect(0, 0, width, height); //x,y,w,h
            };


            var movePads = function(deltaY, pad) {
                for (var i = 0; i < 2; i++) {
                    pads[pad][1] -= deltaY;
                }
            };


            var Ball = {
                pos: [200, 200, 10, 10],
                xd: "right",
                yd: "up",
                speed: 2
            };


            var draw = function() {
                
                //pads
                for(var i = 0; i < pads.length; i++) {
                    //rect(x, y, width, height)
                    canvas.fillRect(pads[i][0], pads[i][1], pads[i][2], pads[i][3]);

                }
                
                //counter
                canvas.font = "bold 30px sans-serif";
                var dim = canvas.measureText(counter[0]+":"+counter[1]);
                canvas.fillText(counter[0]+":"+counter[1],width/2-dim.width/2,35);
                
                //ball
                canvas.fillRect(Ball.pos[0], Ball.pos[1], Ball.pos[2], Ball.pos[3]);

            };


            var Moveball = {
                move: function() {
                    this.checkXY();
                    
                    if(Ball.xd == "right") {
                        this.right();
                    }
                    if(Ball.xd == "left") {
                        this.left();
                    }
                },
                right: function() {
                    Ball.pos[0] = Ball.pos[0] + Ball.speed;

                    if(Ball.yd == "up") {
                        Ball.pos[1] = Math.round(Ball.pos[1]-Math.cos(180));
                    } else {
                        Ball.pos[1] = Math.round(Ball.pos[1]+Math.cos(180));
                    }
                },
                left: function() {
                    Ball.pos[0] = Ball.pos[0] - Ball.speed;

                    if(Ball.yd == "up") {
                        Ball.pos[1] = Math.round(Ball.pos[1]-Math.cos(180));
                    } else {
                        Ball.pos[1] = Math.round(Ball.pos[1]+Math.cos(180));
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
                        Ball.xd = "right";
                        if(Ball.pos[1] >= absHalfPad[0]) {
                            Ball.yd = "down";
                        }
                        if(Ball.pos[1] < absHalfPad[0]) {
                            Ball.yd = "up";
                        }
                        if(gameSpeed > 5){
                            gameSpeed = gameSpeed-1;
                        }
                    }
                    if ((Ball.pos[0] === (width-Ball.pos[2]-pads[1][2])) && (Ball.pos[1]>pads[1][1] && Ball.pos[1]<(pads[1][1]+pads[1][3]))  ) {
                        Ball.xd = "left";
                        if(Ball.pos[1] >= absHalfPad[1]) {
                            Ball.yd = "down";
                        }
                        if(Ball.pos[1] < absHalfPad[1]) {
                            Ball.yd = "up";
                        }
                        if(gameSpeed > 5){
                            gameSpeed = gameSpeed-1;
                        }
                    }


                    //upper wall & downer wall collision
                    if(Ball.pos[1] <= (0+Ball.pos[3])) {
                        Ball.yd = "up";
                    }
                    if(Ball.pos[1] >= (height - Ball.pos[3])) {
                        Ball.yd = "down";
                    }

                    //game over
                    if(Ball.pos[0] < 0 || Ball.pos[0] > width) {

                        if(Ball.pos[0] > width) {
                            counter[1]++;
                        } else if(Ball.pos[0] < 0){
                            counter[0]++;
                        }

                        var clT = clearTimeout(gLoop);
                        ResetGame();
                    }

                }
            };


            var gameloop = function() {
                clear();

                Moveball.move();
                draw();

                gLoop = setTimeout(gameloop, gameSpeed);
            };


            var ResetGame = function() {
                pads[0] = [0, 100, 20, 150];
                pads[1] = [width-20, 100, 20, 150];

                if(Ball.xd == "right") {
                    var newXd = "left";
                }else {
                    var newXd = "right";
                }

                if(Ball.yd == "up") {
                    var newYd= "down";
                } else {
                    var newYd = "up";
                }

                Ball = {
                    pos: [200, 200, 10, 10],
                    xd: newXd,
                    yd: newYd,
                    speed: 2
                };
                gameSpeed = 20;

            };


            function keyDown(e) {
                var evt=(e)?e:(window.event)?window.event:null;
                if(evt) {
                    var key=(evt.charCode)?evt.charCode:
                    ((evt.keyCode)?evt.keyCode:((evt.which)?evt.which:0));
                    switch(key) {

                        //left player (w & s)
                        case 83:
                            if(pads[0][1] < (height-pads[1][3])) {
                                movePads(-5, 0);
                            }
                        break;
                        case 87:
                            if(pads[0][1] > 0) {
                                movePads(5, 0);
                            }
                        break;

                        //right player (cursor up & down)
                        case 40:
                            if(pads[1][1] < (height-pads[0][3])) {
                                movePads(-5, 1);
                            }
                        break;
                        case 38:
                            if(pads[1][1] > 0) {
                                movePads(5, 1);
                            }
                        break;

                        //pause (p)
                        case 80:
                            if(pause) {
                                pause = false;
                                gameloop();
                            }else {
                                var clT = clearTimeout(gLoop);
                                pause = true;
                                canvas.fillStyle = 'rgba(0, 0, 0, 1)';
                                canvas.font = "bold 30px sans-serif";
                                var dim = canvas.measureText("Pause");
                                
                                canvas.fillText("Pause", width/2-dim.width/2, height/2-30);


                            }

                        break;

                    }

                }

            };

            draw();
            gameloop();
            document.onkeydown=keyDown;
        })
    };

})(jQuery || {});

$(document).ready(function (){
    $('#test').jqPong({'height': 500, 'width': 500});
})