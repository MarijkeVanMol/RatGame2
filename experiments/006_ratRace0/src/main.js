import Phaser from "./lib/phaser.js";

import Loading from "./scenes/Loading.js";

import GameIntro from "./scenes/GameIntro.js";
import GameStart from "./scenes/GameStart.js";

import LevelOne from "./scenes/LevelOne.js";
import LevelTwo from "./scenes/LevelTwo.js";
import LevelThree from "./scenes/LevelThree.js";
import LevelFour from "./scenes/LevelFour.js";
import LevelFive from "./scenes/LevelFive.js";
import LevelSix from "./scenes/LevelSix.js";
import LevelSeven from "./scenes/LevelSeven.js";
import LevelEight from "./scenes/LevelEight.js";

import GameOver from "./scenes/GameOver.js";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  pixelArt: true,
  scene: [
    Loading,
    GameIntro,
    GameStart,
    LevelOne,
    LevelTwo,
    LevelThree,
    LevelFour,
    LevelFive,
    LevelSix,
    LevelSeven,
    LevelEight,
    GameOver,
  ],
  audio: {},
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 200,
      },
      debug: false,
    },
  },
});
