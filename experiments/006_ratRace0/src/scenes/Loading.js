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
    // Jump levels 1,3,5,7
    this.load.audio("global-jump", "assets/sfx/phaseJump1.mp3");
    // Jump levels 9,11,13
    // this.load.audio("global-jump2", "assets/sfx/phaseJump5.mp3");

    this.load.audio("caughtCheese", "assets/sfx/powerDown.mp3");
    this.load.audio("global-down", "assets/sfx/powerUp3.mp3");

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
    // plays with BOUNCE: global-jump
    // plays with UNBOUNCE & findBottomMostPlatform: global-down
    // plays with >= 50 & handleCollectCheese: caughtCheese
    // ============ MUSIC ====
    // plays with >= 15
    this.load.audio("lvl1-song", "assets/sfx/busy.mp3");

    // LEVEL 2 ==== lvl2- ====
    this.load.image("lvl2-rat", "assets/rbo_1.png");
    this.load.image("lvl2-cheese", "assets/cbo_1.png");

    // LEVEL 3 ==== lvl3- ====
    this.load.image("lvl3-bg", "assets/lvl3-bg.png");
    this.load.image("lvl3-col", "assets/lvl3-collage.png");
    this.load.image("lvl3-lbg", "assets/lvl3-L.png");
    this.load.image("lvl3-plat", "assets/lvl3-plat1.png");
    this.load.image("lvl3-rat", "assets/rat_busy.png");
    this.load.image("lvl3-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl3-cheese", "assets/cheese_busy.png");
    this.load.image("lvl3-hitCheese", "assets/rat_r_jump.png");
    // ============ Sound ====
    // plays with BOUNCE & findBottomMostPlatform: global-down
    // plays with UNBOUNCE: global-jump
    // plays with >= 176 & handleCollectCheese & findBottomMostPlatform: caughtCheese
    this.load.audio("lvl3-restart", "assets/sfx/lvl3-restart.mp3");
    // ============ MUSIC ====
    // plays with create: lvl1music
    // plays with >= 15
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
    // ============ Sound ====
    this.load.audio(
      "lvl5-handcolcheese",
      "assets/sfx/lvl5-handlecollectcheese.mp3"
    );
    this.load.audio("lvl5-aca", "assets/sfx/lvl5-addCheeseAbove.mp3");
    this.load.audio("lvl5-bounce", "assets/sfx/lvl5-bounce.mp3");
    this.load.audio("lvl5-unbounce", "assets/sfx/lvl5-unbounce.mp3");
    this.load.audio("lvl5-restart", "assets/sfx/lvl5-restart.mp3");
    // ============ MUSIC ====
    this.load.audio("lvl5-song", "assets/sfx/lvl5-songNotifications.mp3");

    // DELETE!! this.load.audio("gs1", "assets/sfx/Gscream_1_.mp3");

    // LEVEL 6 ==== see GLOBAL ====
    this.load.image("lvl6-rat", "assets/rbo_3.png");
    this.load.image("lvl6-cheese", "assets/cbo_3.png");

    // LEVEL 7 ==== lvl7- ====
    this.load.image("lvl7-bg", "assets/lvl7-bg.png"); // set back to BG_busy
    this.load.image("lvl7-col", "assets/lvl7-collage.png");
    this.load.image("lvl7-lbg", "assets/lvl7-L.png");
    this.load.image("lvl7-plat", "assets/lvl7-plat.png");
    this.load.image("lvl7-rat", "assets/rat_busy.png");
    this.load.image("lvl7-cheeses", "assets/c_l7s.png");
    this.load.image("lvl7-cheeseb", "assets/c_l7b.png");
    // ============ Sound ====
    this.load.audio("lvl7-aca", "assets/sfx/lvl7-addCheeseAbove.mp3");
    this.load.audio("lvl7-bounce", "assets/sfx/lvl7-bounce.mp3");
    this.load.audio("lvl7-jump", "assets/sfx/lvl7-jump_.mp3");
    this.load.audio("lvl7-left", "assets/sfx/lvl7-left.mp3");
    this.load.audio("lvl7-loop", "assets/sfx/lvl7-loop.mp3");
    this.load.audio("lvl7-hcc", "assets/sfx/lvl7-handlecollectcheese.mp3");
    this.load.audio("lvl7-unbounce", "assets/sfx/lvl7-unbounce.mp3");
    this.load.audio("lvl7-restart", "assets/sfx/lvl7-restart.mp3");
    // ============ Music ====
    //this.load.audio("lvl7-1song", "assets/sfx/busy.mp3");
    this.load.audio("lvl7-3song", "assets/sfx/longBeep_.mp3");
    //this.load.audio("lvl7-5song", "assets/sfx/lvl5-songNotifications.mp3");
    this.load.audio("lvl7-song", "assets/sfx/lvl7-songScreamandCalling.mp3");

    // LEVEL 8 ==== lvl8-/lvl4- ====
    this.load.image("lvl8-rat", "assets/rbo_2.png");
    this.load.image("lvl8-cheese", "assets/cbo_2.png");

    // LEVEL 9 ==== lvl9-/lvl3- ====
    this.load.image("lvl9-bg", "assets/lvl3-bg.png");
    this.load.image("lvl9-col", "assets/lvl3-collage.png");
    this.load.image("lvl9-pbg", "assets/lvl9-platBG.png");
    this.load.image("lvl9-plat", "assets/lvl9-plat.png");
    this.load.image("lvl9-rat", "assets/rat_busy.png");
    this.load.image("lvl9-ratj", "assets/rat_jump_busy.png");
    this.load.image("lvl9-cheese", "assets/cheese_busy.png");
    this.load.image("lvl9-hitCheese", "assets/rat_r_jump.png");
    // LEVEL 9 = SOUND
    this.load.audio("lvl9-restart", "assets/sfx/lvl9-restart.mp3");
    this.load.audio("lvl3-song", "assets/sfx/longBeep_.mp3");

    // LEVEL 10 ==== lvl10-/lvl2- ====
    // see level 2?

    // LEVEL 11 ==== lvl11-/lvl6- ====
    this.load.image("lvl11-lbg", "assets/lvl11-L.png");
    this.load.image("lvl11-plat", "assets/lvl11-plat.png");
    this.load.image("lvl11-pbg", "assets/lvl11-platBG.png");

    // LEVEL 12 ==== lvl12-/lvl6- ====
    // see level 6?

    // LEVEL 13 ==== lvl13-/lvl7- ====
    this.load.image("lvl13-plat", "assets/lvl13-plat.png");
    this.load.image("lvl13-pbg", "assets/lvl13-platBG.png");

    this.load.image("lvl13-rat", "assets/rat_lvl7.png");
    this.load.image("lvl13-cheeses", "assets/c_l7s.png");
    this.load.image("lvl13-cheeseb", "assets/c_l7b.png");

    // LEVEL L ==== GAMEOVER/WIN LEVEL (substitute) ====
    this.load.image("lvll-bg", "assets/lvll-bg.png");
    this.load.image("lvll-cheese", "assets/lvll-cheese.png");
    this.load.image("lvll-player", "assets/lvll-player.png");
    this.load.image("lvll-ground", "assets/lvll-ground.png");
    // LEVEL L = SOUND
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
