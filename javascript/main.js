var game = new Phaser.Game(800,600, Phaser.AUTO, 'gamebox', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('sky', '../assets/sky.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.image('star', '../assets/star.png');
    game.load.image('ground_1x1', '../assets/ground_1x1.png');
    game.load.spritesheet('dude1', '../assets/dude1.png', 32, 32);
}

//Constantes*****
var LARGEURJEUX = 25; //nombre de tiles de large du jeux
var HAUTEURJEUX = 19; //nombre de tiles de haut du jeux
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

var gowhere;


//Tableaux?!
var tableauMap;

function create() {



//Add physic to the game
game.physics.startSystem(Phaser.Physics.ARCADE);

//**************************Map*************************//
createmap();
createPath();

//******************************************************//

//On crée le groupe d'objet inerte
terrain = game.add.group();
//On active la physique sur le terrain
terrain.enableBody= true;

//On crée le groupe des joueurs
players = game.add.group();

//On crée le joueur 1
player1 = players.create(entree_x*32,0,'dude1');
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
        player1.animations.stop()
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
    layer1 = map.create('level 1',LARGEURJEUX , HAUTEURJEUX, 32, 32);
    layer1.scrollFactorX = 0.5;
    layer1.scrollFactorY = 0.5;
    currentLayer = layer1;
    
    //On set la grosseur du monde selon la layer1
    layer1.resizeWorld();
    //On fait ensorte que les tiles 0 à 24 du tilesetimage soit "dur" (collision) dans la layer 1.
    map.setCollisionBetween(0, 3, true, layer1); 

    

   

/********************************************************************************************************
    //On trouve une position aléatoire 
    var tile_x = game.rnd.between(1,LARGEURJEUX-1);
    var tile_y = game.rnd.between(1,HAUTEURJEUX-1);    
    //On met une tile (la tile 3 du set) à la case trouver(en x et y) sur la map, sur la layer 1.
    //map.putTile(2,tile_x,tile_y, layer1);
*********************************************************************************************************/
}

function createPath()
{
    //On trouve la position d'entrée et de sortie du maze
    entree_x = game.rnd.between(1,LARGEURJEUX-2);
    //Entre la position d'entrée e dans le tableau
    tableauMap[entree_x][0]=3;

    //On met le mur du top
    for (i=0;i<LARGEURJEUX;i++)
    {
        //Top
        if (i != entree_x)
            tableauMap[i][0]=1;
    }
    //On met les mur de droite et de gauche
    for (i=0;i<HAUTEURJEUX;i++)
    {
        //droite
        tableauMap[0][i]=1;
        //Gauche
        tableauMap[LARGEURJEUX-1][i]=1;
    }



    //**************************************************************************

    //On fait un chemin, de l'entrée au coté opposer de la map. Àléatoire....
    curPos_x=entree_x; //Position actuel en x
    curPos_y=0; //position actuel en y

    //Si on est a l'entrée
    if ((curPos_x == entree_x) && (curPos_y==0)) 
    {
        curPos_y=1;
        tableauMap[curPos_x][curPos_y]=3;
    }

    while (curPos_y != HAUTEURJEUX-1)
    {
        getPath();
        //curPos_y = HAUTEURJEUX-1;
        tableauMap[curPos_x][curPos_y]=3;
    }
    sortie_x = curPos_x;

    //On met le mur du bas
    for (i=0;i<LARGEURJEUX;i++)
    {
        //Bas
        if (i != sortie_x)
            tableauMap[i][HAUTEURJEUX-1]=1;
    }


    //On parcourt le tableaux et on place les blocs à leurs place selon le numéro attribuer dans le tableau
    for (i=0;i<LARGEURJEUX;i++)
    {
        for (var j=0;j<HAUTEURJEUX;j++)
        {
            if (tableauMap[i][j]==1)
                map.putTile(2,i,j,layer1);

            if (tableauMap[i][j]==3)
                map.putTile(4,i,j,layer1);
        }            
    }
}

/*

*/
function getPath() 
{
    var goRight = 0;
    var goLeft = 0;
    var goFront = 0;
    var goPath;
    

    if (tableauMap[curPos_x-1][curPos_y]==0)
    {
        goLeft = 1;
        gowhere = 'left';
    }
    if (tableauMap[curPos_x+1][curPos_y]==0)
    {
        goRight = 1;
        gowhere = 'right';
    }        
    if (tableauMap[curPos_x][curPos_y+1]==0)
    {
        goFront = 1; 
        gowhere = 'front';
    }
        

    switch (goFront+goRight+goLeft)
    {
        case 1:
            curPos_x = curPos_x + goRight- goLeft;
            curPos_y = curPos_y + goFront;
        break;

        case 2:
            goPath = game.rnd.between(1,2);
            if (goFront)
            {
                if ( goPath==1 )
                {
                    curPos_y = curPos_y + 1; //va devant
                    gowhere = 'front';
                }
                    
                else
                {
                    curPos_x = curPos_x + goRight - goLeft; //va a gauche ou a droite
                    if (goLeft)
                        gowhere = 'left';
                    else
                        gowhere = 'right';
                }
                    
            }
            else
            {
                if (goPath == 1)
                {
                    curPos_x = curPos_x + 1; //va a droite
                    gowhere = 'right';
                }
                    
                else
                {
                    curPos_x = curPos_x - 1; //va a gauche
                    gowhere = 'left';
                }                    
            }

        break;

        case 3:
            goPath = game.rnd.between(1,3);
            switch (goPath)
            {
                case 1: //va devant
                    curPos_y = curPos_y + 1;
                    gowhere = 'front';
                break;

                case 2: //va a droite
                    curPos_x = curPos_x + 1;
                    gowhere = 'right';                    
                break;

                case 3: //va a gauche
                    curPos_x = curPos_x - 1;
                    gowhere = 'left';
                break;

                default:
                    alert('Erreur!');
            }
        break;

        default:
            alert('Erreur!!');
    }
    

    if (gowhere == 'front')
    {
        if (tableauMap[curPos_x-1][curPos_y-1]==0)
            tableauMap[curPos_x-1][curPos_y-1]=1;
        if (tableauMap[curPos_x+1][curPos_y-1]==0)
            tableauMap[curPos_x+1][curPos_y-1]=1;
        if (tableauMap[curPos_x][curPos_y-2]==0)
            tableauMap[curPos_x][curPos_y-2]=1;
    }
    if (gowhere == 'right')
    {
        if (tableauMap[curPos_x-2][curPos_y]==0)
            tableauMap[curPos_x-2][curPos_y]=1;
        if (tableauMap[curPos_x-1][curPos_y+1]==0)
            tableauMap[curPos_x-1][curPos_y+1]=1;
        if (tableauMap[curPos_x-1][curPos_y-1]==0)
            tableauMap[curPos_x-1][curPos_y-1]=1;
    }
    if (gowhere == 'left')
    {
        if (tableauMap[curPos_x+2][curPos_y]==0)
            tableauMap[curPos_x+2][curPos_y]=1;
        if (tableauMap[curPos_x+1][curPos_y+1]==0)
            tableauMap[curPos_x+1][curPos_y+1]=1;
        if (tableauMap[curPos_x+1][curPos_y-1]==0)
            tableauMap[curPos_x+1][curPos_y-1]=1;
    }
    
}