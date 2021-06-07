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
    // ========== Shorts
    this.load.audio("global-jump", "assets/sfx/phaseJump1.mp3");
    this.load.audio("caughtCheese", "assets/sfx/powerDown.mp3");
    this.load.audio("global-down", "assets/sfx/powerUp3.mp3");

    // ==== Image ====
    this.load.image("ratCaughtCheese", "assets/");

    // lvl2,4,6,8 BORING (background, platform/ground, player, cheese)
    this.load.image("boring-bg", "assets/bg_boring.png");
    this.load.image("boring-ground", "assets/platform_boring.png");

    // ======================= LOCAL =======================

    // START = SOUND
    // this.load.audio("theme", "assets/sfx/songStart.mp3");

    // LEVEL 1 ==== lvl1- ====
    this.load.image("lvl1-bg", "assets/lvl1-bg.png");
    this.load.image("lvl1-col", "assets/lvl1-collage.png"); // set back to BG_busy
    this.load.image("lvl1-plat", "assets/lvl1-plat1.png");
    this.load.image("lvl1-rat", "assets/rat_busy.png");
    this.load.image("lvl1-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl1-cheese", "assets/cheese_busy.png");
    this.load.image("lvl1-hitCheese", "assets/hitCheese.png");
    // ============ Sound ====
    this.load.audio("lvl1-song", "assets/sfx/busy.mp3");

    // LEVEL 2 ==== lvl2- ====
    this.load.image("lvl2-rat", "assets/rbo_1.png");
    this.load.image("lvl2-cheese", "assets/cbo_1.png");

    // LEVEL 3 ==== lvl3- ====
    this.load.image("lvl3-bg", "assets/lvl3-bg.png");
    this.load.image("lvl3-col", "assets/lvl3-collage.png");
    this.load.image("lvl3-plat", "assets/lvl3-plat1.png");
    this.load.image("lvl3-rat", "assets/rat_busy.png");
    this.load.image("lvl3-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl3-cheese", "assets/cheese_busy.png");
    this.load.image("lvl3-hitCheese", "assets/rat_r_jump.png");
    // LEVEL 3 = SOUND
    this.load.audio("lvl3-restart", "assets/sfx/spielenTwo.mp3");
    this.load.audio("lvl3-song", "assets/sfx/longBeep_.mp3");

    // // PARALLAX DELETE/CHANGE LATER
    // this.load.image("wrw", "assets/wait.png");

    // LEVEL 4 ==== lvl4- ====
    this.load.image("lvl4-rat", "assets/rbo_2.png");
    this.load.image("lvl4-cheese", "assets/cbo_2.png");

    // LEVEL 5 ==== lvl5- ====
    this.load.image("lvl5-bg", "assets/lvl5-bg.png");
    this.load.image("lvl5-col", "assets/lvl5-collage.png");
    this.load.image("lvl5-plat", "assets/lvl5-plat1.png");
    this.load.image("lvl5-rat", "assets/rat_busy.png");
    this.load.image("lvl5-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl5-cheese", "assets/cheese_busy.png");
    this.load.image("lvl5-hitCheese", "assets/hitCheese.png");
    // LEVEL 5 = SOUND
    this.load.audio("global-down", "assets/sfx/powerUp3.mp3"); // GLOBAL DOWN!! global-down

    this.load.audio("lvl5-song", "assets/sfx/lvl5-newSong.mp3");
    this.load.audio("lvl5-restart", "assets/sfx/spielenThree.mp3");
    this.load.audio("gs1", "assets/sfx/Gscream_1_.mp3");

    // LEVEL 6 ==== see GLOBAL ====
    this.load.image("lvl6-rat", "assets/rbo_3.png");
    this.load.image("lvl6-cheese", "assets/cbo_3.png");

    // LEVEL 7 ==== lvl7- ====
    this.load.image("lvl7-bg", "assets/lvl7-bg.png"); // set back to BG_busy
    this.load.image("lvl7-col", "assets/lvl7-collage.png");
    this.load.image("lvl7-plat", "assets/lvl7-plat.png");
    this.load.image("lvl7-rat", "assets/rat_lvl7.png");
    this.load.image("lvl7-cheeses", "assets/c_l7s.png");
    this.load.image("lvl7-cheeseb", "assets/c_l7b.png");
    // LEVEL 7 = SOUND
    this.load.audio("lvl1-song", "assets/sfx/busy.mp3");
    this.load.audio("lvl3-song", "assets/sfx/longBeep_.mp3");

    this.load.audio("lvl7-jump", "assets/sfx/lvl7-jump_.mp3");
    this.load.audio("lvl7-left", "assets/sfx/call2_.mp3");
    this.load.audio("lvl7-right", "assets/sfx/taserGun_.mp3");
    this.load.audio("lvl7-call", "assets/sfx/call1_.mp3");
    this.load.audio("gs1", "assets/sfx/Gscream_1_.mp3");
    this.load.audio("gs2", "assets/sfx/Gscream_2_.mp3");
    this.load.audio("lvl7-restart", "assets/sfx/spielenFour_.mp3");

    // LEVEL 8 ==== lvl8-/lvl4- ====
    this.load.image("lvl8-rat", "assets/rbo_2.png");
    this.load.image("lvl8-cheese", "assets/cbo_2.png");

    // LEVEL 9 ==== lvl8-/lvl4- ====
    this.load.image("lvl9-bg", "assets/lvl3-bg.png");
    this.load.image("lvl9-col", "assets/lvl3-collage.png");
    this.load.image("lvl9-plat", "assets/lvl3-plat1.png");
    this.load.image("lvl9-rat", "assets/rat_busy.png");
    this.load.image("lvl9-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl9-cheese", "assets/cheese_busy.png");
    this.load.image("lvl9-hitCheese", "assets/rat_r_jump.png");
    // LEVEL 9 = SOUND
    this.load.audio("lvl9-restart", "assets/sfx/spielenTwo.mp3");
    this.load.audio("lvl3-song", "assets/sfx/longBeep_.mp3");

    // LEVEL L ==== GAMEOVER/WIN LEVEL (substitute) ====
    this.load.image("lvll-bg", "assets/lvl8-bg.png");
    this.load.image("lvll-cheese", "assets/lvl8-cheese.png");
    this.load.image("lvll-player", "assets/lvl8-player.png");
    this.load.image("lvll-ground", "assets/lvl8-ground.png");
    // LEVEL 8 = SOUND
    this.load.audio("lvll-song", "assets/sfx/game-over_.mp3");

    // LOADING SCREEN
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

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
    });
  }

  create() {
    console.log("loading done");
    this.scene.start("gameIntro");
  }
}
