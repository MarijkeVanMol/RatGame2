import Phaser from '../lib/phaser.js'

import Carrot from '../game/Carrot.js'

/**
 * 
 * @param {Phaser.Scene} scene 
 * @param {number} count 
 * @param {string} texture 
 * @param {number} scrollFactor 
 */

// if 'bg_busy.png' has reached its end, go to next GameBoring.js
const createNextScene = (scene, count, texture, scrollFactor) => {
let x = 0
for (let i = 0; i < count; ++i)
{ // if this scene 'Game2' is over, let's go to 'Game'
    const newScene = scene.add.image(0, scene.scale.height, texture, scrollFactor)
        this.add.image(gameWidth, 0, 'bg')
        .setOrigin(1,0)
        .setScrollFactor(scrollFactor)

        x += newScene.height
    }
}

export default class Game2 extends Phaser.Scene 
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
        super('gameBusy')
    }

    init()
	{
		this.carrotsCollected = 0
	}



    preload(){
        this.load.image('bg', 'assets/bg_busy.png');

        this.load.image('plat0', 'assets/platform0_busy.png');
        this.load.image('plat1', 'assets/platform1_busy.png');
        this.load.image('plat2', 'assets/platform2_busy.png');
        this.load.image('plat3', 'assets/platform3_busy.png');
        this.load.image('plat4', 'assets/platform4_busy.png');

        this.load.image('rat', 'assets/rat_busy.png');
        this.load.image('rat-jump', 'assets/rat_jump_busy.png');

        this.load.image('cheese', 'assets/cheese_busy.png');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.load.audio('jump', 'assets/sfx/phaseJump1.mp3')

        this.load.audio('tttwo', 'assets/sfx/threeTone2.mp3')

        this.load.audio('power', 'assets/sfx/powerUp3.mp3')
    }



    create(){
//  BACKGROUND
        const gameWidth = this.scale.width
        const gameHeight = this.scale.height

        this.add.image(gameWidth, 0, 'bg')
            .setOrigin(1,0)
            .setScrollFactor(0.25)
        
        


        // this.add.image(240,320, 'platform').setScale(0.5);
        // this.physics.add.image(240,320,'platform').setScale(0.5);

//  PLATFORMS



    // this.platforms = this.physics.add.group();

    //     this.platforms.create(250, 300, 'plat0');
    //     this.platforms.create(350, 300, 'plat1').setGravity(0, 300);
    //     this.platforms.create(450, 300, 'plat2').setGravity(0, -300);
    //     this.platforms.create(550, 300, 'plat3').setGravity(0, -300);
    //     this.platforms.create(550, 300, 'plat4').setGravity(0, -300);
        
        this.platforms = this.physics.add.staticGroup();

        for (let i = 0; i <5; ++i){
            const x = Phaser.Math.Between(80,400)
            const y = 150*i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x,y, 'plat0');
            platform.scale = 0.7;
            // platform.flipY= true; doesn't work

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body;
            body.updateFromGameObject();
        }

        this.platforms = this.physics.add.staticGroup();

        for (let i = 0; i <5; ++i){
            const x = Phaser.Math.Between(80,400)
            const y = 150*i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x,y, 'plat1');
            platform.scale = 0.7;
            // platform.flipY= true; doesn't work

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body;
            body.updateFromGameObject();
        }
//  PLAYER 
        this.player = this.physics.add.sprite(240,320, 'rat').setScale(2).setGravityY(-600);
    
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
        // paralax1: this.cameras.main.setBounds(0,0,480 , 640* 3); // for parallax??

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
            this.player.setVelocityY(-500);
            this.player.setTexture('rat-jump');
        }
//      UNBOUNCE
        const vy = this.player.body.velocity.y  // naar beneden gaan
        if (vy > 0 && this.player.texture.key != 'rat'){ // als player nr beneden ga en..
            this.player.setTexture('rat')
            this.sound.play('jump');
            this.cameras.main.shake(500);
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
       //parallax 1: this.bg.tilePositionY = this.cameras.main.scrollY *.3;

//  bottomPLATFORM
       const bottomPlatform = this.findBottomMostPlatform()
       if (this.player.y > bottomPlatform.y + 200){
           this.scene.start('gameBoring')
           this.sound.play('tttwo')
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
        const carrot = this.carrots.get(sprite.x, y, 'cheese');

        carrot.setActive(true); // set active
        carrot.setVisible(true); // set visible

        this.add.existing(carrot);
        carrot.body.setSize(carrot.width, carrot.height); // update the physiscs body size

        this.physics.world.enable(carrot); //enables body in physics world

        return carrot;
    };

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
        this.sound.play('power')
    };

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
};