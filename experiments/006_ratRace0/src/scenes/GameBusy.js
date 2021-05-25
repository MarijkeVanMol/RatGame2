// goal: parallax on everything but player
//

import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";

// /**
//  *
//  * @param {Phaser.Scene} scene
//  * @param {number} totalHeight
//  * @param {string} texture
//  * @param {number} scrollFactor
//  */

// const createAligned = (scene, totalHeight, texture, scrollFactor) =>
// {   // so we don't need to give in a count
//     const h = scene.textures.get(texture).getSourceImage().height
//     // const totalHeight = scene.scale.height * 10
//     const count = Math.ceil(totalHeight / h) * scrollFactor

//     // get width of last created image to get it to loop
//     let y = 0
//     // creates bg for as long as the screen: COUNT
//     for(let i = 0; i < count; ++i)
//     {
//         // create the bg in scene: SCENE
//     const bbg = scene.add.image(scene.scale.width, y, texture)
//                             .setOrigin(1,0)
//                             .setScrollFactor(scrollFactor)

//     y += bbg.width
//     }
// }

export default class GameBusy extends Phaser.Scene {
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
    super("gameBusy");
  }

  init() {
    this.cheesesCollected = 0;
  }

  preload() {
    this.load.image("bg", "assets/lone.png"); // set back to BG_busy

    this.load.image("plat0", "assets/platform0_busy.png");
    // this.load.image("plat1", "assets/platform1_busy.png");
    // this.load.image("plat2", "assets/platform2_busy.png");
    // this.load.image("plat3", "assets/platform3_busy.png");
    // this.load.image("plat4", "assets/platform4_busy.png");

    this.load.image("rat", "assets/rat_busy.png");
    this.load.image("rat-jump", "assets/rat_jump_busy.png");

    this.load.image("cheese", "assets/cheese_busy.png");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.load.audio("songBusy", "assets/sfx/busy.mp3");

    this.load.audio("jump", "assets/sfx/phaseJump1.mp3");

    this.load.audio("tttwo", "assets/sfx/threeTone2.mp3");

    this.load.audio("power", "assets/sfx/powerUp3.mp3");
  }

  create() {
    //  BACKGROUND
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    // const totalHeight = gameHeight * gameHeight
    //      Parallax

    // const bgCount = totalHeight / this.textures.get('bg').getSourceImage().gameHeight // to keep bg coming
    // console.log(bgCount*0.5)

    //createAligned(this, totalHeight, 'bg', 0.5) // count, number is the amount you want it to appear, if this works, do it for everything

    //          newCode: bg_bbusy.png / 480x640 size
    // const bgpar = this.add.image(gameWidth, 0, 'bg')
    //     .setOrigin(1,0)   //origin is linksonder van afbeelding
    //     .setScrollFactor(0.5)
    // this.add.image(gameWidth, bgpar.gameHeight, 'bg') // zoda ge geen zwarte balk krijgt v onder
    //     .setOrigin(1,0)   //origin is linksonder van afbeelding
    //     .setScrollFactor(0.5)

    //          exCode: for when we worked on the 480x7149 / bg_busy.png

    this.background = this.add
      .image(gameWidth, gameHeight + 45, "bg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(0.5);

    //          oldestCode: just getting image on screen
    // this.add.image(gameWidth, -6509, 'bg')
    //     .setOrigin(1,0)
    //     .setScrollFactor(0.25)

    //  PLATFORMS
    // this.platforms = this.physics.add.group();

    // this.add.image(240,320, 'platform').setScale(0.5);
    // this.physics.add.image(240,320,'platform').setScale(0.5);

    //     this.platforms.create(250, 300, 'plat0');
    //     this.platforms.create(350, 300, 'plat1').setGravity(0, 300);
    //     this.platforms.create(450, 300, 'plat2').setGravity(0, -300);
    //     this.platforms.create(550, 300, 'plat3').setGravity(0, -300);
    //     this.platforms.create(550, 300, 'plat4').setGravity(0, -300);
    //      PLAT0   PLATFORM STANDARD
    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 6; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 120 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "plat0");
      platform.scale = 0.2;
      // platform.flipY= true; doesn't work

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }
    //      PLAT1
    // this.plats1 = this.physics.add.staticGroup();

    // for (let b = 0; b <5; ++b){
    //     const x = Phaser.Math.Between(80,)
    //     const y = 150*b

    //     /** @type {Phaser.Physics.Arcade.Sprite} */
    //     const plat1 = this.plats1.create(x,y, 'plat1');
    //     plat1.scale = 1;
    //     // platform.flipY= true; doesn't work

    //     /** @type {Phaser.Physics.Arcade.StaticBody} */
    //     const bodyp1 = plat1.body;
    //     bodyp1.updateFromGameObject();
    // }
    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "rat")
      .setScale(2)
      .setGravityY(300); //300 = sweet jump, -300 tp make it go faster

    //  CARROTS
    this.cheeses = this.physics.add.group({
      classType: Cheese,
    });
    //this.carrots.get(240,320, 'carrot');

    // cheeses = this.physics.add.group({
    //     key: "cheese",
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 70 },
    //   });

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
    //this.cameras.main.setBounds(0,0, gameWidth , gameHeight* 3); // for parallax?? zoda die ni verder ga dan gameWidth
    this.cameras.main.startFollow(this.player); // follows player, also to the side
    this.cameras.main.setDeadzone(this.scale.width * 1.5); // makes sure it doesn't go 'off-screen, move to the sides'

    //  FONT
    const style = {
      color: "yellow",
      fontSize: 24,
    };
    this.cheesesCollectedText = this.add
      .text(240, 10, "0 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  update() {
    // find out from Arcade physics if the player's physics body is touching something below it
    //  PLAYER
    //      BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-500);
      this.player.setTexture("rat");

      //this.cameras.main.shake(500);
    }
    //      UNBOUNCE
    const vy = this.player.body.velocity.y; // naar beneden gaan
    if (vy > 0 && this.player.texture.key != "rat-jump") {
      // als player nr beneden ga en..
      this.player.setTexture("rat-jump");
      this.sound.play("jump");
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
        platform.y = scrollY - Phaser.Math.Between(0, 50);
        platform.body.updateFromGameObject();

        //      create a carrot above the platform being
        this.addCheeseAbove(platform);

        //      i thought that maybe the parallax could work if i placed it here, but it didn't
        // const gameWidth = this.scale.width
        // const gameHeight = this.scale.height
        // const bgpar = this.add.image(gameWidth, 0, 'bg')
        //     .setOrigin(1,0)   //origin is linksonder van afbeelding
        //     .setScrollFactor(0.5)
        // this.add.image(gameWidth, bgpar.gameHeight, 'bg') // zoda ge geen zwarte balk krijgt v onder
        //     .setOrigin(1,0)   //origin is linksonder van afbeelding
        //     .setScrollFactor(0.5)
      }
    });
    //      NEW PLATS1; try parallax: https://phaser.io/examples/v3/view/game-objects/particle-emitter/parallax

    //  PLAYER
    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-500);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(500);
    } else {
      this.player.setVelocityX(0);
    }

    //  CHEAT CODE
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("game-over");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("gameBoring");
    });

    //  CAMERAS
    //      SCREEN WRAP OF PLAYER
    this.horizontalWrap(this.player);
    //    if (this.player.y > )
    //    this.verticalWrap(this.player)

    // PLAYER LOOP
    console.log(this.player.y);
    if (this.player.y < -12000) {
      this.background.setY(-5500);
      this.background.setX(480); // dit loopt vast, te zwaar voor server schat ik
      //   this.scene.restart("gameBusy"); // easiest but what about the cheese?
      //   this.cheesesCollected = 50;
      //   this.cheesesCollectedText.text = 50;
      // player.y pos reset = nothing else's reset
      // just some experiments
      // this.player.y = 700;
      // this.platform.y = 200;
      // this.background.setScrollFactor(-0.5);
    }
    if (this.player.y < -20000) {
      this.background.setY(-5500);
      this.background.setX(480);
    }
    if (this.player.y < -22000) {
      this.background.setY(-5500);
      this.background.setX(480);
    }

    //parallax 1: this.bg.tilePositionY = this.cameras.main.scrollY *.3;

    //  TO NEXT SCENE: BORING GAME
    //  bottomPLATFORM: normal loser route
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.restart("gameBusy"); //scene.scene.restart(data);
      this.sound.play("tttwo");
    }

    //  'reward'
    if (this.cheesesCollected == 10000) {
      this.scene.start("gameBoring");
      this.sound.play("tttwo");
    }
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
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const cheese = this.cheeses.get(sprite.x, y, "cheese");

    cheese.setActive(true); // set active
    cheese.setVisible(true); // set visible

    this.add.existing(cheese);
    cheese.body.setSize(cheese.width, cheese.height); // update the physiscs body size

    this.physics.world.enable(cheese); //enables body in physics world

    return cheese;
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
    const value = `${this.cheesesCollected} Cheeses`;
    this.cheesesCollectedText.text = value;
    this.sound.play("power");
    this.cameras.main.shake(500);
    this.player.setTexture("rat-jump");
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
