'use strict';
document.addEventListener("DOMContentLoaded", function (event) {
  run();
});

var run = function () {
  var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {preload: preload, create: create, update: update});
  var ball, paddle;
  var bricks, newBrick, brickInfo;
  var score = 0;
  var scoreText;

  function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.crossOrigin = "Anonymous";
    game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
    game.load.image('brick', 'img/brick.png');
    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Give ball some physics
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
    ball.animations.add('wobble', [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.bounce.set(1);
    ball.body.collideWorldBounds = true;
    ball.body.velocity.set(150, -150);

    // Define ball limits
    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(function () {
      console.log('Game Over!');
      document.location.reload();
    }, this);


    // Paddle and buttons
    paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    // Bricks
    initBricks();

    // Score
    scoreText = game.add.text(5, 5, 'Points: ' + score, {font: '18px Arial', fill: '#0095DD'});
  }

  function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    paddle.x = game.input.x || game.world.width * 0.5;

  }

  function initBricks() {
    brickInfo = {
      width: 50,
      height: 20,
      count: {
        row: 7,
        col: 3
      },
      offset: {
        top: 50,
        left: 60
      },
      padding: 10
    };
    bricks = game.add.group();
    for (var c = 0; c < brickInfo.count.col; c++) {
      for (var r = 0; r < brickInfo.count.row; r++) {
        var brickX = (r * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
        var brickY = (c * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
        newBrick = game.add.sprite(brickX, brickY, 'brick');
        game.physics.enable(newBrick, Phaser.Physics.ARCADE);
        newBrick.body.immovable = true;
        newBrick.anchor.set(0.5);
        bricks.add(newBrick);
      }
    }
  }

  function ballHitPaddle(ball, paddle) {
    ball.animations.play('wobble');
  }

  function ballHitBrick(ball, brick) {
    var killTween = game.add.tween(brick.scale);
    killTween.to({x: 0, y: 0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function () {
      brick.kill();
    }, this);
    killTween.start();
    score += 10;
    scoreText.setText('Points: ' + score);
    checkGameWinCondition();
  }

  function checkGameWinCondition() {
    var count_alive = 0;
    var num_children = bricks.children.length;
    for (var i = 0; i < num_children; i++) {
      if (bricks.children[i].alive) {
        count_alive++;
      }
    }
    if (count_alive === 0) {
      alert('You win!');
      document.location.reload();
    }
  }

  //TODO: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Buttons

};