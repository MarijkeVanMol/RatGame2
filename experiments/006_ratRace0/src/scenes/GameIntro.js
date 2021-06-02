import Phaser from "../lib/phaser.js";

export default class GameIntro extends Phaser.Scene {
  constructor() {
    super("gameIntro");
  }

  create() {
    console.log("create intro");
    this.add.image(240, 320, "intro");

    this.input.on("pointerdown", () => {
      this.scene.start("gameStart");
    });
  }
  update() {
    document.body.className = "intro";
  }
}
