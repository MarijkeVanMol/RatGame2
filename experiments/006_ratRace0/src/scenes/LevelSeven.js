import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";

export default class LevelSeven extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  cheeses;

  cheesesCollected = 271;

  /** @type {Phaser.GameObjects.Text} */
  cheesesCollectedText;

  constructor() {
    super("levelSeven");
  }

  init() {
    this.cheesesCollected = 271;
    this.n = 1;
  }

  create() {
    //  GENERAL
    console.log("create level 7");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    //  CURSORS
    this.cursors = this.input.keyboard.createCursorKeys();

    //  MUSIC
    this.music = this.sound.add("lvl7-song");
    this.music.loop = true;
    this.music.play();
    this.beep = this.sound.add("lvl7-3song");
    this.beep.loop = true;
    this.beep.play();
    this.jump = this.sound.add("lvl7-jump");

    //  BACKGROUND
    // this.background = this.add
    //   .image(gameWidth, gameHeight + 200, "lvl7-bg") // zoda ge geen zwarte balk krijgt v onder
    //   .setOrigin(1) //origin is linksonder van afbeelding
    //   .setScrollFactor(3);

    //  COLLAGE
    this.collage = this.add
      .image(gameWidth, gameHeight, "lvl7-col") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(5);

    //  lBG
    this.lbackground = this.add
      .image(gameWidth, gameHeight, "lvl7-lbg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(2);

    //  PLATFORMS
    this.platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(0, 430);
      const y = 120 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "lvl7-rat");
      platform.scaleX = 4;
      platform.scaleY = 1;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "lvl7-plat")
      .setScale(1) //0.2
      .setGravityY(200); //300 = sweet jump, -300 tp make it go faster

    //  CHEESE
    this.cheeses = this.physics.add.group({
      classType: Cheese,
    });

    //  COLLISIONS
    //      PLAYER & PLATFORMS
    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = true;
    this.player.body.checkCollision.right = true;

    //  OVERLAPS
    //      CARROT & PLAYER (handles overlap between carrot and player)
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
      font: "50px sans-serif",
    };
    this.cheesesCollectedText = this.add
      .text(240, 10, "271 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);

    //  CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("levelLoser");
      this.music.stop("lvl7-song");
      this.beep.stop("lvl7-3song");
      this.jump.stop("lvl7-jump");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelEight");
      this.music.stop("lvl7-song");
      this.beep.stop("lvl7-3song");
      this.jump.stop("lvl7-jump");
    });
  }

  update() {
    // CSS
    document.body.className = "bu7";

    //  PLAYER
    //      BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-800);
      this.jump.play();
      this.sound.play("lvl7-bounce");
      //this.cameras.main.shake(500);
    }
    //      UNBOUNCE
    const vy = this.player.body.velocity.y; // naar beneden gaan
    if (vy > 0 && this.player.texture.key != "lvl7-cheeses") {
      // als player nr beneden ga en..
      this.sound.play("lvl7-unbounce");

      this.cameras.main.shake(700);
    }

    //  PLATFORMS
    //      NEW PLATFORMS
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      //  CAMERAS
      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(0, 100);
        platform.body.updateFromGameObject();

        this.addCheeseAbove(platform);
        this.sound.play("lvl7-aca");
      }
    });

    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(800);
      this.sound.play("lvl7-left");
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(-800);
    } else {
      this.player.setVelocityX(0);
    }

    //  CAMERAS
    this.horizontalWrap(this.player);

    // LOOP
    // console.log(this.player.y);
    if (this.player.y < this.n * -320) {
      this.collage.setY(this.n * -640);
      this.n += 1;
      this.collage.setX(480);
      this.sound.play("lvl7-loop");
    }
    // if (this.player.y < this.n * -1000) {
    //   this.background.setY(this.n * -5000);
    //   this.n += 1;
    //   this.background.setX(480);
    // }
    if (this.player.y < this.n * -320) {
      this.lbackground.setY(this.n * -640);
      this.n += 1;
      this.lbackground.setX(480);
    }

    // MUSIC
    if (this.cheesesCollected <= 370) {
      this.beep.play("lvl7-3song");
    }

    //  RESTART 1
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 600) {
      this.scene.start("levelSix");
      this.sound.play("lvl7-restart");
      this.music.stop("lvl7-song");
      this.beep.stop("lvl7-3song");
      this.jump.stop("lvl7-jump");
    }
    //  RESTART 2
    if (this.cheesesCollected >= 370) {
      this.scene.start("levelEight");
      this.sound.play("lvl7-restart");
      this.music.stop("lvl7-song");
      this.beep.stop("lvl7-3song");
    }
  }
  //      END OF UPDATE (============== hier starten alle aparte functies ==============)

  //  CAMERAS
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
      this.cameras.main.shake(1500);
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
      this.cameras.main.shake(300);
    }
  }

  // CHEESE
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCheeseAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const cheese = this.cheeses.get(sprite.x, y, "lvl7-cheeses");
    cheese.setScale(1, 2);

    cheese.setActive(true); // set active
    cheese.setVisible(true); // set visible

    this.add.existing(cheese);
    cheese.body.setSize(cheese.width, cheese.height); // update the physiscs body size

    this.physics.world.enable(cheese); //enables body in physics world

    return cheese;
  }
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
    this.cameras.main.shake(1000);
    this.music.play("lvl7-song");
    this.sound.play("lvl7-hcc");
  }

  //  PLATFORMS
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
