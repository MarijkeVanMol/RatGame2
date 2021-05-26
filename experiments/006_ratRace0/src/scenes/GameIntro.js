import Phaser from "../lib/phaser.js";

export default class GameIntro extends Phaser.Scene {
  constructor() {
    super("gameIntro");
  }

  preload() {
    console.log("preload game intro");
    this.load.image("intro", "assets/gameintro.jpg");
  }

  create() {
    this.add.image(240, 320, "intro");
    console.log("intro");

    this.input.on("pointerdown", () => {
      this.scene.start("gameStart");
    });
  }
}
