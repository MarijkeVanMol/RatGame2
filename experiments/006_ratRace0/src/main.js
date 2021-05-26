import Phaser from "./lib/phaser.js";

import GameIntro from "./scenes/GameIntro.js";
import GameStart from "./scenes/GameStart.js";

import LevelOne from "./scenes/LevelOne.js";
import LevelTwo from "./scenes/LevelTwo.js";
import LevelThree from "./scenes/LevelThree.js"; //doesnt wor
import LevelFive from "./scenes/LevelFive.js";
import LevelSeven from "./scenes/LevelSeven.js";

import GameOver from "./scenes/GameOver.js";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  pixelArt: true,
  scene: [
    LevelOne,
    LevelTwo,
    LevelSeven,
    GameOver,
    LevelFive,
    LevelThree,
    GameIntro,
    GameStart,
  ],
  audio: {},
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 200,
      },
      debug: true,
    },
  },
});
