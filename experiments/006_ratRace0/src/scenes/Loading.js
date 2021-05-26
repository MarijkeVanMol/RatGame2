import Phaser from "../lib/phaser.js";

export default class Loading extends Phaser.Scene {
  constructor() {
    super("loading");
  }

  preload() {
    console.log("preload...");
    this.load.image("intro", "assets/gameintro.jpg");

    // GLOBAL

    // LEVEL 1
    this.load.image("bg", "assets/lone.png"); // set back to BG_busy
    this.load.image("plat0", "assets/platform0_busy.png");
    // this.load.image("plat1", "assets/platform1_busy.png");
    // this.load.image("plat2", "assets/platform2_busy.png");
    // this.load.image("plat3", "assets/platform3_busy.png");
    // this.load.image("plat4", "assets/platform4_busy.png");
    this.load.image("rat", "assets/rat_busy.png");
    this.load.image("rat-jump", "assets/rat_jump_busy.png");
    this.load.image("cheese", "assets/cheese_busy.png");

    // LEVEL 2
    this.load.audio("songBusy", "assets/sfx/busy.mp3");
    this.load.audio("jump", "assets/sfx/phaseJump1.mp3");
    this.load.audio("tttwo", "assets/sfx/threeTone2.mp3");
    this.load.audio("power", "assets/sfx/powerUp3.mp3");
    this.load.image("lvl2-background", "assets/bg_boring.png");
    this.load.image("lvl2-platform", "assets/platform_boring.png");
    this.load.image("rat", "assets/rbo_2.png");
    this.load.image("c_boring", "assets/cbo_2.png");

    // LEVEL 3
    this.load.image("platform", "assets/platform0_busy.png");
    this.load.image("platformTwo", "assets/platform1_busy.png");
    // this.load.image('background', 'assets/bg_boring.png');
    this.load.image("bunny-stand", "assets/rat_busy.png");
    this.load.image("bunny-jump", "assets/rat_jump_busy.png");
    this.load.image("cheese", "assets/cheese_busy.png");
    this.load.audio("songBusy", "assets/sfx/busy.mp3");
    this.load.audio("jump", "assets/sfx/phaseJump1.mp3");
    this.load.audio("tttwo", "assets/sfx/threeTone2.mp3");
    this.load.audio("power", "assets/sfx/powerUp3.mp3");
  }

  create() {
    console.log("loading done");
    this.scene.start("levelOne");
  }
}
