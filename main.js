Moralis.initialize("8dPh1QppVuEGeztUT1PGoRznI4eSxFmucdBNr05s"); // Application id from moralis.io
    Moralis.serverURL = "https://gyqnuey9i6cn.usemoralis.com:2053/server"; //Server url from moralis.io

    var state = {}
    var sprites = []
    var buttonsLocked = {}
    var gameInitialized = false;

    const PLAYER_SIZE = 50;
    const MOVE_COOLOFF = 300;

    var lastMove = 0;

    
    console.log(Moralis.User.current())

    var config = {
      type: Phaser.AUTO,
      width: 1200,
      height: 700,
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      physics: {
        default: 'arcade',
        arcade: { 
          gravity: {y: 300},
          debug: false }
      }
    };

    var game;
    var context;
    var platforms;
    var acid;
    var doors;
    var openDoors;
    var paket;
    var box;
    var danger;
    var fence;
    var coins;
    var schalter;

    var player;
    var player2;
    var competitors = {};

    var cursors;
    //move vars
    var jumpHeight = -300;
    var moveLeft = -200;
    var moveRight = 200;
    // score
    var score = 0;
    var scoreText;
    // bombs
    var bombs;

    var users = [];

    (function launchApp(){
      let user = Moralis.User.current();
      if(!user){
        alert("No User logged in! Please login using Metamask");
      } else { 
        console.log("LOADING");
        console.log(user.get("ethAddress"));
        game = new Phaser.Game(config);
      }
      this.score = 0;
      this.gameOver = false;
    })();

    hideElement = (element) => element.style.display = "none";
    showElement = (element) => element.style.display = "block";


    // function start() {
    //   let user = Moralis.User.current();
    //   if(!user){
    //     alert("No User logged in! Please login using Metamask");
    //   } else { 
    //     console.log("LOADING");
    //     console.log(user.get("ethAddress"));
    //     location.reload
    //     scene.restart(); // restart current scene
    //   }
    //   this.score = 0;
    //   this.gameOver = false;   }


    //LOADING ASSETS

    function preload ()
    {
      context = this;
      this.load.image("background", "assets/png/BG3.png")
      //ground
      this.load.image("ground", "assets/png/Tiles/BGTile (1).png")
      this.load.image("ground2", "assets/png/Tiles/BGTile (2).png")
      //player & objects
      this.load.image("player", "assets/png/character/eyewhite.png")
      this.load.image("player2", "assets/png/character/eyeblack.png")
      this.load.image("doorlock", "assets/png/Objects/DoorLocked.png")
      this.load.image("dooropen", "assets/png/Objects/DoorOpen.png")
      this.load.image("paket", "assets/png/Objects/Box.png")

      //boxes
      this.load.image("boxtileL", "assets/png/Tiles/Tile (1).png")
      this.load.image("boxtile1", "assets/png/Tiles/Tile (2).png")
      this.load.image("boxtileR", "assets/png/Tiles/Tile (3).png")
      this.load.image("box", "assets/png/Tiles/Tile (5).png")
      this.load.image("boxleft", "assets/png/Tiles/Tile (4).png")
      this.load.image("boxright", "assets/png/Tiles/Tile (6).png")
      //dangerous
      this.load.image("acid", "assets/png/Tiles/Acid (1).png")
      this.load.image("acid2", "assets/png/Tiles/Acid (2).png")
      this.load.image("saw", "assets/png/Objects/Saw.png")
      this.load.image("spike", "assets/png/Tiles/Spike.png")
      //plats
      this.load.image("platL", "assets/png/Tiles/Tile (12).png")
      this.load.image("plat1", "assets/png/Tiles/Tile (13).png")
      this.load.image("platR", "assets/png/Tiles/Tile (14).png")
      this.load.image("plat2", "assets/png/Tiles/Tile (15).png")

      this.load.image("coin", "assets/moralis6.png")
      this.load.image("bomb", "assets/png/Objects/Barrel (4).png")
      this.load.image("fenceL1", "assets/png/Tiles/FenceLeft1.png")
      this.load.image("fenceL2", "assets/png/Tiles/FenceLeft2.png")
      this.load.image("fenceL3", "assets/png/Tiles/FenceLeft3.png")
      this.load.image("fence1", "assets/png/Tiles/Fence (1).png")
      this.load.image("fence2", "assets/png/Tiles/Fence (2).png")
      this.load.image("fence3", "assets/png/Tiles/Fence (3).png")
      this.load.image("fenceR2", "assets/png/Tiles/FenceRight2.png")
      this.load.image("switch", "assets/png/Objects/Switch (2).png")
    }


    // INITIAL SETUP FUNCTION 
    async function create ()
    {
      if(!Moralis.User.current())
        return;

      
      this.add.image(600,350, "background").setScale(1);
    
// PLATFORMS
      platforms = this.physics.add.staticGroup();
      platforms.create(550, 550, "boxtileL").setScale(.2).refreshBody();
      platforms.create(600, 550, "boxtile1").setScale(.2).refreshBody();
      platforms.create(650, 550, "boxtile1").setScale(.2).refreshBody();
      platforms.create(700, 550, "boxtileR").setScale(.2).refreshBody();

      platforms.create(400, 500, "platR").setScale(.2).refreshBody();
      platforms.create(350, 500, "plat1").setScale(.2).refreshBody();
      platforms.create(300, 500, "platL").setScale(.2).refreshBody();

      platforms.create(800, 300, "platR").setScale(.2).refreshBody();
      platforms.create(750, 300, "platL").setScale(.2).refreshBody();

      platforms.create(1000, 200, "plat2").setScale(.2).refreshBody();

// LEFT TOP
      platforms.create(100, 150, "platL").setScale(.2).refreshBody();
      platforms.create(150, 150, "plat1").setScale(.2).refreshBody();
      platforms.create(200, 150, "platR").setScale(.2).refreshBody();
      
// Plats
      platforms.create(150, 625, "plat2").setScale(.2).refreshBody();
      platforms.create(50, 425, "platL").setScale(.2).refreshBody();
      platforms.create(100, 425, "plat1").setScale(.2).refreshBody();
      platforms.create(150, 425, "platR").setScale(.2).refreshBody();

      platforms.create(350, 125, "plat2").setScale(.2).refreshBody();
      platforms.create(450, 325, "plat2").setScale(.2).refreshBody();
      platforms.create(850, 125, "plat2").setScale(.2).refreshBody();
      platforms.create(650, 75, "plat2").setScale(.2).refreshBody();
      platforms.create(950, 425, "plat2").setScale(.2).refreshBody();
      platforms.create(1050, 225, "plat2").setScale(.2).refreshBody();
    

// DOOR

      doors = this.physics.add.staticGroup();
      doors.create(30, 625, "doorlock").setScale(.2).refreshBody();


// SAWS & SPIKES
      danger = this.physics.add.staticGroup();
      danger.create(100, 675, "saw").setScale(.1).refreshBody();
      danger.create(150, 675, "saw").setScale(.1).refreshBody();
      danger.create(200, 675, "saw").setScale(.1).refreshBody();
      danger.create(1200, 513, "spike").setScale(.15).refreshBody();
      danger.create(1050, 200, "spike").setScale(.15).refreshBody();

// BOXES
      box = this.physics.add.staticGroup();
        box.create(400, 650, "box").setScale(.2).refreshBody();
        box.create(350, 650, "box").setScale(.2).refreshBody();
        box.create(300, 650, "box").setScale(.2).refreshBody();
        
        box.create(400, 700, "box").setScale(.2).refreshBody();
        box.create(350, 700, "box").setScale(.2).refreshBody();
        box.create(300, 700, "box").setScale(.2).refreshBody();
        box.create(250, 700, "box").setScale(.2).refreshBody();

        box.create(250, 650, "boxleft").setScale(.2).refreshBody();
        box.create(250, 600, "boxleft").setScale(.2).refreshBody();
        box.create(700, 600, "boxright").setScale(.2).refreshBody();
        box.create(700, 650, "boxright").setScale(.2).refreshBody();
        box.create(700, 700, "box").setScale(.2).refreshBody();
        box.create(750, 700, "box").setScale(.2).refreshBody();
        box.create(800, 700, "box").setScale(.2).refreshBody();
        box.create(850, 700, "box").setScale(.2).refreshBody();

        box.create(1150, 700, "box").setScale(.2).refreshBody();
        box.create(1200, 700, "box").setScale(.2).refreshBody();
        box.create(1200, 650, "boxleft").setScale(.2).refreshBody();
        box.create(1200, 600, "boxleft").setScale(.2).refreshBody();
        box.create(1200, 550, "boxleft").setScale(.2).refreshBody();
        
        //bottom
        box.create(200, 700, "box").setScale(.2).refreshBody();
        box.create(150, 700, "box").setScale(.2).refreshBody();
        box.create(100, 700, "box").setScale(.2).refreshBody();
        box.create(50, 700, "box").setScale(.2).refreshBody();
        box.create(0, 700, "box").setScale(.2).refreshBody();


// ACID STUFF
      acid = this.physics.add.staticGroup();
        danger.create(300, 607, "acid").setScale(.2).refreshBody();
        danger.create(350, 607, "acid").setScale(.2).refreshBody();
        danger.create(400, 607, "acid").setScale(.2).refreshBody();
        danger.create(450, 607, "acid").setScale(.2).refreshBody();
        danger.create(500, 607, "acid").setScale(.2).refreshBody();
        danger.create(550, 607, "acid").setScale(.2).refreshBody();
        danger.create(600, 607, "acid").setScale(.2).refreshBody();
        danger.create(650, 607, "acid").setScale(.2).refreshBody();

        acid.create(450, 650, "acid2").setScale(.2).refreshBody();
        acid.create(500, 650, "acid2").setScale(.2).refreshBody();
        acid.create(550, 650, "acid2").setScale(.2).refreshBody();
        acid.create(600, 650, "acid2").setScale(.2).refreshBody();
        acid.create(650, 650, "acid2").setScale(.2).refreshBody();

        acid.create(450, 700, "acid2").setScale(.2).refreshBody();
        acid.create(500, 700, "acid2").setScale(.2).refreshBody();
        acid.create(550, 700, "acid2").setScale(.2).refreshBody();
        acid.create(600, 700, "acid2").setScale(.2).refreshBody();
        acid.create(650, 700, "acid2").setScale(.2).refreshBody();
        danger.create(900, 700, "acid").setScale(.2).refreshBody();
        danger.create(950, 700, "acid").setScale(.2).refreshBody();
        danger.create(1000, 700, "acid").setScale(.2).refreshBody();
        danger.create(1050, 700, "acid").setScale(.2).refreshBody();
        danger.create(1100, 700, "acid").setScale(.2).refreshBody();

      // FENCE
      fence = this.physics.add.staticGroup();
      fence.create(1178+4, 605, "fence2").setScale(.2).refreshBody();
      fence.create(1128+4, 605, "fence2").setScale(.2).refreshBody();
      fence.create(1102+4, 605, "fence1").setScale(.2).refreshBody();
      fence.create(1105+4, 645, "fenceR2").setScale(.2).refreshBody();
      fence.create(1105+4, 695, "fenceR2").setScale(.2).refreshBody();
     


      schalter = this.physics.add.staticGroup();
      schalter.create(1150, 650, "switch").setScale(.2).refreshBody();

      schalter.create(550, 350, "switch").setScale(.2).refreshBody();

      function openDoor (schalter, fence){
          doors.setTint(0xff105500);
          fence.disableBody(true, true);
          console.log("door opened");

          openDoors = this.physics.add.staticGroup();
          openDoors.create(30, 625, "dooropen").setScale(.2).refreshBody();
          paket = this.physics.add.staticGroup();
          //paket.create(30, 625, "paket").setScale(.12).refreshBody(); --- DOOR PACKAGE
          paket.create(850, 95 , "paket").setScale(.12).refreshBody();
          paket.create(950, 395 , "paket").setScale(.12).refreshBody();
          this.physics.add.collider(player, openDoors, gameWon, null, this);
          this.physics.add.collider(player, paket, collectPackage, null, this);
        }

// PLAYER DEFINITIONS

      player = this.physics.add.sprite(650,400, "player").setScale(.12).refreshBody();
      player.setBounce(0.75);
      player.setCollideWorldBounds(true);
      
      this.physics.add.collider(player,platforms);
      this.physics.add.collider(player,box);
      this.physics.add.collider(player, competitors);
      this.physics.add.collider(player, fence);

      this.physics.add.collider(player, danger, hitDanger, null, this);   
      //this.physics.add.collider(player, openDoors, gameWon, null, this);
      this.physics.add.collider(player, paket, collectPackage, null, this);
      this.physics.add.overlap(player, schalter, openDoor, null, this);   
      


// COINS
      coins = this.physics.add.group({
          key: 'coin',
          repeat: 9,
          setXY: { x: 75, y: -15, stepX: 175 }
          });
          
          
      coins.children.iterate(function (child) {
          child.setBounceY(Phaser.Math.FloatBetween(0.7, 1));
          });

      this.physics.add.collider(coins, platforms);
      
      this.physics.add.collider(coins, box);
      this.physics.add.collider(danger, coins);
      this.physics.add.collider(coins, bombs);
      this.physics.add.collider(coins, fence);

      this.physics.add.overlap(player, coins, collectCoin, null, this);
      this.physics.add.overlap(coins, danger, goneCoin, null, this);
      coins.setVelocity(Phaser.Math.Between(-50, 50), 0);


// BOMBS
      bombs = this.physics.add.group();

      this.physics.add.collider(bombs, platforms);
      this.physics.add.collider(bombs, box );
      this.physics.add.collider(player, bombs, hitBomb, null, this);
      //his.physics.add.collider(bombs, coins);
      //this.physics.add.collider(bombs, fence);
      this.physics.add.overlap(bombs, danger, goneDanger, null, this);
      this.physics.add.overlap(bombs, fence, goneFence, null, this);

    
      function hitBomb (player, bomb){
            this.physics.pause();

            player.setTint(0xff0000);

            gameOver = true;
            gameOverText.visible = true;
            gameOverSquare.visible = true;
        }

        function gameWon (player, openDoors){
          player.setTint(0xff105500);
          paket.setTint(0xff105500);
          player.disableBody(true, true);
          this.physics.pause();
          gameOver = true;
          gameWonText.visible = true;
          gameOverSquare.visible = true;
        }

        function hitDanger (player, danger){  
              player.setTint(0xff0000);
              this.physics.pause();
              gameOver = true;
              gameOverText.visible = true;
              gameOverSquare.visible = true;    
          }
        
          function goneCoin (coins, danger){
            coins.disableBody(true, true);
            console.log("coin disappeared");
          }
          function goneDanger (bombs, danger){
            danger.disableBody(true,true);
            bombs.disableBody(true, true);
            console.log("bombs&danger disappeared!");
          }
          function goneFence(bombs, fence){
            fence.disableBody(true, true);
            bombs.disableBody(true,true);
            console.log("bomb disappeared")
          }
        
// COIN COLLECT
          function collectPackage (player, paket){
            paket.disableBody(true,true);
            score += 100;
            scoreText.setText('Score: ' + score);
              console.log("package collected");
          }
    function collectCoin (player, coin){
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    
    if (coins.countActive(true) === 9)
       {
        coins.children.iterate(function (child) {

            child.enableBody(true, child.x, -20, true, true);
            child.setBounceY(Phaser.Math.FloatBetween(0.7, 1));
            //coinText.visible = true;
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    // SCORE TEXT & GAMEOVER TEXT
    

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#999' });
      gameOverSquare = this.add.rectangle(592,375,400,130,{ fillColor: "#0xff0000"})
      gameOverText = this.add.text(600, 350, 'Game Over!', { fontSize: '64px', fill: '#999' });

      gameWonText = this.add.text(600, 350, "Level Completed", { fontSize: '64px', fill: '#999' });

      coinText = this.add.text(600, 350, 'Coins incoming!', { fontSize: '64px', fill: '#999' });

      gameWonText.setOrigin(0.5);
      gameOverText.setOrigin(0.5);
      gameOverSquare.setOrigin(0.5);
      gameOverText.visible = false;
      coinText.visible = false;
      gameWonText.visible = false;
      gameOverSquare.visible = false;
      

//MOVEMENT
      cursors = this.input.keyboard.createCursorKeys(); 
      this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

      let user = Moralis.User.current();
      let query = new Moralis.Query('PlayerPosition');
      let subscription = await query.subscribe();

      // subscription.on('update', (object) => {

      //   if(!users[object.id])
      //     users[object.id] = this.add.rectangle(object.get("x"), object.get("y"), PLAYER_SIZE, PLAYER_SIZE, 0x6666ff);
      //   else{
      //     let user = users[object.id];
      //     user.setPosition(object.get("x"),object.get("y"))
      //   }
      // });

      subscription.on("create", (plocation) => {
        if(plocation.get("player") != user.get("ethAddress")){
            //if first time seeing
          if(competitors[plocation.get("player2")] == undefined){
            //create a sprite
            competitors[plocation.get("player2")] = this.add.image(plocation.get("x"),plocation.get("y"), "player2").setScale(.125);
            
          }
          else {
            competitors[plocation.get("player2")].x = plocation.get("x");
            competitors[plocation.get("player2")].y = plocation.get("y");
            
          }

          console.log("someone moved!");
          console.log(plocation.get("player"));
          console.log("new X ", plocation.get("x"));
          console.log("new Y ", plocation.get("y"));
        }
      })

      await Moralis.Cloud.run("move", {direction:null}); //just to register the player

      let nearbyPlayers = await Moralis.Cloud.run("playersNearby"); 
      nearbyPlayers.forEach(player => {
        users[player.id] = this.add.rectangle(player.get("x"), player.get("y"), PLAYER_SIZE, PLAYER_SIZE, 0x6666ff);
      });

      gameInitialized = true;
    }

      //LOGIC below
    async function  update ()
    {
      if(!gameInitialized)
        return;

      cursors = this.input.keyboard.createCursorKeys();
      const params =  { cursors: cursors };

      // dont move if cool off hasnt passed
      if(new Date()-lastMove < MOVE_COOLOFF)
        return
      
      lastMove = new Date();

      if (this.wKey.isDown) {
        player.setVelocityY(jumpHeight);

        if(!buttonsLocked["up"]){
          console.log('W is pressed');

          buttonsLocked["up"]=true;
          let moveResult = await Moralis.Cloud.run("move", {direction:"up"});
          console.log(moveResult)
          buttonsLocked["up"]=false;
        }

      }
      else if(this.aKey.isDown){

        player.setVelocityX(moveLeft);

        if(!buttonsLocked["left"]){
          console.log('A is pressed');

          buttonsLocked["left"]=true;
          let moveResult = await Moralis.Cloud.run("move", {direction:"left"});
          console.log(moveResult)
          buttonsLocked["left"]=false;
        }
      }
      else if(this.sKey.isDown){

        player.setVelocityY(160);

        if(!buttonsLocked["down"]){
          console.log('S is pressed');

          buttonsLocked["down"]=true;
          let moveResult = await Moralis.Cloud.run("move", {direction:"down"});
          console.log(moveResult)
          buttonsLocked["down"]=false;
        }
      }
      else if(this.dKey.isDown){

        player.setVelocityX(moveRight);

        if(!buttonsLocked["right"]){
          console.log('D is pressed');

          buttonsLocked["right"]=true;
          let moveResult = await Moralis.Cloud.run("move", {direction:"right"});
          console.log(moveResult)
          buttonsLocked["right"]=false;
        }
      }

      if(player.lastX!=player.x || player.lastY!=player.y){
        let user = Moralis.User.current();

        const PlayerPosition = Moralis.Object.extend("PlayerPosition");
        const playerPosition = new PlayerPosition();

        playerPosition.set("player", user.get("ethAddress"));
        playerPosition.set("x",player.x);
        playerPosition.set("y",player.y);

        player.lastX = player.x;
        player.lastY = player.y;
        
        await playerPosition.save();
      }
    }   

    // LOGIN & LOGOUT

    async function login(){
      console.log("login clicked");
      var user = await Moralis.Web3.authenticate();
      launchApp();
      if(user){
        console.log(user);
        location.reload(); 
      }
    }

    async function logout(){
      console.log("logout clicked");
      await Moralis.User.logOut();
      location.reload();
      
    }

    