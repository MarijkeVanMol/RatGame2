

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// load the texture we need
app.loader
.add("star", "assets/star.png")
.add("player", "assets/player.png")
.add("cheese","assets/cheese.png")
.load(start);

// which elements are going to be part of the game
let stars = [];
let player;
let cheeses = [];

let playerSpeed = 2;

let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

let delta = 0;

function start(loader, resources) {

        //  CREATE a bunch of stars / toys or hands later
        for(let i=0; i<50; i++){
            // this creates a texture from a 'star.png' image
            const star = new PIXI.Sprite(resources.star.texture);
        
            // Setup the position of the star
            star.x = Math.random() * app.renderer.width;
            star.y = Math.random() * app.renderer.height;

            // give each star a random speed
            star.vx = Math.random() -0.5;
            star.vy = Math.random() -0.5;
        
            // Rotate around the center
            star.anchor.x = 0.5;
            star.anchor.y = 0.5;
        
            // Add the star to the scene we are building
            app.stage.addChild(star);
            stars.push(star);
        }

        //  CREATE a bunch of cheese
        for(let i=0; i<5; i++){
            //  create texture from cheese.png
            const cheese = new PIXI.Sprite(resources.cheese.texture);
            //  positions cheese
            cheese.x = Math.random() * app.renderer.width;
            cheese.y = Math.random() * app.renderer.height;
            //  random speed
            cheese.vx = Math.random()-0.5;
            cheese.vy = Math.random()-0.5;
            //  rotate around center
            cheese.anchor.x = 0.5;
            cheese.anchor.y = 0.5;
            //  add to the world!!
            app.stage.addChild(cheese);
            cheeses.push(cheese);          
        }
    
        //  CREATE our player
        player = new PIXI.Sprite(resources.player.texture);
        player.x = 50;
        player.y = app.renderer.height/2;
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        app.stage.addChild(player);

        // Listen for frame updates
        app.ticker.add(animate);
        app.ticker.speed = 1;
}

function animate() {

    //  MOVE player
    if (leftPressed){
        player.x -= playerSpeed * app.ticker.deltaTime;
    }
    if (rightPressed){
        player.x += playerSpeed * app.ticker.deltaTime;
    }
    if (upPressed){
        player.y -= playerSpeed * app.ticker.deltaTime;
    }
    if (downPressed){
        player.y += playerSpeed * app.ticker.deltaTime;
    }

    const playerBounds = player.getBounds();

    //  MOVE stars
    for (const star of stars){
        // x/y position gets increased by the velocity
        star.x += star.vx * app.ticker.deltaTime;  
        star.y += star.vy * app.ticker.deltaTime;

        // rotation added
        star.rotation += 0.01;

        // check if stars off screen
        if(star.x<0 || star.x > app.renderer.width){
            star.vx = -star.vx;
            //star.x = Math.random() * app.renderer.width;
        }
        if(star.y<0 || star.y > app.renderer.height){
            star.vy = -star.vy;
            //star.y = Math.random() * app.renderer.height;
        }
        
      

        //check if hit player
        if (playerBounds.contains(star.x,star.y)){
            console.log("game over!!");
            delta +=0.05;
            player.alpha = Math.sin(delta);
            
        }
    }
    //  EDGES cheese

    //  MOVE cheese
    for (const cheese of cheeses){
        // x/y position gets increased by the velocity
        cheese.x += cheese.vx * app.ticker.deltaTime;  
        cheese.y += cheese.vy * app.ticker.deltaTime;

        // rotation added
        cheese.rotation += 0.01;

        // check if stars off screen
        if(cheese.x<0 || cheese.x > app.renderer.width){
            cheese.vx = -cheese.vx;
            //star.x = Math.random() * app.renderer.width;
        }
        if(cheese.y<0 || cheese.y > app.renderer.height){
            cheese.vy = -cheese.vy;
            //star.y = Math.random() * app.renderer.height;
        }
        
        //check if hit player
        if (playerBounds.contains(cheese.x,cheese.y)){
            console.log("njamnjam!!");
            player.tint = 0xFFD700;
            //  player.x = 790;
            //  player.y = app.renderer.height/2;
        }
    }
     
    //  MOVE player EVENT
    window.addEventListener("keydown", (event) => {
        if (event.code === "ArrowLeft") {
            leftPressed = true;
        }
        else if (event.code === "ArrowRight") {
            rightPressed = true;
        }
        else if (event.code === "ArrowUp") {
            upPressed = true;
        }
        else if (event.code === "ArrowDown") {
            downPressed = true;
        }
    })

    window.addEventListener("keyup", (event) => {
        if (event.code === "ArrowLeft") {
            leftPressed = false;
        }
        else if (event.code === "ArrowRight") {
            rightPressed = false;
        }
        else if (event.code === "ArrowUp") {
            upPressed = false;
        }
        else if (event.code === "ArrowDown") {
            downPressed = false;
        }
    })
}
