import Phaser from "../lib/phaser.js";

export default class Loading extends Phaser.Scene {
  constructor() {
    super("loading");
  }

  preload() {
    console.log("preload...");

    // INTRO
    this.load.image("intro", "assets/intro.png");

    // START
    this.load.image("start", "assets/Start.png");

    // ======================= GLOBAL =======================
    // lvl1,3,5,7 BUSY ()
    // ==== Sound ====
    this.load.audio("global-jump", "assets/sfx/phaseJump1.mp3");
    this.load.audio("busySong", "assets/sfx/busy.mp3");
    this.load.audio("caughtCheese", "assets/sfx/powerDown.mp3");
    this.load.audio("global-down", "assets/sfx/powerUp3.mp3");
    // ==== Image ====
    this.load.image("ratCaughtCheese", "assets/");

    // lvl2,4,6,8 BORING (background, platform/ground, player, cheese)
    this.load.image("boring-bg", "assets/bg_boring.png");
    this.load.image("boring-ground", "assets/platform_boring.png");
    this.load.image("boring-rat", "assets/rbo_2.png");
    this.load.image("boring-cheese", "assets/cbo_2.png");

    // ======================= LOCAL =======================

    // START = SOUND
    // this.load.audio("theme", "assets/sfx/songStart.mp3");

    // LEVEL 1 ==== lvl1- ====
    this.load.image("lvl1-bg", "assets/lone.png"); // set back to BG_busy
    this.load.image("lvl1-plat", "assets/platform0_busy.png");
    this.load.image("lvl1-rat", "assets/rat_busy.png");
    this.load.image("lvl1-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl1-cheese", "assets/cheese_busy.png");
    this.load.image("lvl1-hitCheese", "assets/hitCheese.png");
    // ============ Sound ====
    // see global!

    // LEVEL 2 ==== lvl2- ====
    // =======

    // LEVEL 3 ==== lvl3- ====
    this.load.image("lvl3-bg", "assets/lthree.png");
    this.load.image("lvl3-plat", "assets/platform1_busy.png");
    this.load.image("lvl3-rat", "assets/rat_busy.png");
    this.load.image("lvl3-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl3-cheese", "assets/cheese_busy.png");
    this.load.image("lvl3-hitCheese", "assets/rat_r_jump.png");
    // LEVEL 3 = SOUND
    // this.load.audio("songBusy", "assets/sfx/busy.mp3");
    this.load.audio("lvl3-jump", "assets/sfx/phaseJump5.mp3");
    // this.load.audio("tttwo", "assets/sfx/threeTone2.mp3");
    // this.load.audio("power", "assets/sfx/powerUp3.mp3");
    this.load.audio("lvl3-restart", "assets/sfx/spielenTwo.mp3");

    // LEVEL 4 ==== see GLOBAL ====

    // LEVEL 5 ==== lvl5- ====
    this.load.image("lvl5-bg", "assets/lfive.png");
    this.load.image("lvl5-plat", "assets/platform2_busy.png");
    this.load.image("lvl5-rat", "assets/rat_busy.png");
    this.load.image("lvl5-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl5-cheese", "assets/cheese_busy.png");
    this.load.image("lvl5-hitCheese", "assets/hitCheese.png");
    // LEVEL 5 = SOUND
    this.load.audio("songBusy", "assets/sfx/busy.mp3");
    this.load.audio("jump", "assets/sfx/phaseJump1.mp3");
    this.load.audio("tttwo", "assets/sfx/threeTone2.mp3");
    this.load.audio("power", "assets/sfx/powerUp3.mp3");
    this.load.audio("beep", "assets/sfx/irritating.mp3");
    this.load.audio("gs1", "assets/sfx/Gscream_1.mp3");
    this.load.audio("lvl5-restart", "assets/sfx/spielenThree.mp3");

    // LEVEL 6 ==== see GLOBAL ====

    // LEVEL 7 ==== lvl7- ====
    this.load.image("lvl7-bg", "assets/lseven.png"); // set back to BG_busy
    this.load.image("lvl7-plat", "assets/platform3_busy.png");
    this.load.image("lvl7-rat", "assets/rat_lvl7.png");
    this.load.image("lvl7-cheeses", "assets/c_l7s.png");
    this.load.image("lvl7-cheeseb", "assets/c_l7b.png");
    // LEVEL 7 = SOUND
    this.load.audio("songBusy", "assets/sfx/busy.mp3");
    this.load.audio("lvl7-jump", "assets/sfx/lvl7-jump.mp3");
    this.load.audio("lvl7-left", "assets/sfx/call2.mp3");
    this.load.audio("lvl7-right", "assets/sfx/taserGun.mp3");
    this.load.audio("lvl7-songBeep", "assets/sfx/longBeep.mp3");
    this.load.audio("lvl7-call", "assets/sfx/call1.mp3");
    // this.load.audio("jump", "assets/sfx/phaseJump1.mp3");
    // this.load.audio("tttwo", "assets/sfx/threeTone2.mp3");
    // this.load.audio("power", "assets/sfx/powerUp3.mp3");
    // this.load.audio("beep", "assets/sfx/irritating.mp3");
    this.load.audio("gs1", "assets/sfx/Gscream_1.mp3");
    this.load.audio("gs2", "assets/sfx/Gscream_2.mp3");
    this.load.audio("lvl7-restart", "assets/sfx/spielenFour.mp3");

    // LEVEL 8 ==== GAMEOVER/WIN LEVEL (substitute) ====
    this.load.image("lvl8-b-bg", "assets/bg_b_eight.png");
    this.load.image("lvl8-reward", "assets/lvl8_reward.png");

    // LOADING SCREEN
    this.load.image("wrw", "assets/wait.png");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    var ratW = this.add.image(240, 320, "wrw");
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();

    progressBox.fillStyle("0x222222", 0.8);
    progressBox.fillRect(gameWidth / 5, gameHeight / 2, 320, 50);

    var loadingText = this.make.text({
      x: gameWidth / 2 - 40,
      y: gameHeight / 2 - 50,
      text: "Loading...",
      style: {
        font: "24px sans-serif",
        fill: "yellow",
      },
    });

    var percentText = this.make.text({
      x: gameWidth / 2 - 20,
      y: gameHeight / 2 + 75,
      text: "0%",
      style: {
        font: "24px sans-serif",
        fill: "yellow",
      },
    });

    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffff00, 1);
      progressBar.fillRect(
        gameWidth / 5 + 10,
        gameHeight / 2 + 10,
        300 * value,
        30
      );
    });

    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      ratW.destroy();

      // assetText.destroy();
    });
  }

  create() {
    console.log("loading done");
    this.scene.start("gameIntro");
  }
}
