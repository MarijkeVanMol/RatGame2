import Phaser from '../lib/phaser.js'

import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene 
{
    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Physics.Arcade.Sprite} */
	player

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
	cursors

    /** @type {Phaser.Physics.Arcade.Group} */
	carrots

    carrotsCollected = 0

    /** @type {Phaser.GameObjects.Text} */
	carrotsCollectedText

    constructor(){
        super('game')
    }

    init()
	{
		this.carrotsCollected = 0
	}



    preload(){
        this.load.image('background', 'assets/bg_layer1.png');

        this.load.image('platform', 'assets/ground_grass.png');

        this.load.image('bunny-stand', 'assets/bunny1_stand.png');
        this.load.image('bunny-jump', 'assets/bunny1_jump.png');

        this.load.image('carrot', 'assets/carrot.png');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.load.audio('jump', 'assets/sfx/phaseJump1.mp3')

        this.load.audio('tttwo', 'assets/sfx/threeTone2.mp3')

        this.load.audio('power', 'assets/sfx/powerUp3.mp3')
    }



    create(){
//  BACKGROUND
        this.add.image(240,320, 'background').setScrollFactor(1,0);


        // this.add.image(240,320, 'platform').setScale(0.5);
        // this.physics.add.image(240,320,'platform').setScale(0.5);
        this.platforms = this.physics.add.staticGroup();

//  PLATFORMS
        for (let i = 0; i <5; ++i){
            const x = Phaser.Math.Between(80,400)
            const y = 150*i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x,y, 'platform');
            platform.scale = 0.5;

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body;
            body.updateFromGameObject();
        }

//  PLAYER 
        this.player = this.physics.add.sprite(240,320, 'bunny-stand').setScale(0.5);
    
//  CARROTS
        this.carrots = this.physics.add.group({classTYpe: Carrot});
        //this.carrots.get(240,320, 'carrot'); 

//  COLLISIONS
//      PLAYER & PLATFORMs
        this.physics.add.collider(this.platforms, this.player);
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;
//      CARROT & PLATFORMS
        this.physics.add.collider(this.platforms, this.carrots);
//  OVERLAPS
//      CARROT & PLATFORMS
        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot, // called on overload
            undefined,
            this
        );

//  CAMERAS
        this.cameras.main.startFollow(this.player); // follows player, also to the side
        this.cameras.main.setDeadzone(this.scale.width*1.5); // makes sure it doesn't go 'off-screen, move to the sides'

//  FONT
        const style = {color: 'ffff00', fontSize: 24}
        this.carrotsCollectedText = this.add.text(240,10,'0', style)
            .setScrollFactor(0)
            .setOrigin(0.5,0)
    }



    update(){
        // find out from Arcade physics if the player's physics body is touching something below it
//  PLAYER
//      BOUNCE
        const touchingDown = this.player.body.touching.down;
        if(touchingDown){
            this.player.setVelocityY(-300);
            this.player.setTexture('bunny-jump');
            this.sound.play('jump');
        }
//      UNBOUNCE
        const vy = this.player.body.velocity.y  // naar beneden gaan
        if (vy > 0 && this.player.texture.key != 'bunny-stand'){ // als player nr beneden ga en..
            this.player.setTexture('bunny-stand')
        }

//  PLATFORMS
//      NEW PLATFORMS
        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child;

            const scrollY = this.cameras.main.scrollY;
            if (platform.y >= scrollY + 700){
                platform.y = scrollY - Phaser.Math.Between(50,100);
                platform.body.updateFromGameObject();

                // create a carrot above the platform being
                this.addCarrotAbove(platform);
            }
        })
//  PLAYER
//      CURSORS MOVEMENT
       if (this.cursors.left.isDown && !touchingDown){
           this.player.setVelocityX(-200)
       } 
       else if(this.cursors.right.isDown && !touchingDown){
           this.player.setVelocityX(200)
       }
       else {
           this.player.setVelocityX(0)
       }
//  CAMERAS
//      SCREEN WRAP OF PLAYER
       this.horizontalWrap(this.player);

//  bottomPLATFORM
       const bottomPlatform = this.findBottomMostPlatform()
       if (this.player.y > bottomPlatform.y + 200){
           this.scene.start('game2')
           this.sound.play('power');
       }
    }



//      END OF UPDATE
//  CAMERAS
//      HORIZONTAL WRAP; if outside left side of screen, appears on right of screen
    /**
     * @param {Phaser.GameObjects.Sprite} sprite 
     */
    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth*0.5;
        const gameWidth = this.scale.width;
        if (sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth
        } else if (sprite.x > gameWidth + halfWidth){
            sprite.x = -halfWidth
        }
    }
//  CARROT
//      MAKE SURE CARROTS APPEARS BEFORE THE REST ??
    /**
     * @param {Phaser.GameObjects.Sprite} sprite
     */
    addCarrotAbove(sprite){
        const y = sprite.y - sprite.displayHeight;

        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x, y, 'carrot');

        carrot.setActive(true); // set active
        carrot.setVisible(true); // set visible

        this.add.existing(carrot);
        carrot.body.setSize(carrot.width, carrot.height); // update the physiscs body size

        this.physics.world.enable(carrot); //enables body in physics world

        return carrot;
    }

//  CARROT
//      COLLECT
    /**
     * @param {Phaser.Physics.Arcade.Sprite} player
     * @param {Carrot} carrot
     */
    handleCollectCarrot(player, carrot){
        this.carrots.killAndHide(carrot) // hide from display
        this.physics.world.disableBody(carrot.body) // disable from physics world
        this.carrotsCollected++
        const value = `${this.carrotsCollected}`
        this.carrotsCollectedText.text = value
        this.sound.play('tttwo')
    }

//  PLATFORMS
    findBottomMostPlatform(){
        const platforms = this.platforms.getChildren()
        let bottomPlatform = platforms[0]

        for(let i=1; i<platforms.length; i++){
            const platform = platforms[i]
            if(platform.y<bottomPlatform.y){
                continue
            }
            bottomPlatform = platform
        }
        return bottomPlatform
    }
}