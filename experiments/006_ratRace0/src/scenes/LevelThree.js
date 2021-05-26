// BUSY: 2

import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";

export default class LevelThree extends Phaser.Scene {
  constructor() {
    super("levelThree");
  }

  init() {
    this.cheesesCollected = 10;
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    //  MUSIC
    var music = this.sound.add("songBusy");
    music.play();
    // //  BACKGROUND
    //         this.add.image(240,320, 'background').setScrollFactor(1,0);

    //         // this.add.image(240,320, 'platform').setScale(0.5);
    //         // this.physics.add.image(240,320,'platform').setScale(0.5);

    //  PLATFORMS
    //this.add.image(240,320,'platform').setScale(1)
    this.platforms = this.physics.add.staticGroup({});

    for (let i = 0; i < 8; ++i) {
      const x = Phaser.Math.Between(80, 600);
      const y = 100 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "platform");
      // platform.flipY= true; doesn't work

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "bunny-stand")
      .setScale(2)
      .setGravityY(100);

    // //  CARROTS
    this.cheeses = this.physics.add.group({
      classType: Cheese,
    });
    //this.carrots.get(240,320, 'carrot');

    //  COLLISIONS
    //      PLAYER & PLATFORMs
    this.physics.add.collider(
      this.platforms,
      this.player,
      this.changePlatforms,
      undefined,
      this
    );
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
    //      CARROT & PLATFORMS
    this.physics.add.collider(this.platforms, this.cheeses);
    //  OVERLAPS
    //      CARROT & PLATFORMS
    this.physics.add.overlap(
      this.player,
      this.cheeses,
      this.handleCollectCheese, // called on overload
      undefined,
      this
    );

    //  CAMERAS
    this.cameras.main.startFollow(this.player); // follows player, also to the side
    this.cameras.main.setDeadzone(this.scale.width * 1.5); // makes sure it doesn't go 'off-screen, move to the sides'

    //  FONT
    const style = {
      color: "yellow",
      fontSize: 24,
    };
    this.cheesesCollectedText = this.add
      .text(240, 10, "10 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);

    //      CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("game-over");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("gameBoring");
    });
  }

  update() {
    //         // find out from Arcade physics if the player's physics body is touching something below it
    //  PLAYER
    //      BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-300);
      this.player.setTexture("bunny-jump");
      this.cameras.main.shake(500);
      const platform = this.platforms.create("platform");
      // const platform = this.platforms;
      platform.setTexture("platformTwo");
    }
    //      UNBOUNCE
    const vy = this.player.body.velocity.y; // naar beneden gaan
    if (vy > 0 && this.player.texture.key != "bunny-stand") {
      // als player nr beneden ga en..
      this.player.setTexture("bunny-stand");
    }

    //  PLATFORMS
    //      NEW PLATFORMS
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      // HERE IS THE BUG
      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();

        // create a carrot above the platform being
        console.log("add cheese");
        // DONT ADD INFINITE CHEESES
        // this.addCheeseAbove(platform);
      }
    });
    //  PLAYER
    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    //  CAMERAS
    //      SCREEN WRAP OF PLAYER
    this.horizontalWrap(this.player);

    //  TO NEXT SCENE
    //    normal loser route
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start("levelThree");
    }

    //    'reward'
    if (this.cheesesCollected == 2000) {
      this.scene.start("levelThree");
      this.sound.play("tttwo");
    }

    //  END OF UPDATE: beware of the accolade below!!
  }

  //  START OF FUNCTIONS
  //  CAMERAS
  //      HORIZONTAL WRAP; if outside left side of screen, appears on right of screen
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }
  //  CARROT
  //      MAKE SURE CARROTS APPEARS BEFORE THE REST ??
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCheeseAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const cheese = this.cheeses.get(sprite.x, y, "cheese");

    cheese.setActive(true); // set active
    cheese.setVisible(true); // set visible

    this.add.existing(cheese);
    cheese.body.setSize(cheese.width, cheese.height); // update the physiscs body size

    this.physics.world.enable(cheese); //enables body in physics world

    return cheese;
  }

  //  CARROT
  //      COLLECT
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Cheese} cheese
   */
  handleCollectCheese(player, cheese) {
    this.cheeses.killAndHide(cheese); // hide from display
    this.physics.world.disableBody(cheese.body); // disable from physics world
    this.cheesesCollected++;
    const value = `${this.cheesesCollected} Cheeses`;
    this.cheesesCollectedText.text = value;
  }

  //  PLATFORMS
  //    Change!
  /**
   * @param {Phaser.Physics.Arcade.Sprite} platforms
   * @param {Phaser.Physics.Arcade.Sprite} player
   */
  changePlatforms(platforms, player) {
    const platform = this.platforms.create("platform");
    this.platforms.killAndHide(platform);
    this.physics.world.disableBody(platform.body);
  }
  /*
    const platTwo = this.player s colliding with platform
    if (platTwo && this.platforms.texture.key != "platformTwo")
    {
      this.playforms.setTexture("platformTwo")
    }
  */

  //    fall!
  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; i++) {
      const platform = platforms[i];
      if (platform.y < bottomPlatform.y) {
        continue;
      }
      bottomPlatform = platform;
    }
    return bottomPlatform;
  }
}
