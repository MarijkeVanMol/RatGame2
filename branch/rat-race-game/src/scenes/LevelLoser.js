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
    super("levelLoser");
  }

  init() {
    this.cheesesCollected = 0;
    this.CheeseCount = 0;
  }

  create() {
    console.log("create level loser");
    this.cursors = this.input.keyboard.createCursorKeys();

    //  BACKGROUND
    this.add.image(240, 320, "lvll-bg").setScrollFactor(1, 0);

    //  SOUND
    this.music = this.sound.add("lvll-song");
    this.music.play();

    //    GROUND
    this.platforms = this.physics.add.staticGroup();
    const x = 240;
    const y = 630;
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const platform = this.platforms.create(x, y, "lvll-ground");
    platform.scaleX = 1.5;
    platform.scaleY = 2;
    /** @type {Phaser.Physics.Arcade.StaticBody} */
    const body = platform.body;
    body.updateFromGameObject();

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "lvll-player")
      .setScale(1.5);

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
    const style = { color: "yellow", font: "24px sans-serif" }; // color doesn't work
    this.cheesesCollectedText = this.add
      .text(240, 10, "The last cheese!", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
    //.setFont("Arial"); //sets font -> WERKT NOG NIET, NICE TO HAVE

    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelOne");
    });
  }

  update() {
    document.body.className = "busy";

    //  SOUND
    this.music.loop = true;

    //  PLAYER
    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-1);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(1);
    } else {
      this.player.setVelocityX(0);
    }
    // DROP CARROT CODE
    if (this.CheeseCount == this.cheesesCollected) {
      this.addCheeseAbove(this.player);
      this.CheeseCount++;
    }

    //  CAMERAS
    //      SCREEN WRAP OF PLAYER
    this.horizontalWrap(this.player);

    //  'reward'
    if (this.cheesesCollected >= 1) {
      this.scene.start("levelOne");
      this.music.stop("lvll-song");
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
    this.cheeses.create(cheeseX, cheeseY, "lvll-cheese").setScale(0.5);
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
  }
}
