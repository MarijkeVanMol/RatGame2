import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";
//import Platform from "../game/Platform.js";

export default class LevelEight extends Phaser.Scene {
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
    super("levelEight");
  }

  init() {
    this.cheesesCollected = 0;
    this.CheeseCount = 0;
  }

  create() {
    console.log("create level 8");
    this.cursors = this.input.keyboard.createCursorKeys();

    //  BACKGROUND
    this.add.image(240, 320, "lvl8-b-bg").setScrollFactor(1, 0);

    //    GROUND
    this.platforms = this.physics.add.staticGroup();
    const x = 240;
    const y = 630;
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const platform = this.platforms.create(x, y, "boring-ground");
    platform.scaleX = 1.5;
    platform.scaleY = 2;
    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const body = platform.body;
    body.updateFromGameObject();

    //  PLAYER
    this.player = this.physics.add.sprite(240, 320, "boring-rat").setScale(0.3);

    //  CHEESES
    this.cheeses = this.physics.add.group({ classType: Cheese });

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
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    //  FONT
    // const style = { color: "black", font: "24px sans-serif" }; // color doesn't work
    // this.cheesesCollectedText = this.add
    //   .text(240, 10, "0 Cheeses", style)
    //   .setScrollFactor(0)
    //   .setOrigin(0.5, 0);
    //.setFont("Arial"); //sets font -> WERKT NOG NIET, NICE TO HAVE

    //      CHEAT CODE
    // this.input.keyboard.once("keydown-L", () => {
    //   this.scene.start("game-over");
    // });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelOne");
    });
  }

  update() {
    document.body.className = "busy";

    //  PLAYER
    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-1);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(1);
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
    //   this.scene.restart("levelOne");
    // }

    //  'reward'
    if (this.cheesesCollected >= 1) {
      this.scene.start("gameIntro");
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
    this.cheeses.create(cheeseX, cheeseY, "lvl8-reward").setScale(0.2);
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
    // const value = `${this.cheesesCollected}`;
    // this.cheesesCollectedText.text = value;
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
