// BORING: 2

//what doesn't work?
//-gravity
//-player keys

import Phaser from "../lib/phaser.js";

import Carrot from "../game/Carrot.js";

export default class LevelFour extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  platform;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots;

  carrotsCollected = 1;

  /** @type {Phaser.GameObjects.Text} */
  carrotsCollectedText;

  constructor() {
    super("levelFour");
  }

  init() {
    this.carrotsCollected = 1;
  }

  preload() {
    this.load.image("background", "assets/bg_boring.png");

    this.load.image("platform", "assets/platform_boring.png");

    this.load.image("rat", "assets/rat_boring.png");

    this.load.image("carrot", "assets/cheese_boring.png");

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    debugger;
    //////////////////////BACKGROUND////////////////////
    this.add.image(240, 320, "background").setScrollFactor(1, 0);

    //////////////////////PLATFORMS////////////////////
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const platform = this.physics.add.sprite(gameWidth, 920, "platform");
    platform.scale = 3;
    //platform.setOrigin(1);

    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const body = platform.body;
    body.updateFromGameObject();
    platform.body.allowGravity = false;

    // ================= OLD CODE ============================
    // for (let i = 0; i < 5; ++i) {
    //   const x = 240;
    //   const y = 150 * i;

    //   /** @type {Phaser.Physics.Arcade.Sprite} */
    //   const platform = this.platforms.create(x, y, "platform");
    //   platform.scale = 0.5;

    //   /** @type {Phaser.Physics.Arcade.StaticBody} */
    //   const body = platform.body;
    //   body.updateFromGameObject();
    // }

    //////////////////////PLAYER//////////////////////
    this.player = this.physics.add
      .sprite(gameWidth / 2, 600, "rat")
      .setScale(0.5)
      .setGravityY(300);

    //  CARROTS
    this.carrots = this.physics.add.group({ classType: Carrot });
    this.carrots.get(gameWidth / 2, gameHeight / 2, "carrot");

    //////////////////////COLLISIONS////////////////////
    //      PLAYER & PLATFORMs
    this.physics.add.collider(this.platform, this.player);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
    //      CARROT & PLATFORMS
    this.physics.add.collider(this.platform, this.carrots);

    //////////////////////OVERLAPS////////////////////
    //      CARROT & PLATFORMS
    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot, // called on overload
      undefined,
      this
    );

    //////////////////////CAMERAS////////////////////
    this.cameras.main.startFollow(this.player); // follows player, also to the side
    this.cameras.main.setDeadzone(this.scale.width * 1.5); // makes sure it doesn't go 'off-screen, move to the sides'

    //  ////////////////////FONT////////////////////
    const style = { color: "black", fontSize: 24 }; // color doesn't work
    this.carrotsCollectedText = this.add
      .text(240, 10, "10 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  update() {
    // find out from Arcade physics if the player's physics body is touching something below it
    //////////////////////PLAYER////////////////////
    //BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-300);
      this.player.setTexture("rat");
      this.addCarrotAbove(platform); // new carrot if touchingDown = constantly
    }
    //UNBOUNCE
    const vy = this.player.body.velocity.y; // naar beneden gaan
    if (vy > 0 && this.player.texture.key != "rat") {
      // als player nr beneden ga en..
      this.player.setTexture("rat");
    }

    //////////////////////PLATFORMS////////////////////
    //================= OLD CODE ============================
    //      NEW PLATFORMS
    // this.platforms.children.iterate((child) => {
    //   /** @type {Phaser.Physics.Arcade.Sprite} */
    //   const platform = child;

    //   const scrollY = this.cameras.main.scrollY;
    //   if (platform.y >= scrollY + 700) {
    //     platform.y = scrollY - Phaser.Math.Between(50, 100);
    //     platform.body.updateFromGameObject();

    //     // create a carrot above the platform being
    //     this.addCarrotAbove(platform);
    //   }
    // });
    //////////////////////PLAYER////////////////////
    //CURSORS MOVEMENT
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
      console.log("left!");
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    //////////////////////CHEAT CODE////////////////////
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("game-over");
    });
    //////////////////////CAMERAS////////////////////
    //      SCREEN WRAP OF PLAYER
    this.horizontalWrap(this.player);

    //////////////////////TO NEXT SCENE : FIVE////////////////////
    // ================= OLD CODE ============================
    //  bottomPLATFORM: normal loser route
    // const bottomPlatform = this.findBottomMostPlatform();
    // if (this.player.y > bottomPlatform.y + 200) {
    //   this.scene.start("gameThree");
    // }

    //  'reward'
    if (this.carrotsCollected == 2) {
      this.scene.start("gameThree");
      this.sound.play("tttwo");
    }
  }
  //////////////////////END OF UPDATE////////////////////

  //////////////////////CAMERAS////////////////////
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
  //////////////////////CARROT////////////////////
  //      MAKE SURE CARROTS APPEARS BEFORE THE REST ??
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, "carrot");

    carrot.setActive(true); // set active
    carrot.setVisible(true); // set visible

    this.add.existing(carrot);
    carrot.body.setSize(carrot.width, carrot.height); // update the physiscs body size

    this.physics.world.enable(carrot); //enables body in physics world
    this.carrot.body.bounce.y = 0.8;
    this.carrot.body.gravity.y = 200;

    return carrot;
  }

  //  CARROT
  //      COLLECT
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot); // hide from display
    this.physics.world.disableBody(carrot.body); // disable from physics world
    this.carrotsCollected++;
    const value = `${this.carrotsCollected}`;
    this.carrotsCollectedText.text = value;
  }

  //////////////////////PLATFORMS////////////////////
  // ================= OLD CODE ============================
  //   findBottomMostPlatform() {
  //     const platforms = this.platforms.getChildren();
  //     let bottomPlatform = platforms[0];

  //     for (let i = 1; i < platforms.length; i++) {
  //       const platform = platforms[i];
  //       if (platform.y < bottomPlatform.y) {
  //         continue;
  //       }
  //       bottomPlatform = platform;
  //     }
  //     return bottomPlatform;
  //   }
}
