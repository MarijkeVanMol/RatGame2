import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";
//import Platform from "../game/Platform.js";

export default class LevelFour extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  cheeses;

  cheesesCollected = 176;

  /** @type {Phaser.GameObjects.Text} */
  cheesesCollectedText;

  constructor() {
    super("levelFour");
  }

  init() {
    this.cheesesCollected = 176;
    this.CheeseCount = 176;
  }

  create() {
    console.log("create level 4");
    this.cursors = this.input.keyboard.createCursorKeys();

    //  BACKGROUND
    this.add.image(240, 320, "boring-bg").setScrollFactor(1, 0);

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
    const platform = this.platforms.create(x, y, "boring-ground");
    // platform.scale = 0.5;
    platform.scaleX = 1.5;
    platform.scaleY = 2;

    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const body = platform.body;
    body.updateFromGameObject();
    // }

    //  PLAYER
    this.player = this.physics.add.sprite(240, 320, "lvl4-rat").setScale(0.3);

    //  CHEESES
    this.cheeses = this.physics.add.group({ classType: Cheese });

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
    const style = { color: "black", font: "24px sans-serif" }; // color doesn't work
    this.cheesesCollectedText = this.add
      .text(240, 10, "176 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
    //.setFont("Arial"); //sets font -> WERKT NOG NIET, NICE TO HAVE

    //      CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("levelLoser");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelFive");
    });
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
      this.player.setVelocityX(-8);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(8);
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
    if (this.cheesesCollected >= 187) {
      this.scene.start("levelFive");
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
  addCheeseAbove(player) {
    const cheeseX = Phaser.Math.Between(0, this.scale.width);
    const cheeseY = player.y - 300;
    this.cheeses.create(cheeseX, cheeseY, "lvl4-cheese");
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
