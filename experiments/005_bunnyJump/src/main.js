import Phaser from './lib/phaser.js'

import GameIntro from './scenes/GameIntro.js'
import GameStart from './scenes/GameStart.js'

import GameBoring from './scenes/GameBoring.js'

import GameBusy from './scenes/GameBusy.js'

import GameOver from './scenes/GameOver.js'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 480,
	height: 640,
    pixelArt: true,
    scene: [GameIntro, GameStart, GameBusy, GameBoring ,GameOver], 
    audio: 
    {
        
    },
    physics: 
    {
        default: 'arcade',
        arcade: 
        {
            gravity: 
            {
                y:200
            },
            debug: false
        }
    }
})