import Phaser from "./lib/phaser.js";

import GameIntro from "./scenes/GameIntro.js";
import GameStart from "./scenes/GameStart.js";

import GameBusy from "./scenes/GameBusy.js";
import GameBoring from "./scenes/GameBoring.js";
import LevelThree from "./scenes/LevelThree.js"; //doesnt work
import LevelFour from "./scenes/LevelFour.js"; // !work: gravity?? isParent?? bla bla
import LevelFive from "./scenes/LevelFive.js";
import LevelSeven from "./scenes/LevelSeven.js";

import GameOver from "./scenes/GameOver.js";

export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  pixelArt: true,
  scene: [
    GameBusy,
    GameBoring,
    LevelSeven,
    GameOver,
    LevelFour,
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
      debug: false,
    },
  },
});
