var game = new Phaser.Game(1024,928, Phaser.AUTO, 'gamebox', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('sky', '../assets/sky.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.image('star', '../assets/star.png');
    game.load.image('ground_1x1', '../assets/ground_1x1.png');
    game.load.spritesheet('dude1', '../assets/dude1.png', 32, 32);
}

//Constantes*****
var LARGEURJEUX = 32; //nombre de tiles de large du jeux 32
var HAUTEURJEUX = 29; //nombre de tiles de haut du jeux 29 (doit être impair!!!)
var VITESSEJOUEUR = 300; //vitesse de déplacement du joueur

//var players;
var terrain; //Groupe contenant les objet innanimé
var cursors; //Variable du curseur (flèche)
var currentLayer;  //Variable qui dit on est présentement sur quel layer
var map;
var layer1;
var entree_x;
var sortie_x;
var curPos_x; 
var curPos_y;
//Tableaux?!
var tableauMap;
var players;
var player1;

function create() {



//Add physic to the game
game.physics.startSystem(Phaser.Physics.ARCADE);

//**************************Map********************************************************************************//
createmap();
//createPath();
//createSubPath();

//******************************************************//

//On crée le groupe d'objet inerte
terrain = game.add.group();
//On active la physique sur le terrain
terrain.enableBody= true;

//On crée le groupe des joueurs
players = game.add.group();

//On crée le joueur 1
player1 = players.create(entree_x*32,0,'dude1');
//On active et set la physique du joueur 1
game.physics.arcade.enable(player1);
player1.body.collideWorldBounds = true;
//On fait suivre la camera sur le joueur
game.camera.follow(player1);
//Set the animations
player1.animations.add('down', [0,1,2,1],10,true);
player1.animations.add('up', [9,10,11,10],10,true);
player1.animations.add('left', [3,4,5,4], 10, true);
player1.animations.add('right', [6,7,8,7], 10, true);

//On crée le curseur
cursors = game.input.keyboard.createCursorKeys();

}

function update() {


var animation = 'none';

//On fait l'animation du joueur*************************

    //collision entre le joueur et les obstacle de la layer 1
    game.physics.arcade.collide(player1, layer1);
    //  Reset the players velocity (movement)
    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        //Move to the left
        player1.body.velocity.x = -VITESSEJOUEUR;
        animation = 'left';
    }
    if (cursors.right.isDown)
    {
        //Move to the right
        player1.body.velocity.x = VITESSEJOUEUR;
        animation = 'right';
    }
    if (cursors.up.isDown)
    {
        //Move up
        player1.body.velocity.y = -VITESSEJOUEUR;
        animation = 'up';
    }
    if (cursors.down.isDown)
    {
        //Move down
        player1.body.velocity.y = VITESSEJOUEUR;
        animation = 'down';
    }

    //Stand still or play the animation
     if (animation == 'none')
    {
        player1.animations.stop();
        //player1.frame = 1;
    } else {
        player1.animations.play(animation);
    }
//**************************************************************
}


function render() {

   //game.debug.text('Current Layer: ' + currentLayer.name, 50, 500);
   //game.debug.text('Position en x  ' + tile_x, 50, 500);
   //game.debug.text('Position en y ' + tile_y, 50, 550);
   //game.debug.text('go where dit: ' + gowhere, 50, 500);
   //game.debug.cameraInfo(game.camera, 32, 32);
   //game.debug.spriteInfo(player1, 32, 132);
    

}

function createmap() {


    //simple background to the map
    game.stage.backgroundColor = '#2d2d2d';

    //  Creates a blank tilemap
    map = game.add.tilemap();   

    //On cree le tableau 2D qui représente la map
    tableauMap = new Array();
    for (var i=0;i<LARGEURJEUX;i++)
        tableauMap[i] = new Array();
    //On rempli le tableau de 0
    for (i=0;i<LARGEURJEUX;i++)
    {
        for (var j=0;j<HAUTEURJEUX;j++)
            tableauMap[i][j]=0;
    }


    //  Add a Tileset image to the map
    map.addTilesetImage('ground_1x1');

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is LARGEURJEUX x HAUTEURJEUX tiles in size and the tiles are 32x32 pixels in size.
    layer1 = map.create('level 1',LARGEURJEUX, HAUTEURJEUX, 32, 32);
    layer1.scrollFactorX = 0.5;
    layer1.scrollFactorY = 0.5;
    currentLayer = layer1;
    //layer1.fixedtocamera = true;    
    //layer1.debug = true;

    //On set la grosseur du monde selon la layer1
    layer1.resizeWorld();   
    //On fait ensorte que les tiles 0 à 3 du tilesetimage soit "dur" (collision) dans la layer 1.
    map.setCollisionBetween(0, 3, true, layer1); 

}
