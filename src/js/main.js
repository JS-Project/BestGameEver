var game = new Phaser.Game(800, 600, Phaser.AUTO, '', 
	{
		preload: preloader, 
		create: create, 
		update: update
	}
);
function preloader() {
	game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
	cursors = game.input.keyboard.createCursorKeys();
}
	
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	dude = game.add.sprite(0, 0, 'dude');
	game.physics.arcade.enable(dude);
	dude.body.collideWorldBounds = true;
	dude.animations.add('left', [0, 1, 2 ,3], 10, true);
	dude.animations.add('right', [5, 6, 7, 8], 10, true);
}

function update() {
	dude.body.velocity.x = 0;
	dude.body.velocity.y = 0;
    if (cursors.left.isDown)
    {
        dude.body.velocity.x = -150;
        dude.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        dude.body.velocity.x = 150;
        dude.animations.play('right');
    }
    else if (cursors.up.isDown) {
    	dude.body.velocity.y = -150;
    	dude.animations.play('left');
    }
    else if (cursors.down.isDown) {
    	dude.body.velocity.y = 150;
    	dude.animations.play('right');	
    }
    else
    {
        dude.animations.stop();
        dude.frame = 4;
 	}
}
var dude;
var cursors;