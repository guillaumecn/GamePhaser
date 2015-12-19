var game = new Phaser.Game(800,600, Phaser.AUTO, 'gamebox', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', '../assets/sky.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.image('star', '../assets/star.png');
    game.load.spritesheet('dude', '../assets/dude.png', 32, 48);
}



var players;
var terrain;
var nb_players = 5;

function create() {

//Background sky
game.add.sprite(0,0,'sky');


//Add physic to the game
game.physics.startSystem(Phaser.Physics.ARCADE);

//On crée le groupe d'objet inerte
terrain = game.add.group();
//On active la physique sur le terrain
terrain.enableBody= true;
//On crée le sol
var ground = terrain.create(0,game.world.height-64, 'ground');
//Scale it to fit the size of the world
ground.scale.setTo(2,2);
//Makes it immobile
ground.body.immovable = true;

//On crée le groupe des joueurs
players = game.add.physicsgroup(Phaser.Physics.ARCADE);

//On active la physique sur les joueurs
//players.physicsbodytype = Phaser.Physics.ARCADE;  
game.physics.arcade.enable(players);
//Set the physic properties.
//players.body.bounce.y = 0.2;
//players.body.gravity.y = 300;
//players.body.collideWorldBounds = true;



for (var i=0;i<nb_players;i++)
{
    //On crée les joueurs
    var player = players.create(0,32*i,'dude');
    //player.name = 'player' + i;
    //player.exists = false;
    //player.visible = false;
    //player.body.gravity.y.set(300);
    //player.body.bounce.y = 0.2;
    //player.body.collideWorldBounds = true;
}
//player1.body.gravity.y = 300;
//players.setALL('body.gravity.y',300,false,false,0,true);



}

function update() {
    //  Collide the player and the stars with the terrain
    game.physics.arcade.collide(players, terrain);
}


