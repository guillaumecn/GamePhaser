var game = new Phaser.Game(800,600, Phaser.AUTO, 'gamebox', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', '../assets/sky.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.image('star', '../assets/star.png');
    game.load.spritesheet('dude1', '../assets/dude1.png', 32, 32);
}



//var players;
var terrain;
var cursors;

function create() {

//Background sky
//game.add.sprite(0,0,'sky');



//Add physic to the game
game.physics.startSystem(Phaser.Physics.ARCADE);
game.stage.backgroundColor = '#2d2d2d';

//On crée le groupe d'objet inerte
terrain = game.add.group();
//On active la physique sur le terrain
terrain.enableBody= true;

//On crée le groupe des joueurs
players = game.add.group();

//On crée le joueur 1
player1 = players.create(50,50,'dude1');
//player1 = game.add.sprite(50,50,'dude');
//On fait suivre la camera sur le joueur
game.camera.follow(player1);
//On active et set la physique du joueur 1
game.physics.arcade.enable(player1);
player1.body.collideWorldBounds = true;

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
    //  Reset the players velocity (movement)
    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        //Move to the left
        player1.body.velocity.x = -150;
        animation = 'left';
    }
    if (cursors.right.isDown)
    {
        //Move to the right
        player1.body.velocity.x = 150;
        animation = 'right';
    }
    if (cursors.up.isDown)
    {
        //Move up
        player1.body.velocity.y = -150;
        animation = 'up';
    }
    if (cursors.down.isDown)
    {
        //Move down
        player1.body.velocity.y = 150;
        animation = 'down';
    }

    //Stand still or play the animation
     if (animation == 'none')
    {
        player1.animations.stop()
        //player1.frame = 1;
    } else {
        player1.animations.play(animation);
    }
//**************************************************************
}


