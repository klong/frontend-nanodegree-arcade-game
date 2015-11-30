/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function (global) {
    'use strict';
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        gb = {
            // TODO: moving the game board origin within the canvas area not workinhg, so it is kept at zero
            boardStartX: 0, // set at 0
            boardStartY: 0, // set at 0
            numCols: 15, // number of game board horizontal tiles
            numRows: 10, // number of game board vertical tiles
            tileWidth: 50, // tile width
            tileHeight: 55, // tile height
            // using 'get' to initialise object properties based on other properties of the object
            get tileBottomVisible () {
                // the extra pixels visble for the 3D look on bottom row of tile
                return Math.floor(this.tileHeight * 0.45);
            },
            get tileVOverlap () {
                // the vertical tile overlap adjustment
                return Math.floor(this.tileHeight / 8.5);
            },
            get gameBoardWidth () {
                // horizontal area of game board
                return this.numCols * this.tileWidth;
            },
            get gameBoardHeight () {
                // vertical area of game board
                return this.numRows * this.tileHeight;
            },
            get extraHeightforIndicators () {
                return this.tileHeight / 2;
            }
        };

    // set canvas size based on game board

    canvas.width = gb.boardStartX + gb.gameBoardWidth;
    canvas.height = gb.boardStartY + gb.gameBoardHeight + gb.tileBottomVisible + gb.extraHeightforIndicators;

    // append the HTML canvas to the index.html page

    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        // update enemy objects
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allTreasures.forEach(function(treasure) {
            treasure.update(dt);
        });
        // update player object
        player.update(dt);
        // update indicators objects
        allIndicators.forEach(function(indicator) {
            indicator.update(dt);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        drawGameBoard();
        renderEntities();
    }

    function drawGameBoard() {
        /* This array holds the relative URL to the image used
        * for that particular row of the game level.
        */
        ctx.fillStyle = "salmon";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var rowImages = [];
        // the first row is of water
        rowImages.push('images/water-block.png');
        // the number of stone rows needed is the total rows for the game board, minus 1 row of water + 2 rows of grass
        var numStoneRows =  gb.numRows - 3;
        for (var i = 1; i <= numStoneRows; i++) {
            rowImages.push('images/stone-block.png');
        }
        // the bottom two rows are grass
        rowImages.push('images/grass-block.png');
        rowImages.push('images/grass-block.png');
        // draw the game board
        for (var row = 1; row <= gb.numRows; row++) {
            for (var col = 1; col <= gb.numCols; col++) {
                // drawImage params: img,sourceX,sourceY,sourceWidth,sourceHeight,x,y,width,height
                ctx.drawImage(
                    Resources.get(rowImages[row - 1]), // note: rowImage array index is zero based
                    0,
                    40, // vertical source clipping offset for transparent area in alpha
                    Resources.get(rowImages[row - 1]).width,
                    Resources.get(rowImages[row - 1]).height,
                    gb.boardStartX + ((col * gb.tileWidth) - gb.tileWidth), // horizontal location to draw
                    gb.boardStartY + ((row * gb.tileHeight) - gb.tileHeight - gb.tileVOverlap), // vertical location to draw
                    gb.tileWidth,
                    gb.tileHeight + gb.tileVOverlap + (gb.tileHeight - gb.tileVOverlap)
                );
                //drawBoardTileRectangle(col, row); // debug drawing of game board tiles
            }
        }

    }

    function drawBoardTileRectangle (colNum, rowNum) {
        // debug rectangles showing game board tiles
        ctx.rect(
                (colNum * gb.tileWidth) - gb.tileWidth + gb.boardStartX, // horizontal location to draw
                (rowNum * gb.tileHeight) - gb.tileHeight + gb.boardStartY, // vertical location to draw
                gb.tileWidth,
                gb.tileHeight
        );
        ctx.stroke();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects and call
         * the render function you have defined.
         */
        allIndicators.forEach(function(indicator) {
            indicator.render();
        });
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        allTreasures.forEach(function(treasure) {
            treasure.render();
        });
        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Rock.png',
        'images/Heart.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.gb = gb;
}(this));
