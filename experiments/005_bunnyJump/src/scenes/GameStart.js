import Phaser from '../lib/phaser.js'

export default class GameStart extends Phaser.Scene
{
    constructor()
    {
        super('gameStart')
    }



    preload(){
        this.load.image('start', 'assets/coverOfGame.png');

        this.cursors = this.input.keyboard.createCursorKeys();
    }
    


    create()
    {
        this.add.image(240,320, 'start');

        this.input.keyboard.once('keydown', () => {
            this.scene.start('gameBusy')
          })
      }
    }



 