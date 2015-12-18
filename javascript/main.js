// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamebox', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ground_1x1', '../assets/ground_1x1.png');
    game.load.image('star', '../assets/star.png');
    game.load.spritesheet('dude', '../assets/dude.png', 32, 48);

}

var map;
var layer1;
var layer2;
var layer3;

var marker;
var currentTile = 0;
var currentLayer;

var cursors;
var showLayersKey;
var layer1Key;
var layer2Key;
var layer3Key;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    platforms = game.add.group();
    platforms.enableBody = true;

    game.stage.backgroundColor = '#2d2d2d';

    player = game.add.sprite(0, 0, 'dude');
    game.camera.follow(player);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);


    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  Add a Tileset image to the map
    map.addTilesetImage('ground_1x1');

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer1 = map.create('level1',19 , 19, 32, 32);
    layer1.scrollFactorX = 0.5;
    layer1.scrollFactorY = 0.5;

    //  Resize the world
    layer1.resizeWorld();
    map.setCollisionBetween(0, 5, true, layer1)
    layer2 = map.createBlankLayer('level2', 40, 30, 32, 32);
    layer2.scrollFactorX = 0.8;
    layer2.scrollFactorY = 0.8;

    layer3 = map.createBlankLayer('level3', 40, 30, 32, 32);

    currentLayer = layer3;

    //  Create our tile selector at the top of the screen
    createTileSelector();

    game.input.addMoveCallback(updateMarker, this);

    cursors = game.input.keyboard.createCursorKeys();

    showLayersKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    layer1Key = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    layer2Key = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    layer3Key = game.input.keyboard.addKey(Phaser.Keyboard.THREE);

    showLayersKey.onDown.add(changeLayer, this);
    layer1Key.onDown.add(changeLayer, this);
    layer2Key.onDown.add(changeLayer, this);
    layer3Key.onDown.add(changeLayer, this);

    console.log(layer1.index);
    console.log(layer2.index);
    console.log(layer3.index);

}

function changeLayer(key) {

    switch (key.keyCode)
    {
        case Phaser.Keyboard.SPACEBAR:
            layer1.alpha = 1;
            layer2.alpha = 1;
            layer3.alpha = 1;
            break;

        case Phaser.Keyboard.ONE:
            currentLayer = layer1;
            layer1.alpha = 1;
            layer2.alpha = 0.2;
            layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.TWO:
            currentLayer = layer2;
            layer1.alpha = 0.2;
            layer2.alpha = 1;
            layer3.alpha = 0.2;
            break;

        case Phaser.Keyboard.THREE:
            currentLayer = layer3;
            layer1.alpha = 0.2;
            layer2.alpha = 0.2;
            layer3.alpha = 1;
            break;
    }

}

function pickTile(sprite, pointer) {

    currentTile = game.math.snapToFloor(pointer.x, 32) / 32;

}

function updateMarker() {

    marker.x = currentLayer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = currentLayer.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown)
    {
        map.putTile(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), currentLayer);
        // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
    }

}

function update() {

    game.physics.arcade.collide(player, layer1);
    var animation = 'none'

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        //Move to the left
        player.body.velocity.x = -150;
        animation = 'left';
    }
    if (cursors.right.isDown)
    {
        //Move to the right
        player.body.velocity.x = 150;
        animation = 'right';
    }
    if (cursors.up.isDown)
    {
        //Move to the right
        player.body.velocity.y = -150;
    }
    if (cursors.down.isDown)
    {
        //Move to the right
        player.body.velocity.y = 150;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (animation == 'none')
    {
        player.animations.stop()
        player.frame = 4;
    } else {
        player.animations.play(animation);
    }
}

function render() {

    game.debug.text('Current Layer: ' + currentLayer.name, 16, 550);
    game.debug.text('1-3 Switch Layers. SPACE = Show All. Cursors = Move Dude', 16, 570);

}

function createTileSelector() {

    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.5);
    tileSelectorBackground.drawRect(0, 0, 800, 34);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, 'ground_1x1');
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(pickTile, this);

    tileSelector.fixedToCamera = true;

    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

}
