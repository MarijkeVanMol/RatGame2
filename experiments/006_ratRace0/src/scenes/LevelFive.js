import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";

export default class LevelFive extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  cheeses;

  cheesesCollected = 220;

  /** @type {Phaser.GameObjects.Text} */
  cheesesCollectedText;

  constructor() {
    super("levelFive");
  }

  init() {
    this.cheesesCollected = 220;
  }

  create() {
    //  CURSORS
    console.log("create level 5");
    this.cursors = this.input.keyboard.createCursorKeys();

    //  MUSIC
    this.music = this.sound.add("songBusy");
    this.music.loop = true;
    this.music.play();

    //  BACKGROUND
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    this.background = this.add
      .image(gameWidth, gameHeight + 40, "lvl5-bg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(2);

    // PLATFORMS
    this.platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 10; ++i) {
      const x = Phaser.Math.Between(0, 480);
      const y = 60 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "lvl5-plat");
      platform.scaleX = 0.3;
      platform.scaleY = 0.2;
      // platform.flipY= true; doesn't work

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "lvl5-rat")
      .setScale(2)
      .setGravityY(300); //300 = sweet jump, -300 tp make it go faster

    //  CHEESE
    this.cheeses = this.physics.add.group({
      classTYpe: Cheese,
    });

    //  COLLISIONS
    //      PLAYER & PLATFORMS
    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

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
      font: "24px sans-serif",
    };
    this.cheesesCollectedText = this.add
      .text(240, 10, "220 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);

    //  CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("game-over");
      this.music.stop("songBusy");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelSix");
      this.music.stop("songBusy");
    });
  }

  update() {
    document.body.className = "busy";
    //  PLAYER
    //      BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-500);
      this.player.setTexture("lvl5-rat");

      //this.cameras.main.shake(500);
    }
    //      UNBOUNCE
    const vy = this.player.body.velocity.y; // naar beneden gaan
    if (vy > 0 && this.player.texture.key != "lvl5-ratj") {
      // als player nr beneden ga en..
      this.player.setTexture("lvl5-ratj");
      this.sound.play("gs1");
      //this.cameras.main.shake(500);
    }

    //  PLATFORMS
    //      NEW PLATFORMS
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      //  CAMERAS
      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(0, 10);
        platform.body.updateFromGameObject();

        this.addCheeseAbove(platform);

        this.music.play();
      }
    });

    //  CURSORS MOVEMENT
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-600);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(600);
    } else {
      this.player.setVelocityX(0);
    }

    // CAMERAS
    this.horizontalWrap(this.player);

    // LOOP
    // if (this.player.y < -12000) {
    //   this.background.setY(-5500);
    //   this.background.setX(480);
    // }
    // if (this.player.y < -20000) {
    //   this.background.setY(-5500);
    //   this.background.setX(480);
    // }
    // if (this.player.y < -22000) {
    //   this.background.setY(-5500);
    //   this.background.setX(480);
    // }

    // MUSIC
    if (this.cheesesCollected == 300) {
      this.music.play();
    }

    //  TO NEXT SCENE:
    //  Restart
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 100) {
      this.scene.restart("levelFive"); //scene.scene.restart(data);
      this.sound.play("lvl5-restart");
    }
    //  Level Six
    if (this.cheesesCollected == 350) {
      this.scene.start("levelSix");
      this.sound.play("caughtCheese");
      this.music.stop("songBusy");
    }
  }
  // ========= END OF UPDATE =========(hier starten alle aparte functies)

  //  CAMERAS
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
      this.cameras.main.shake(200);
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
      this.cameras.main.shake(1200);
    }
  }

  //  CHEESE
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCheeseAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const cheese = this.cheeses.get(sprite.x, y, "lvl5-cheese");
    cheese.setScale(0.4);

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
    this.player.setTexture("lvl5-cheese");
    this.player.setScale(4);
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
