/*
 * jqPong Plugin for jQuery JavaScript Library
 * http://www.github.com/robertkowalski
 *
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *
 * Version 2, December 2004
 *
 * Copyright (C) 2011 Robert Kowalski
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 *
 * 
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details.
 * 
 * 
 * Author: R. Kowalski
 * Version: 0.5.2
 * Date: 15th Oct 2011
 *
 */

(function ($){
    $.fn.jqPong = function(options) {

        var settings = {
          'height': 500,
          'width': 500,
          'color': 'rgba(0, 0, 0, 1)'
        };
                

        return this.each(function() {
            if (options) {
                $.extend(settings, options);
            }

            $this = $(this);

            var randomId = 'canvas';
            randomId += Math.random();

            $this.html('<canvas style="-webkit-transform: translateZ(0);border: 1px solid black;" id="'+randomId+'" width="400" height="400"> \
                            Your Browser does not support canvas. :( \
                        </canvas>');

            var gLoop,
                height = settings.height,
                width = settings.width,
                gameSpeed = 20,
                pause = false,
                counter = [0, 0],
                color = settings.color;

            var c = document.getElementById(randomId);

            c.width = width;
            c.height = height;

            canvas = c.getContext('2d');      
            canvas.fillStyle = color;

            //create paddels
            var pads = [], padsOld = [];
            // x-pos, y-pos, width, height
            pads[0] = [0, 100, 20, 150];
            pads[1] = [width-20, 100, 20, 150];

            padsOld[0] = [0, 100, 20, 150];
            padsOld[1] = [width-20, 100, 20, 150];

            var clear = function() {
                canvas.clearRect(0, 0, width, height); //x,y,w,h
                
            };


            var movePads = function(deltaY, pad) {
                padsOld[pad][1] = pads[pad][1];
                pads[pad][1] -= deltaY;
                
            };


            var Ball = {
                pos: [200, 200, 10, 10],
                xd: "right",
                yd: "up",
                speed: 2,
                oldPos: [200, 200, 10, 10]
                
            };


            var draw = function() {
                //pads
                for(var i = 0, p = pads.length; i < p; i++) {
                    //rect(x, y, width, height)
                    canvas.clearRect(padsOld[i][0], padsOld[i][1], padsOld[i][2], padsOld[i][3]); //x,y,w,h
                    canvas.fillRect(pads[i][0], pads[i][1], pads[i][2], pads[i][3]);
                }
                
                //counter
                canvas.font = "bold 30px sans-serif";
                var dim = canvas.measureText(counter[0]+":"+counter[1]);
                canvas.clearRect(width/2-dim.width/2, 0, dim.width, 35);
                canvas.fillText(counter[0]+":"+counter[1],width/2-dim.width/2,35);

                //ball
                canvas.clearRect(Ball.oldPos[0], Ball.oldPos[1], Ball.oldPos[2], Ball.oldPos[3]);
                canvas.fillRect(Ball.pos[0], Ball.pos[1], Ball.pos[2], Ball.pos[3]);

            };


            var Moveball = {
                move: function() {
                    this.checkXY();
                    
                    Ball.oldPos[0] = Ball.pos[0];
                    Ball.oldPos[1] = Ball.pos[1];
                    
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
                Moveball.move();
                draw();

                gLoop = setTimeout(gameloop, gameSpeed);
            };


            var ResetGame = function() {
                clear();               
                
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
                    speed: 2,
                    oldPos: [200, 200, 10, 10]
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
                            if(pads[0][1] < (height-pads[0][3])) { //pads[1][3]
                                movePads(-5, 0);
                            }
                        break;
                        case 87:
                            if(pads[0][1] > 0) {
                                movePads(5, 0);
                            }
                        break;

                        //right player (k,m)
                        case 77:
                            if(pads[1][1] < (height-pads[1][3])) {//pads[0][3]
                                movePads(-5, 1);
                            }
                        break;
                        case 75:
                            if(pads[1][1] > 0) {
                                movePads(5, 1);
                            }
                        break;

                        //pause (p)
                        case 80:
                            if(pause) {
                                pause = false;
                                clear();
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

})(jQuery);