var preloadState = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Preload(){
        Phaser.Scene.call(this, {key: 'Preload'});
    },
    preload: function() {
        // Preload images
        this.load.image(
            "sky",
            "https://raw.githubusercontent.com/cattsmall/Phaser-game/5-2014-game/assets/sky.png"
          );
          this.load.spritesheet(
            "dude",
            "https://raw.githubusercontent.com/cattsmall/Phaser-game/5-2014-game/assets/dude.png",
            {
              frameWidth: 32,
              frameHeight: 48
            }
          );
          this.load.spritesheet(
            "baddie",
            "https://raw.githubusercontent.com/cattsmall/Phaser-game/5-2014-game/assets/baddie.png",
            {
              frameWidth: 32,
              frameHeight: 32
            }
          );
    },

    create: function() {
        console.log("Preload");
        game.scene.start('MainMenu');

            // Create background
    this.physics.add.sprite(config.width / 2, config.height / 2, "sky");

    // Create player
    player = this.physics.add.sprite(32, config.height - 150, "dude");
    // Create animations for player
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 0 }),
      repeat: -1
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("dude", { start: 1, end: 1 }),
      repeat: -1
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 2, end: 2 })
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("dude", { start: 3, end: 3 })
    });

    // Player should collide with edges of the screen
    player.setCollideWorldBounds(true);

    // Keyboard input
    cursors = this.input.keyboard.createCursorKeys();

    // Start enemies as unsafe
    enemiesAreSafe = false;

    // Create enemies
    enemies = this.physics.add.staticGroup({
      key: "baddie",
      repeat: enemiesToSpawn
    });

    // Go thru each child and make sure it's on screen
    enemies.children.iterate(function(enemy) {
      enemy.setX(Phaser.Math.FloatBetween(32, config.width - 32));
      enemy.setY(Phaser.Math.FloatBetween(32, config.height - 32));
      if (enemy.x > config.width - 32) {
        enemy.setX(config.width - 48);
      } else if (enemy.x < 32) {
        enemy.setX(48);
      }

      if (enemy.y > config.height - 32) {
        enemy.setY(config.height - 48);
      } else if (enemy.y < 32) {
        enemy.setY(48);
      }
    });

    // Create animations for enemy
    this.anims.create({
      key: "safe",
      frames: this.anims.generateFrameNumbers("baddie", { start: 1, end: 1 })
    });

    this.anims.create({
      key: "unsafe",
      frames: this.anims.generateFrameNumbers("baddie", { start: 0, end: 0 })
    });

    // Update the physics colliders
    enemies.refresh();

    // Generate text for score
    scoreText = this.add.text(32, 24, scoreString + score);
    scoreText.visible = false;

    // Generate text for HP
    hitPointsText = this.add.text(32, 64, hitPointsString + hitPoints);
    hitPointsText.visible = false;

    // Generate intro text
    introText = this.add.text(
      32,
      24,
      "Clear all the baddies when they're weak!  \nClick to start playing, use the keyboard to move. \n\n(Click the white area around the game to make movement work)"
    );

    // Add game start click event
    this.input.on("pointerdown", function() {
      if (!gameStarted) {
        startGame();
      }
    });

    // Generate timer
    timedEvent = this.time.addEvent({
      delay: 1000,
      callback: switchEnemyState,
      callbackScope: this,
      loop: true
    });

    // On overlap, run function
    this.physics.add.overlap(player, enemies, collideWithEnemy, null, this);
    },
    update: function() {
        // Update objects & variables
    player.setVelocity(0, 0);
    if (gameStarted && !finishedGame) {
      if (cursors.left.isDown) {
        //  Move to the left
        player.setVelocityX(-150);
        player.anims.play("left");
      } else if (cursors.right.isDown) {
        //  Move to the right
        player.setVelocityX(150);
        player.anims.play("right");
      }

      if (cursors.up.isDown) {
        //  Move up
        player.setVelocityY(-150);
        player.anims.play("up");
      } else if (cursors.down.isDown) {
        //  Move down
        player.setVelocityY(150);
        player.anims.play("down");
      }

      // Update score
      scoreText.setText(scoreString + score);
      hitPointsText.setText(hitPointsString + hitPoints);
    }
    }
});

// Add scene to list of scenes
myGame.scenes.push(preloadState);