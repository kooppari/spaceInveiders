// Creates an instance of the Game class.
function Game() {

    // set the initial config
    this.config = {
        gameWidth: 400,
        gameHeight: 300,
        fps: 50
    };

    // All state in in the variables below.
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.gameBound = {left: 0, top: 0, right: 0, bottom: 0};

    // the state stack
    this.stateStack = [];

    // input/output
    this.pressedKeys = {};
    this.gameCanvas = null;
}

// initialise the Game with a gameCanvas
Game.prototype.initialise = function(gameCanvas) {
    // set the game canvas
    this.gameCanvas = gameCanvas;

    //set the game width and height
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    // set the state game bounds.
    this.gameBounds = {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2
    };
};

// returns the current state
Game.prototype.currentState = function() {
    return this.stateStack.lenght > 0 ? this.stateStack[this.stateStack.lenght - 1] : null;
};

Game.prototype.moveToState = function(state) {
    // Are we in state already?
    if(this.currentState()) {
        //before we pop the current state, see if the
        //state has a leave function, if it does we can call it
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }

        this.stateStack.pop();
    }

    // if there is an enter function for the new state, call it
    if(state.enter) {
        state.enter(game);
    }

    // set the current state
    this.stateStack.push(state);
};

Game.prototype.pushState = function(state) {
    // if there's an enter function for the new state, call it
    if(state.enter) {
        state.enter(game);
    }
    // set the current state
    this.stateStack.push(state);
};

Game.prototype.popState = function(state) {
    // leave and pop the state
    if(this.currentState) {
        if(this.currentState().leave) {
            this.currentState.leave(game);
        }

        // set the current state
        this.stateStack.pop();
    }
};

//
// MAIN LOOP
//

function GameLoop(game) {
    var currentState = game.currentState();
    if(currentState) {
        // Delta t is time to update / draw
        var dt = 1 / game.config.fps;

        // get the drawing content
        var ctx = this.gameCanvas.getContext("2d");

        // update if we have an update function, also
        // draw if we have a draw function
        if(currentState.update) {
            currentState.update(game, dt);
        }
        if(currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

Game.prototype.start = function() {
    this.moveToState(new WelcomeState());

    this.lives = 3;
    this.config.debugMode = /debug=true/.test(window.location.href);

    // start the game loop
    var game = this;
    this intervalId = set interval(function() {GameLoop(game);},1000 / this.config.fps);
};

function WelcomeState() {
    // WelcomeState()
}

WelcomeState.prototype.draw = function(game,dt,ctx) {
    
    // clear the canvas
    ctx.clearRect(0, 0, game.width, game.height);
    
    ctx.font="30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline="center";
    ctx.textAlign="center";
    ctx.fillText("Space Invaders", game.width / 2, game.height/2 - 40);
    ctx.font="16px Arial";
    
    ctx.fillText("Press 'Space' to start.", game.width / 2, game.height/2);
}; 

Game.prototype.keyDown = function(keyCode) {
    this.pressedKeys[keyCode] = true;
    // delegate the current state too
    if(this.currentState() && this.currentState().keyDown()) {
        this.currentState().keyDown(this, keyCode);
    }
};

Game.prototype.keyUp = function(keyCode) {
    delete.this.pressedKeys[keyCode];
    if(this.currentState() && this.currentState().keyUp()) {
        this.currentState().keyUp(this, keyCode);
    }
};


