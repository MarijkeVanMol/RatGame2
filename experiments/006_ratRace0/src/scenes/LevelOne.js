// goal: parallax on everything but player
//

import Phaser from "../lib/phaser.js";

import Cheese from "../game/Cheese.js";

export default class LevelOne extends Phaser.Scene {
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  cheeses;

  cheesesCollected = 0;
  n = 1;

  /** @type {Phaser.GameObjects.Text} */
  cheesesCollectedText;

  constructor() {
    super("levelOne");
  }

  init() {
    this.cheesesCollected = 0;
    this.n = 1;
  }

  create() {
    console.log("create level 1");

    // CURSORS
    this.cursors = this.input.keyboard.createCursorKeys();

    // GENERAL
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    // MUSIC
    this.music = this.sound.add("lvl1-song");
    this.music.loop = true;

    //  BACKGROUND
    this.background = this.add
      .image(gameWidth, gameHeight + 45, "lvl1-bg") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(0.5);

    // COLLAGE
    this.collage = this.add
      .image(gameWidth, gameHeight + 45, "lvl1-col") // zoda ge geen zwarte balk krijgt v onder
      .setOrigin(1) //origin is linksonder van afbeelding
      .setScrollFactor(2);

    //  PLATFORMS
    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 6; ++i) {
      const x = Phaser.Math.Between(0, 480);
      const y = 120 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(x, y, "lvl1-plat");
      platform.scaleX = 1.5;
      platform.scaleY = 1.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;
      body.updateFromGameObject();
    }

    //  PLAYER
    this.player = this.physics.add
      .sprite(240, 320, "lvl1-rat")
      .setScale(2)
      .setGravityY(300); //300 = sweet jump, -300 tp make it go faster

    //  CHEESES
    this.cheeses = this.physics.add.group({
      classType: Cheese,
    });

    //  COLLISIONS
    //      PLAYER & PLATFORMS
    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.physics.add.collider(this.platforms, this.cheeses);
    //  OVERLAPS
    //      CHEESE & PLAYER (handles overlap between carrot and player)
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
      .text(240, 10, "0 Cheeses", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);

    //  CHEAT CODES
    this.input.keyboard.once("keydown-L", () => {
      this.scene.start("levelLoser");
      this.music.stop("lvl1-song");
    });
    this.input.keyboard.once("keydown-N", () => {
      this.scene.start("levelTwo");
      this.music.stop("lvl1-song");
    });
  }

  update() {
    document.body.className = "busy";
    // find out from Arcade physics if the player's physics body is touching something below it
    //  PLAYER
    //      BOUNCE
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-500);
      this.player.setTexture("lvl1-ratj");
      this.sound.play("global-jump");
    }
    //      UNBOUNCE
    const vy = this.player.body.velocity.y; // naar beneden gaan
    if (vy > 0 && this.player.texture.key != "lvl1-rat") {
      // als player nr beneden ga en..
      this.player.setTexture("lvl1-rat");
      this.sound.play("global-down");
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
        this.addCheeseAbove(platform);
      }
    });
    //  PLAYER
    //      CURSORS MOVEMENT
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-500);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(500);
    } else {
      this.player.setVelocityX(0);
    }

    //  CAMERAS
    //      SCREEN WRAP OF PLAYER
    this.horizontalWrap(this.player);

    // COLLAGE LOOP
    /*
    als de speler boven Y = n*-3000 komt wordt de collage opnieuw gezet en n wordt veranderd naar n+1.
    Bijvoorbeeld: n = 1: als de speler boven Y = -3000 komt wordt de collage op positie -6000 gezet (dit omdat de collage dubbel zo snel beweegt) en n wordt 2 
    daarna: n = 2:  als de speler boven Y = -6000 komt wordt de collage op positie -12000 gezet (dit omdat de collage dubbel zo snel beweegt) en n wordt 3  
    daarna: n = 3:  als de speler boven Y = -9000 komt wordt de collage op positie -18000 gezet (dit omdat de collage dubbel zo snel beweegt) en n wordt 4 etc.
    */
    //console.log(this.player.y); //print de Y positie van de speler in de console log
    if (this.player.y < this.n * -3000) {
      this.collage.setY(this.n * -6000);
      this.n += 1;
      this.collage.setX(480);
    }

    //  TO NEXT SCENE: BORING GAME
    //  bottomPLATFORM: normal loser route
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.restart("levelOne"); //scene.scene.restart(data);
      this.sound.play("global-down");
    }

    if (this.cheesesCollected == 15) {
      this.music.play();
    }
    //  'reward'
    if (this.cheesesCollected == 50) {
      this.scene.start("levelTwo");
      this.sound.play("caughtCheese");
      this.music.stop("songBusy");
    }
  }
  // ======================= END OF UPDATE =======================(hier starten alle aparte functies)

  //  CAMERA: HORIZONTAL WRAP; if outside left side of screen, appears on right of screen
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

  //  CHEESE (drop cheese above, instead of plat)
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addCheeseAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const cheese = this.cheeses.get(sprite.x, y, "lvl1-cheese");

    cheese.setActive(true); // set active
    cheese.setVisible(true); // set visible

    this.add.existing(cheese);
    cheese.body.setSize(cheese.width, cheese.height); // update the physiscs body size

    this.physics.world.enable(cheese); //enables body in physics world

    return cheese;
  }

  //  CHEESE
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
    // this.cameras.main.shake(500);
    this.player.setTexture("lvl1-hitCheese");
  }

  //  PLAT
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
