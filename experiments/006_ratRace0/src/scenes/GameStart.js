import Phaser from "../lib/phaser.js";

export default class GameStart extends Phaser.Scene {
  constructor() {
    super("gameStart");
  }

  preload() {
    this.load.image("start", "assets/coverOfGame.png");

    this.load.audio("theme", "assets/sfx/songStart.mp3");

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(240, 320, "start");

    // it plays only when i come back to the scene; google says autoplay is not allowed
    //  looooopp???
    var music = this.sound.add("theme");
    music.play();

    this.input.on("pointerdown", () => {
      this.scene.start("gameBusy");
      music.stop();
    });

    // this.input.keyboard.once('keydown', () => {
    //     this.scene.start('gameBusy')
    //     music.stop()
    //   })
  }
}
