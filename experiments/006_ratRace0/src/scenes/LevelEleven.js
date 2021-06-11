import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";

export default class LevelEleven extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  cheeses;

  cheesesCollected = 486;

  /** @type {Phaser.GameObjects.Text} */
  cheesesCollectedText;

  constructor() {
    super("levelEleven");
  }

  init() {
    this.cheesesCollected = 486;
    this.n = 1;
  }

  create() {
    // GENERAL
    console.log("create level 11");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    //  CURSORS
    this.cursors = this.input.keyboard.createCursorKeys();

    //  MUSIC
    this.music = this.sound.add("lvl5-song");
    this.music.loop = true;
    this.music.play();

    //  BACKGROUND
    this.background = this.add
      .image(gameWidth, gameHeight + 40, "lvl5-bg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(10);

    // COLLAGE
    this.collage = this.add
      .image(gameWidth, gameHeight + 45, "lvl5-col") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(0.25);

    // lbg
    this.lbackground = this.add
      .image(gameWidth, gameHeight + 45, "lvl11-lbg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(2);

    // pbg
    this.pbackground = this.add
      .image(gameWidth, gameHeight + 45, "lvl11-pbg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(2);

    // PLATFORMS
    this.platforms = this.physics.add.staticGroup();
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(0, 480);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "lvl11-plat");
      platform.scaleX = 1;
      platform.scaleY = 1;
      // platform.flipY= true; doesn't work

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "lvl5-rat")
      .setScale(3)
      .setGravityY(300); //300 = sweet jump, -300 tp make it go faster

    //  CHEESE
    this.cheeses = this.physics.add.group({
      classTYpe: Cheese,
    });

    //  COLLISIONS
    //      PLAYER & PLATFORMS
    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = true;
    this.player.body.checkCollision.right = true;

    this.physics.add.collider(this.platforms, this.cheeses);
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
      .text(240, 10, "486 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);

    //  CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("levelLoser");
      this.music.stop("lvl5-song");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelTwelve");
      this.music.stop("lvl5-song");
    });
  }

  update() {
    document.body.className = "bu11";
    //  PLAYER
    //      BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-500);
      this.player.setTexture("lvl5-rat");

      this.cameras.main.shake(500);
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
    // console.log(this.player.y);
    if (this.player.y < this.n * -500) {
      this.background.setY(this.n * -6000);
      this.n += 1;
      this.background.setX(480);
    }
    if (this.player.y < this.n * -6000) {
      this.collage.setY(this.n * -12000);
      this.n += 1;
      this.collage.setX(480);
    }
    if (this.player.y < this.n * -320) {
      this.lbackground.setY(this.n * -640);
      this.n += 1;
      this.lbackground.setX(480);
    }
    if (this.player.y < this.n * -320) {
      this.pbackground.setY(this.n * -6400);
      this.n += 1;
      this.pbackground.setX(480);
    }

    //  TO NEXT SCENE:
    //  Restart
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 100) {
      this.scene.start("levelTen"); //scene.scene.restart(data);
      this.sound.play("lvl5-restart");
      this.music.stop("lvl5-song");
    }
    //  Level Six
    if (this.cheesesCollected >= 605) {
      this.scene.start("levelTwelve");
      this.sound.play("caughtCheese");
      this.music.stop("lvl5-song");
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
    this.player.setScale(1, 3);
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
