// Enemies our player must avoid
var Enemy = function (startX, startY) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    // set x, y locations for coordinate sytem of game board
    this.x = startX;
    this.y = startY;
    // initialise enemy speed
    this.speed = 100; // default: an enemy is static
    // set the graphic for player
    this.sprite = 'images/enemy-bug.png';
    // define x and y pivot for 'center' of the graphics design
    this.xPivot = 50;
    this.yPivot = 90;

    this.level = 1; // set enemy level - used like a kind of 'dangerous' level
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // NOTE: the 'dt' parameter ensures the game runs at same speed for all computers.
    this.x = this.x + this.speed * dt
    // if enemy is colliding with player, then bump
    this.collidingWithPlayer();
    this.offGameBoard(); // check if enemy is off game board
};

Enemy.prototype.collidingWithPlayer = function () {
    if  (player.x <= this.x + 50 &&
        this.x <= player.x + 20 &&
        player.y <= this.y + 20 &&
        this.y <= player.y + 20
        )
    {
        player.playerRestart();

    }
};

Enemy.prototype.offGameBoard = function () {
    if  (this.x > gb.gameBoardWidth) {
        // re-position the enemy horizontaly off left of game board
        this.x = gb.boardStartX - (2 * gb.tileWidth);
        this.randomSpeed(100, 200); // set a new random speed for enemy
    }
};

Enemy.prototype.randomSpeed = function() {
    var minSpeed = 150,
        maxSpeed = 250;
    // max speed will be multiplied by value of enemies level)
    // the default level = 1
    this.speed = Math.floor((Math.random() * (maxSpeed * this.level)) + minSpeed);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
     // drawImage params: img,sourceX,sourceY,sourceWidth,sourceHeight,x,y,width,height
     ctx.drawImage(
                    Resources.get(this.sprite),
                    0,
                    75,
                    Resources.get(this.sprite).width,
                    Resources.get(this.sprite).height - 75,
                    this.x,
                    this.y,
                    gb.tileWidth,
                    gb.tileHeight
     );
};

// PLAYER

var Player = function(StartXPos, StartYPos) {
    // set x and y locations of coordinate sytem of game board
    // if a value not given, use a default off-canvas location
    this.x = StartXPos;
    this.y = StartYPos;
    // set the graphic for player
    this.sprite = 'images/char-pink-girl.png';
    // define x and y pivot for 'center' of the graphics design
    this.pivotX = 50;
    this.pivotY = 130;
};

Player.prototype.update = function() {
  this.checkInWater();
};

Player.prototype.enemyBump = function () {
    this.playerRestart();
}

Player.prototype.render = function() {
    // drawImage params: img,sourceX,sourceY,sourceWidth,sourceHeight,x,y,width,height
     ctx.drawImage(
                    Resources.get(this.sprite),
                    0,
                    60,
                    Resources.get(this.sprite).width,
                    Resources.get(this.sprite).height - 60,
                    this.x,
                    this.y,
                    gb.tileWidth,
                    gb.tileHeight
     );
};

Player.prototype.playerRestart = function() {
    this.x = Math.floor(gb.numCols / 2) * gb.tileWidth;
    // set player vertical start position to bottom row of game board
    if (this.sprite === "images/char-princess-girl.png") {
         this.y = gb.boardStartY;
    }
    else
    {
         this.y = (gb.numRows - 1) * gb.tileHeight;
    }
};

Player.prototype.checkInWater = function() {
    if (this.y === 0) {
        this.sprite = ('images/char-princess-girl.png');
    }
};

Player.prototype.handleInput = function(e) {
    if (e === 'left') {
            if (this.x > 0) {
                this.x -= gb.tileWidth;}
            }
    else if (e === 'right') {
            if (this.x < ctx.canvas.width - gb.tileWidth) {
                this.x += gb.tileWidth
            }
    }
    else if (e === 'up') {
            if (this.y > 0) {
                this.y -= gb.tileHeight;
            }
    }
    else if (e === 'down') {
            if (this.y < gb.gameBoardHeight - (2 * gb.tileHeight)) {
                this.y += gb.tileHeight;
            }
            else
            {
                this.sprite = ('images/char-pink-girl.png');
            }
    }
};

// instantiate objects.

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
// required enemies for rock rows, that is the numRows - 3
// append the required new enemies onto the 'allEnimes' array
for (i = 1; i <= (gb.numRows - 3); i++) {
    allEnemies.push(
        new Enemy(
            // start the enemy at random column of a row
            gb.boardStartX + Math.floor((Math.random() * (gb.numCols - 1)) + 1) * gb.tileWidth,
            // the row the enenmy is on
            i * gb.tileHeight
        )
    );
};

// Place the player object in a variable called player
var player = new Player(0, 0);
player.playerRestart();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Helper functions for app

function isOdd (num) {
    return (num % 2);
}

function negative (num) {
    -num;
}

function randomSpeed (minSpeed, maxSpeed) {
    return Math.floor((Math.random() * maxSpeed) + minSpeed);
}
