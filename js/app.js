/**
 * @file app.js
 * @author Karl Longman GitHub: klong
 * @decription Udacity Nanodegree Project 3 - HTML Canvas Arcade Game, app javascript uses engine.js & resources.js
 * see README.md file for more information about the game.
 * {@link http://klong.github.io/ Game} - link to GitHub hosted game page
*/

/**
 * @class Enemy
 * @description creates an Enemy object the player must avoid
 * @param {num} startX - the horizontal start x location on canvas
 * @param {num} startY - the vertical start y location on canvas
 * @param {num} speed - the speed is number of pixels to move in x on an update
 * @param {string} sprite - the path to image file used for enemey
 * @param {num} xPivot - pixel value for horizontal pivot location
 * @param {num} yPivot - pixel value for vertical pivot location
 * @param {num} energyLevel - a normalised value to represent an enemies ernergy level
 */
var Enemy = function (startX, startY) {
    'use strict';
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // set x, y locations for coordinate sytem of game board
    this.x = startX;
    this.y = startY;
    // initialise enemy speed
    this.speed = 100;
    // set the graphic for player
    this.sprite = 'images/enemy-bug.png';
    // define x and y pivot for 'center' of the graphics design
    this.xPivot = 50;
    this.yPivot = 90;
    // set enemy energy level
    // note: energyLevel will be a floating point value between 0 and 1
    this.energyLevel = 1.00;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    'use strict';
    // NOTE: the 'dt' parameter ensures the game runs at same speed for all computers.
    this.move(dt);
    this.offGameBoard(); // check if enemy is off game board
    this.collidingWithPlayer();
};

Enemy.prototype.move = function (dt) {
     this.x += this.speed * dt;
};

Enemy.prototype.collidingWithPlayer = function () {
    'use strict';
    if  (player.x <= this.x + 50 &&
        this.x <= player.x + 20 &&
        player.y <= this.y + 20 &&
        this.y <= player.y + 20)
    {
        // when collision with player is true
        this.bump(player);
    }
};

Enemy.prototype.bump = function (targetObj) {
    targetObj.bumped();
    this.energyLevel -= 0.00005;
    this.speed = -10;
};

Enemy.prototype.offGameBoard = function () {
    'use strict';
    if (this.speed > 0 && this.x > gb.boardStartX + gb.gameBoardWidth ||
        this.speed < 0 && this.x < gb.boardStartX - gb.tileWidth)
        // re-position the enemy horizontaly off left of game board
        this.x = gb.boardStartX - (2 * gb.tileWidth);
        this.randomSpeed(100, 200); // set a new positive random speed for enemy
};


Enemy.prototype.randomSpeed = function(minSpeed, maxSpeed) {
    'use strict';
    // maxSpeed is multiplied by normalised factor of enemies energyLevel
    this.speed = Math.floor((Math.random() * (maxSpeed * this.energyLevel)) + minSpeed);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    'use strict';
     // drawImage params: img,sourceX,sourceY,sourceWidth,sourceHeight,x,y,width,height
     ctx.drawImage(
                    Resources.get(this.sprite),
                    0,
                    75,
                    Resources.get(this.sprite).width,
                    Resources.get(this.sprite).height - 75,
                    this.x + gb.boardStartX,
                    this.y + gb.boardStartY,
                    gb.tileWidth,
                    gb.tileHeight
     );
};

/**
 * Creates a new PLAYER object.
 * @class Player
 * @description creates a player of the game
 * @param {number} StartXPos - the horizontal start x location on canvas
 * @param {number} StartYPos - the vertical start y location on canvas
 */
var Player = function(StartXPos, StartYPos) {
    'use strict';
    // set x and y locations of coordinate sytem of game board
    // if a value not given, use a default off-canvas location
    this.x = StartXPos;
    this.y = StartYPos;
    // set the graphic for player
    this.sprite = 'images/char-pink-girl.png';
    // define x and y pivot for 'center' of the graphics design
    this.pivotX = 50;
    this.pivotY = 130;
    this.energyLevel = 1.00;
};

Player.prototype.update = function(dt) {
    'use strict';
     // NOTE: the 'dt' parameter ensures the game runs at same speed for all computers.
    this.depleteEnergy(); // by default player is allways losing energy
    this.checkInWater();
};

Player.prototype.depleteEnergy = function() {
    if (this.energyLevel < 0) {
        this.playerRestart();
    } else {
        this.energyLevel -= 0.0001;
    }
};

Player.prototype.bump = function (targetObj) {
    'use strict';
    targetObj.bumped();
};

Player.prototype.bumped = function () {
    'use strict';
    this.energyLevel -= 0.005;

};

Player.prototype.render = function() {
    'use strict';
    // drawImage params: img,sourceX,sourceY,sourceWidth,sourceHeight,x,y,width,height
     ctx.drawImage(
                    Resources.get(this.sprite),
                    0,
                    60,
                    Resources.get(this.sprite).width,
                    Resources.get(this.sprite).height - 60,
                    this.x + gb.boardStartX,
                    this.y + gb.boardStartY,
                    gb.tileWidth,
                    gb.tileHeight
     );
};

Player.prototype.playerRestart = function() {
    'use strict';
    this.energyLevel = 1;
    // set the x location to the 'middle' of the game board
    this.x = gb.boardStartX + (Math.floor(gb.numCols / 2) * gb.tileWidth);

    if (this.sprite === "images/char-princess-girl.png") {
         // set player vertical start position to bottom row of game board
         this.y = gb.boardStartY;
    } else {
        // set the y location to bottom row of game board
        this.y = gb.boardStartY + ((gb.numRows - 1) * gb.tileHeight);
    }
};

Player.prototype.checkInWater = function() {
    'use strict';
    if (this.y === gb.boardStartY) {
        this.sprite = ('images/char-princess-girl.png');
    }
};

Player.prototype.handleInput = function(e) {
    'use strict';
    if (e === 'left') {
            if (this.x > gb.boardStartX) {
                this.x -= gb.tileWidth;
            }
    }
    else if (e === 'right') {
            if (this.x < gb.boardStartX + gb.gameBoardWidth - gb.tileWidth) {
                this.x += gb.tileWidth;
            }
    }
    else if (e === 'up') {
            if (this.y > gb.boardStartY) {
                this.y -= gb.tileHeight;
            }
    }
    else if (e === 'down') {
            if (this.y < gb.boardStartY + gb.gameBoardHeight - gb.tileHeight) {
                this.y += gb.tileHeight;
            } else {
                this.sprite = ('images/char-pink-girl.png');
            }
    }
};

var Treasure = function (startXPos, startYPos, colourName) {
    'use strict';
    // set x and y locations of coordinate sytem of game board
    // if a value not given, use a default off-canvas location
    this.x = startXPos;
    this.y = startYPos;
    this.gemSprite = 'images/Gem ' + colourName + '.png';
    // set the graphic for rock
    this.rockSprite = 'images/Rock.png';
};

Treasure.prototype.update = function (dt) {

};

Treasure.prototype.render = function () {
    'use strict';
    // drawImage params: img,sourceX,sourceY,sourceWidth,sourceHeight,x,y,width,height
    // draw the Gem on game board
    var gemImg = Resources.get(this.gemSprite),
        gemWidth = gb.tileWidth / 2,
        gemHeight = gb.tileHeight / 2,
        rockImg = Resources.get(this.rockSprite);

    ctx.drawImage(
                    gemImg,
                    0,
                    60,
                    gemImg.width,
                    gemImg.height - 60,
                    this.x + gb.boardStartX + tileCenterXOffset() - (gemWidth / 2),
                    this.y + gb.boardStartY + tileCenterYOffset() - (gemHeight / 2),
                    // gem sprite is scalled down to be hidden by rock sprite
                    gemWidth,
                    gemHeight
     );
    // draw the rock over the gem on game board
     ctx.drawImage(
                    rockImg,
                    0,
                    60,
                    rockImg.width,
                    rockImg.height - 60,
                    this.x + gb.boardStartX,
                    this.y + gb.boardStartY,
                    gb.tileWidth,
                    gb.tileHeight
     );
};


/**
 * @class Indicator
 * @description creates an indicator that associates an objects property value with one or more UI indicator object
 * @param {obj} obj - the object to use the indicator object
 * @param {string} objProp - the name of the object property of the obj to be indicated
 * @param {array} UIobjs - a UI object that will be upated based on the value of the object property
 */
var Indicator = function (obj, objProp, UIobjs) {
    this.objRef = obj;
    this.objRefProp = objProp;
    // an array of UI objects
    this.UIobjsArray = UIobjs;
};

Indicator.prototype.update = function (dt) {
    'use strict';
    var value = this.objRef[this.objRefProp];
    for (i = 0; i < this.UIobjsArray.length; i++) {
        this.UIobjsArray[i].update(dt, value);
    };
};

Indicator.prototype.render = function () {
    'use strict';
    for (i = 0; i < this.UIobjsArray.length; i++) {
        this.UIobjsArray[i].render();
    };
};

/**
 * @class gameUIdisplay
 * @description creates a UI object that draws a value as fillText on the canavas
 */
var gameUIdisplay = function (startX, startY, width, height, valueConvertFunction, renderFunction) {
    'use strict';
    this.displayText = "pop";
    this.x = startX ; // Start X postion on canvas
    this.y = startY ; // Start Y postion on canvas
    this.width = width;
    this.height = height;
    this.valueConvertFunction = valueConvertFunction;
    this.renderFunction = renderFunction;
};

gameUIdisplay.prototype.update = function (dt, value) {
    'use strict';
    this.displayText = this.valueConvertFunction(value);
};

gameUIdisplay.prototype.render = function () {
    'use strict';
    this.renderFunction();


};

// **************************
// Helper functions for app
// **************************
/**
 * @function isOdd
 * @param {num} num
 * @returns {num} - returns 1 if argument is odd else returns 0,
 */
function isOdd (num) {
    'use strict';
    return (num % 2);
}
/**
* @function negative
* @description helper function returns negative of given number
* @param {num} num - number to negate
* @returns {num}
*/
function negative (num) {
    'use strict';
    -num;
}
/**
* @function randomSpeed
* @description helper function returns a 'speed' value within a min and max range
* @param {num} minSpeed - minimum speed in range
* @returns {num} maxSpeed - maximum speed in range
*/
function randomSpeed (minSpeed, maxSpeed) {
    'use strict';
    return Math.floor((Math.random() * maxSpeed) + minSpeed);
}

function tileCenterXOffset () {
    'use strict';
    return gb.tileWidth / 2;
}

function tileCenterYOffset () {
    'use strict';
    return gb.tileHeight / 2;

}

// *****************************************************************
//                  instantiate game objects.
// *****************************************************************
// Place all ENEMY OBJECTS in an array called allEnemies
var allEnemies = [];
// required enemies - one for each rock row, that is the numRows - 3
// append the required new enemies onto the 'allEnimes' array
for (i = 1; i <= (gb.numRows - 3); i++) {
    allEnemies.push(
        new Enemy(
            // start the enemy at random offset column off the canvas edge
            (gb.boardStartX - gb.gameBoardWidth) + Math.floor((Math.random() * (gb.numCols - 1)) + 1) * gb.tileWidth,
            // the row the enenmy is on
            i * gb.tileHeight
        )
    );
};

// Place PLAYER OBJECT in a variable called player
var player = new Player(0, 0);
// reset the players start position
player.playerRestart();

var treasureColourList = ['Blue','Green','Orange'];
// Place TREASURE OBJECTS in an array called allTreasures
var allTreasures = [];
// put a treasure on all stone rows of the game board
// i.e numRows of game board minus top row of water and bottom two rows of grass
for (i = 1; i <= (gb.numRows - 3); i++) {
    allTreasures.push(
        new Treasure(
            // the start x for treasure on a random column of game board
            gb.boardStartX + Math.floor((Math.random() * (gb.numCols - 1)) + 1) * gb.tileWidth,
            // the start y for treasure on row of game board
            i * gb.tileHeight,
            // get a random gem colour from those avaiable
            treasureColourList[Math.floor(Math.random() * treasureColourList.length)]
        )
    );
};

// create an array with a UI element for players energy level indicator
var playerEnergyDisplay = [];

playerEnergyDisplay.push(
    new gameUIdisplay(
            // Start X postion on canvas
            gb.boardStartX + (gb.gameBoardWidth / 2) - ( gb.tileWidth / 2),
            // start Y position on canvas
            gb.boardStartY + gb.gameBoardHeight + gb.tileBottomVisible,
            // width of display
            gb.tileWidth,
            // height of display
            gb.extraHeightforIndicators,
            // anonymous function for converting object value to suit the indicator UI object
            function (value) {
                return Math.floor(value * 100);
            },
            // anonymous function to render UI object
            function () {
                var currentFillStyle = ctx.fillStyle;
                ctx.fillStyle = "grey";
                ctx.fillRect(this.x,
                            this.y,
                            this.width,
                            this.height
                 );
                ctx.font = "18px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline="middle";
                ctx.fillText(this.displayText,
                            this.x + (this.width / 2),
                            this.y + (this.height / 2)
                             );
                // reset canvas context fillStyle to what it was before drawing the NeonDisplay
                ctx.fillStyle = currentFillStyle;
            }
    )
);

playerEnergyDisplay.push(
    new gameUIdisplay(
            // Start X postion on canvas
            gb.boardStartX + ((gb.tileWidth / 3) / 2),
            // start Y position on canvas
            gb.boardStartY + (gb.tileHeight / 2) - ((gb.tileHeight / 2) / 2),
            // width of UI display
            gb.tileWidth - (gb.tileWidth / 3),
            // height of UI display
            gb.tileHeight / 2,
            // anonymous function for converting object value to suit the indicator UI object
            function (value) {
                return Math.floor(value * 1000);
            },
            // anonymous function to render UI object
            function () {
                var currentFillStyle = ctx.fillStyle;
                ctx.fillStyle = "wheat";
                ctx.fillRect(this.x,
                            this.y,
                            this.width,
                            this.height
                 );
                ctx.font = "18px Arial";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.textBaseline="middle";
                ctx.fillText(this.displayText,
                            this.x + (this.width / 2),
                            this.y + (this.height / 2)
                            );
                // reset canvas context fillStyle to what it was before drawing the NeonDisplay
                ctx.fillStyle = currentFillStyle;
            }
    )
);


// place INDICATOR OBJECTS in an array called allIndicators
var allIndicators = [];
// add an indicator object for the player 'energy level' onto allIndicators
allIndicators.push(new Indicator(player,
                                'energyLevel',
                                playerEnergyDisplay // an array of UI elements defined above for the indicator to update
                                )
);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    'use strict';
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/*

$('#pageGameReseter').click(function() {
    player.playerRestart();
});


$('#pageGame').click(function() {
    location.reload();
});

*/

