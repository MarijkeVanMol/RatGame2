import Phaser from "../lib/phaser.js";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }
  preload() {
    this.load.image("rat-cry", "assets/rat_cry.png");

    this.load.audio("baby", "assets/sfx/over.mp3");
  }

  create() {
    //  MUSIC
    // var music = this.sound.add("baby");
    // music.play();

    //  TEXT
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width * 0.5, height * 0.5, "Okay, wait for a few minutes.", {
        fontSize: 30,
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("gameStart");
    });

    //  IMAGE
    // rat = this.add.sprite(240, 400, "rat-cry").setScale(8);
    // rat.body.allowGravity = false;
  }
}

/* code for laters: moving sprite without keyboardAction: https://labs.phaser.io/edit.html?src=src\audio\Web%20Audio\reuse%20audio%20context.js

*/
