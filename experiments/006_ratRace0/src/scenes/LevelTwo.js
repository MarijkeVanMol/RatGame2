import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";
//import Platform from "../game/Platform.js";

export default class LevelTwo extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  cheeses;

  cheesesCollected = 0;

  /** @type {Phaser.GameObjects.Text} */
  cheesesCollectedText;

  constructor() {
    super("levelTwo");
  }

  init() {
    this.cheesesCollected = 0;
    this.CheeseCount = 0;
  }

  preload() {
    this.load.image("background", "assets/bg_boring.png");

    this.load.image("platform", "assets/platform_boring.png");

    this.load.image("rat", "assets/rbo_2.png");

    this.load.image("c_boring", "assets/cbo_2.png");

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
    const y = 630;
    // for (let i = 0; i < 5; ++i) {
    //   const x = 240;
    //   const y = 500;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const platform = this.platforms.create(x, y, "platform");
    // platform.scale = 0.5;
    platform.scaleX = 1.5;
    platform.scaleY = 2;

    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const body = platform.body;
    body.updateFromGameObject();
    // }

    //  PLAYER
    this.player = this.physics.add.sprite(240, 320, "rat").setScale(0.3);

    //  CHEESES
    this.cheeses = this.physics.add.group({ classTYpe: Cheese });

    //this.cheeses.get(240,320, 'cheese');

    //  COLLISIONS
    //      PLAYER & PLATFORMs
    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = true; // TRUE  FOR EVEYRTHING!!! (leveel)
    this.player.body.checkCollision.right = true; // TRUE  FOR EVEYRTHING!!! (leveel)
    //      Cheese & PLATFORMS
    this.physics.add.collider(this.platforms, this.cheeses);
    //  OVERLAPS
    //      Cheese & PLAYER
    this.physics.add.overlap(
      this.player,
      this.cheeses,
      this.handleCollectCheese, // called on overload
      undefined,
      this
    );

    //  CAMERAS
    // this.cameras.main.startFollow(this.player); // follows player, also to the side
    this.cameras.main.setDeadzone(this.scale.width * 1.5); // makes sure it doesn't go 'off-screen, move to the sides'

    //  FONT
    const style = { color: "black", fontSize: 24 }; // color doesn't work
    this.cheesesCollectedText = this.add
      .text(240, 10, "0 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
    //.setFont("Arial"); //sets font -> WERKT NOG NIET, NICE TO HAVE
  }

  update() {
    document.body.className = "boring";
    //visibility: .body}
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
      this.player.setVelocityX(-10);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(10);
    } else {
      this.player.setVelocityX(0);
    }

    // console.log(this.CheeseCount);
    // console.log(this.cheesesCollected);
    // DROP CARROT CODE
    if (this.CheeseCount == this.cheesesCollected) {
      this.addCheeseAbove(this.player);
      this.CheeseCount++;
    }

    //      CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("game-over");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelThree");
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
    if (this.cheesesCollected >= 10000) {
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
  addCheeseAbove(sprite) {
    // ======================= ORIGINAL CODE =====================
    // const y = sprite.y - sprite.displayHeight;
    /** @type {Phaser.Physics.Arcade.Sprite} */
    // ======================== ATTEMPT ==========================
    const gameWidth = this.scale.width;
    for (let i = 75; i < gameWidth; i++) {
      const y = sprite.y - sprite.displayHeight;

      // const x = sprite.x + i;
      // if (i > 480) {
      //   i = 0

      const cheese = this.cheeses.get(sprite.x + i, y - 600, "c_boring");

      if (sprite.x + i > gameWidth) {
        sprite.x - i;
      }

      // =================== ORIGINAL CODE ====================================
      // const cheese = this.cheeses.get(sprite.x, y - 600, "c_boring");
      // const cheese = this.cheeses.get(sprite.x - 100, y - 600, "c_boring");

      cheese.setActive(true); // set active
      cheese.setVisible(true); // set visible

      this.add.existing(cheese);
      cheese.body.setSize(cheese.width, cheese.height); // update the physiscs body size
      // .setGravityY(10);

      this.physics.world.enable(cheese); //enables body in physics world
      // console.log(this.sprite.x);
      return cheese;
    }
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
    const value = `${this.cheesesCollected}`;
    this.cheesesCollectedText.text = value;
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
