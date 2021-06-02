import Phaser from "../lib/phaser.js";

export default class GameStart extends Phaser.Scene {
  constructor() {
    super("gameStart");
  }

  create() {
    console.log("create start");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.image(240, 320, "start");

    // it plays only when i come back to the scene; google says autoplay is not allowed
    //  looooopp???
    // var music = this.sound.add("theme");
    // music.play();

    this.input.on("pointerdown", () => {
      this.scene.start("levelOne");
      // music.stop();
    });
  }

  update() {
    document.body.className = "busy";
  }
}
