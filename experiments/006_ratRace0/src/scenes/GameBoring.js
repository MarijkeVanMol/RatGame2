import Phaser from "../lib/phaser.js";

import Carrot from "../game/Carrot.js";
//import Platform from "../game/Platform.js";

export default class GameBoring extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots;

  carrotsCollected = 0;

  /** @type {Phaser.GameObjects.Text} */
  carrotsCollectedText;

  constructor() {
    super("gameBoring");
  }

  init() {
    this.carrotsCollected = 0;
    this.CheeseCount = 0;
  }

  preload() {
    this.load.image("background", "assets/bg_boring.png");

    this.load.image("platform", "assets/platform_boring.png");

    this.load.image("bunny-stand", "assets/rat_boring.png");
    this.load.image("bunny-jump", "assets/rat_boring.png");

    this.load.image("carrot", "assets/cheese_boring.png");

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    //  BACKGROUND
    this.add.image(240, 320, "background").setScrollFactor(1, 0);

    // this.add.image(240,320, 'platform').setScale(0.5);
    // this.physics.add.image(240,320,'platform').setScale(0.5);

    this.platforms = this.physics.add.staticGroup();
    //  PLATFORMS
    const x = 240;
    const y = 330;
    // for (let i = 0; i < 5; ++i) {
    //   const x = 240;
    //   const y = 500;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const platform = this.platforms.create(x, y, "platform");
    // platform.scale = 0.5;
    platform.scaleX = 1.5;
    platform.scaleY = 0.5;

    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const body = platform.body;
    body.updateFromGameObject();
    // }

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "bunny-stand")
      .setScale(0.1);

    //  CARROTS
    this.carrots = this.physics.add.group({ classTYpe: Carrot });

    //this.carrots.get(240,320, 'carrot');

    //  COLLISIONS
    //      PLAYER & PLATFORMs
    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = true; // TRUE  FOR EVEYRTHING!!! (leveel)
    this.player.body.checkCollision.right = true; // TRUE  FOR EVEYRTHING!!! (leveel)
    //      CARROT & PLATFORMS
    this.physics.add.collider(this.platforms, this.carrots);
    //  OVERLAPS
    //      CARROT & PLAYER
    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot, // called on overload
      undefined,
      this
    );

    //  CAMERAS
    this.cameras.main.startFollow(this.player); // follows player, also to the side
    this.cameras.main.setDeadzone(this.scale.width * 1.5); // makes sure it doesn't go 'off-screen, move to the sides'

    //  FONT
    const style = { color: "black", fontSize: 24 }; // color doesn't work
    this.carrotsCollectedText = this.add
      .text(240, 10, "0 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
    //.setFont("Arial"); //sets font -> WERKT NOG NIET, NICE TO HAVE
  }

  update() {
    //========== Bounce and unbounce disabled to make game more boring ==========
    // find out from Arcade physics if the player's physics body is touching something below it
    //  PLAYER
    //      BOUNCE
    // const touchingDown = this.player.body.touching.down;
    // if (touchingDown) {
    //   this.player.setVelocityY(-300);
    //   this.player.setTexture("bunny-jump");
    // }
    //      UNBOUNCE
    // const vy = this.player.body.velocity.y; // naar beneden gaan
    // if (vy > 0 && this.player.texture.key != "bunny-stand") {
    //   // als player nr beneden ga en..
    //   this.player.setTexture("bunny-stand");
    // }
    //=============================================================================

    //  PLATFORMS -> NIET NODIG,ER IS MAAR 1 PLATFORM
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
    //=================================================================================
    //  PLAYER
    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-20);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(20);
    } else {
      this.player.setVelocityX(0);
    }

    // console.log(this.CheeseCount);
    // console.log(this.carrotsCollected);
    // DROP CARROT CODE
    if (this.CheeseCount == this.carrotsCollected) {
      this.addCarrotAbove(this.player);
      this.CheeseCount++;
    }

    //      CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("game-over");
    });
    //  CAMERAS
    //      SCREEN WRAP OF PLAYER
    this.horizontalWrap(this.player);

    //  TO NEXT SCENE: BUSY GAME
    //  bottomPLATFORM: normal loser route
    // const bottomPlatform = this.findBottomMostPlatform();
    // if (this.player.y > bottomPlatform.y + 200) {
    //   this.scene.start("gameThree");
    // }

    //  'reward'
    if (this.carrotsCollected >= 10000) {
      this.scene.start("gameThree");
      //this.sound.play("tttwo"); geen muziek want BORING
    }

    //  END OF UPDATE: beware of the accolade below!!
  }

  //      END OF UPDATE (============== hier starten alle aparte functies ==============)
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
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y - 200, "carrot");

    carrot.setActive(true); // set active
    carrot.setVisible(true); // set visible

    this.add.existing(carrot);
    carrot.body.setSize(carrot.width, carrot.height); // update the physiscs body size

    this.physics.world.enable(carrot); //enables body in physics world

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

  //  PLATFORMS -> not used
  // findBottomMostPlatform() {
  //   const platforms = this.platforms.getChildren();
  //   let bottomPlatform = platforms[0];

  //   for (let i = 1; i < platforms.length; i++) {
  //     const platform = platforms[i];
  //     if (platform.y < bottomPlatform.y) {
  //       continue;
  //     }
  //     bottomPlatform = platform;
  //   }
  //   return bottomPlatform;
  // }
}