import Phaser from './lib/phaser.js'

import Game from './scenes/Game.js'

import Game2 from './scenes/Game2.js'

import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 480,
	height: 640,
    pixelArt: true,
    scene: [Game,Game2,GameOver], 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y:200
            },
            debug: false
        }
    }
})