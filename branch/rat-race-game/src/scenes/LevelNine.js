// BUSY: 2

import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";

export default class LevelNine extends Phaser.Scene {
  constructor() {
    super("levelNine");
  }

  init() {
    this.cheesesCollected = 383;
    this.n = 1;
  }

  create() {
    console.log("create level 9");
    this.cursors = this.input.keyboard.createCursorKeys();
    // STANDARD
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    //  MUSIC
    this.music = this.sound.add("lvl9-song");
    this.music.play();
    this.music.loop = true;
    this.beep = this.sound.add("lvl9-3song");
    this.beep.play();
    this.beep.loop = true;
    this.traffic = this.sound.add("lvl9-traffic");
    this.traffic.loop = true;
    this.traffic.play();

    // BACKGROUND
    this.background = this.add
      .image(gameWidth, gameHeight + 45, "lvl9-bg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(4);

    // COLLAGE
    this.collage = this.add
      .image(gameWidth, gameHeight + 45, "lvl9-col")
      .setOrigin(1)
      .setScrollFactor(0.5);

    // PBG
    this.pbackground = this.add
      .image(gameWidth, gameHeight + 45, "lvl9-pbg")
      .setOrigin(1)
      .setScrollFactor(2);

    //  PLATFORMSs
    this.platforms = this.physics.add.staticGroup({});

    for (let i = 0; i < 10; ++i) {
      const x = Phaser.Math.Between(0, 400);
      const y = 100 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "lvl9-plat");
      platform.scaleX = 1;
      platform.scaleY = 1;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "lvl9-rat")
      .setScale(0.5)
      .setGravityY(400);

    // //  CARROTS
    this.cheeses = this.physics.add.group({
      classType: Cheese,
    });

    //  COLLISIONS
    //      PLAYER & PLATFORMs
    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = true;
    this.player.body.checkCollision.right = true;
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
      font: "24px sans-serif",
    };
    this.cheesesCollectedText = this.add
      .text(240, 10, "383 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);

    //      CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("levelLoser");
      this.music.stop("lvl9-song");
      this.beep.stop("lvl9-3song");
      this.traffic.stop("lvl9-traffic");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelTen");
      this.music.stop("lvl9-song");
      this.beep.stop("lvl9-3song");
      this.traffic.stop("lvl9-traffic");
    });
  }

  update() {
    document.body.className = "bu9";
    //         // find out from Arcade physics if the player's physics body is touching something below it
    //  PLAYER
    //      BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-500);
      this.player.setTexture("lvl9-ratj");
      // ==== EXTRAs ====
      // this.cameras.main.shake(500);
      this.sound.play("lvl9-bounce");
    }
    //      UNBOUNCE
    const vy = this.player.body.velocity.y; // naar beneden gaan
    if (vy > 0 && this.player.texture.key != "lvl9-rat") {
      // als player nr beneden ga en..
      this.player.setTexture("lvl9-rat");
      // ==== EXTRAs ====
      this.sound.play("lvl9-unbounce");
    }

    //  PLATFORMS
    //      NEW PLATFORMS
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      //  CAMERAS
      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(0, 50);
        platform.body.updateFromGameObject();
        this.addCheeseAbove(platform);
        this.sound.play("lvl9-aca");
      }
    });
    //  PLAYER
    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-1900);
      this.sound.play("lvl9-left");
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(1900);
      this.sound.play("lvl9-right");
    } else {
      this.player.setVelocityX(0);
    }

    //  CAMERAS
    //      SCREEN WRAP OF PLAYER
    // if (Math.random() > 0.8) {
    //   console.log(this.player.y);
    // }
    this.horizontalWrap(this.player);
    //      PLAYER LOOP
    // console.log(this.player.y);
    if (this.player.y < this.n * -3000) {
      this.background.setY(this.n * -9000);
      this.n += 1;
      this.background.setX(480);
      this.sound.play("lvl9-loop1");
    }
    if (this.player.y < this.n * -320) {
      this.pbackground.setY(this.n * -640);
      this.n += 1;
      this.pbackground.setX(480);
      this.sound.play("lvl9-loop2");
    }

    // MUSIC
    // if (this.cheesesCollected >= 385) {
    //   this.traffic.play();
    // }

    //  TO OTHER SCENE
    //    lose
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start("levelEight");
      this.cameras.main.shake(1000);

      this.sound.play("lvl9-restart");
      this.music.stop("lvl9-song");
      this.beep.stop("lvl9-3song");
      this.traffic.stop("lvl9-traffic");
    }

    //    'reward'
    if (this.cheesesCollected >= 470) {
      this.scene.start("levelTen");

      this.music.stop("lvl9-song");
      this.beep.stop("lvl9-3song");
      this.traffic.stop("lvl9-traffic");
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
      this.cameras.main.shake(500);
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
      this.cameras.main.shake(500);
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
    const cheese = this.cheeses.get(sprite.x, y, "lvl9-cheese");

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
    this.sound.play("caughtCheese");
    this.player.setTexture("lvl9-hitCheese");
  }

  //  PLATFORMS
  //    Change!
  /**
   * @param {Phaser.Physics.Arcade.Sprite} platforms
   * @param {Phaser.Physics.Arcade.Sprite} player
   */
  // changePlatforms(platforms, player) {
  //   const platform = this.platforms.create("platform");
  //   this.platforms.killAndHide(platform);
  //   this.physics.world.disableBody(platform.body);
  // }
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
