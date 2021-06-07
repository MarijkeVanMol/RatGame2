import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";

export default class LevelThirteen extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  cheeses;

  cheesesCollected = 614;

  /** @type {Phaser.GameObjects.Text} */
  cheesesCollectedText;

  constructor() {
    super("levelThirteen");
  }

  init() {
    this.cheesesCollected = 614;
    this.n = 1;
  }

  create() {
    //  GENERAL
    console.log("create level 13");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    //  CURSORS
    this.cursors = this.input.keyboard.createCursorKeys();

    //  MUSIC
    this.music = this.sound.add("lvl1-song");
    this.music.loop = true;
    this.music.play();
    this.beep = this.sound.add("lvl3-song");
    this.beep.loop = true;
    this.beep.play();
    this.jump = this.sound.add("lvl7-jump");

    //  BACKGROUND
    this.background = this.add
      .image(gameWidth, gameHeight + 200, "lvl7-bg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(3);

    //  COLLAGE
    this.collage = this.add
      .image(gameWidth, gameHeight, "lvl7-col") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(5);

    //  PLATFORMS
    this.platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 10; ++i) {
      const x = Phaser.Math.Between(0, 430);
      const y = 60 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "lvl7-plat");
      platform.scaleX = 1;
      platform.scaleY = 1;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "lvl7-cheese")
      .setScale(0.2)
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
      .text(240, 10, "614 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);

    //  CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("levelLoser");
      this.music.stop("lvl1-song");
      this.beep.stop("lvl3-song");
      this.jump.stop("lvl7-jump");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelLoser");
      this.music.stop("lvl1-song");
      this.beep.stop("lvl3-song");
      this.jump.stop("lvl7-jump");
    });
  }

  update() {
    // CSS
    document.body.className = "busy";

    //  PLAYER
    //      BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-800);
      this.player.setTexture("lvl7-cheeses");
      this.jump.play();
      this.player.setScale(0.2);
      //this.cameras.main.shake(500);
    }
    //      UNBOUNCE
    const vy = this.player.body.velocity.y; // naar beneden gaan
    if (vy > 0 && this.player.texture.key != "lvl7-cheeses") {
      // als player nr beneden ga en..
      this.player.setTexture("lvl7-cheeseb");
      this.sound.play("gs2");
      this.cameras.main.shake(700);
      this.player.setScale(0.2);
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
        //      create a carrot above the platform being
        this.addCheeseAbove(platform);
      }
    });

    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(800);
      this.sound.play("lvl7-left");
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(-800);
      this.sound.play("lvl7-right");
    } else {
      this.player.setVelocityX(0);
    }

    //  CAMERAS
    this.horizontalWrap(this.player);

    // LOOP
    // console.log(this.player.y);
    if (this.player.y < this.n * -1000) {
      this.collage.setY(this.n * -5000);
      this.n += 1;
      this.collage.setX(480);
    }
    if (this.player.y < this.n * -2000) {
      this.background.setY(this.n * -4000);
      this.n += 1;
      this.background.setX(480);
    }

    // MUSIC
    if (this.cheesesCollected <= 370) {
      this.beep.play();
    }

    //  RESTART 1
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 600) {
      this.scene.start("levelTwelve"); //scene.scene.restart(data);
      this.sound.play("lvl7-restart");
      this.music.stop("lvl1-song");
      this.beep.stop("lvl3-song");
      this.jump.stop("lvl7-jump");
    }
    //  RESTART 2
    if (this.cheesesCollected <= 0) {
      this.scene.start("levelOne");
      this.sound.play("lvl7-restart");
      this.music.stop("songBusy");
      this.beep.stop("lvl7-songBeep");
      // this.sound.play("tttwo");
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
    const cheese = this.cheeses.get(sprite.x, y, "lvl7-rat");
    cheese.setScale(2);

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
    this.cheesesCollected--;
    const value = `${this.cheesesCollected} Cheeses`;
    this.cheesesCollectedText.text = value;
    this.sound.play("caughtCheese");
    this.cameras.main.shake(700);
    this.music.play();
    this.player.setTexture("lvl7-cheeseb");
    this.player.setScale(4);
    cheese.setScale(4);
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
