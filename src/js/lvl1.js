lvl1 = function(game) {

};

var dudeSpriteHeight = 48.0, dudeSpriteWidth = 32.0;
var dudeHeight = 24.0, dudeWidth = 16.0;
var borderSize = 0;
var dude;
var cursors;
var invaderGroup;
var trailGroup;
var invaders = [];
var invaderSize = 16.0;
var invaderCount = 6;
var trailHeight = 8;
var trail = [];
var borderGroup;
var borders = [];

lvl1.prototype = {

    preload: function() {

    	game.load.spritesheet('dude', 'assets/images/dude.png', dudeSpriteWidth, dudeSpriteHeight);
        game.load.image('invader1', 'assets/images/invader1.png');
        game.load.image('invader2', 'assets/images/invader2.png');
        game.load.image('trail', 'assets/images/trail.png');
        game.load.image('border', 'assets/images/border.png');

        cursors = game.input.keyboard.createCursorKeys();
    },
    	
    create: function() {

    	game.physics.startSystem(Phaser.Physics.ARCADE);

        // borderGroup = game.add.group();
        // borderGroup.enableBody = true;
        // borders.push(borderGroup.create(0, game.world.height - borderSize, 'border'));
        // borders[0].scale.setTo(game.world.width / (borderSize / 600.0), borderSize / 600.0);

        // borders.push(borderGroup.create(0, 0, 'border'));
        // borders[1].scale.setTo(game.world.width / (borderSize / 600.0), borderSize / 600.0);
        
        // borders.push(borderGroup.create(0, 0, 'border'));
        // borders[2].scale.setTo(borderSize / 600.0, game.world.height / (borderSize / 600.0));

        // borders.push(borderGroup.create(game.world.width - borderSize, 0, 'border'));
        // borders[3].scale.setTo(borderSize / 600.0, game.world.height / (borderSize / 600.0));

        dude = game.add.sprite(0, game.world.height - dudeHeight / 2.0, 'dude');
        dude.enableBody = true;
        game.physics.arcade.enable(dude);
        dude.body.collideWorldBounds = true;
        dude.scale.setTo(dudeHeight / dudeSpriteHeight, dudeWidth / dudeSpriteWidth);

        dude.animations.add('left', [0, 1, 2 ,3], 10, true);
        dude.animations.add('right', [5, 6, 7, 8], 10, true);

        invaderGroup = game.add.group();
        invaderGroup.enableBody = true;

        trailGroup = game.add.group();
        trailGroup.enableBody = true;


        for (i = 0; i < invaderCount; i++) {

            if (Math.random() < 0.5)
                invaders.push(invaderGroup.create(game.world.width / (invaderCount + 1.0) * (i + 1), borderSize, 'invader1'));
            else
                invaders.push(invaderGroup.create(game.world.width / (invaderCount + 1.0) * (i + 1), borderSize, 'invader2'));

            invaders[i].scale.setTo(invaderSize / 600.0, invaderSize / 600.0);
            invaders[i].body.collideWorldBounds = true;
            invaders[i].body.velocity.x = 50 + 50 * Math.random();

            if (Math.random() < 0.5)
                invaders[i].body.velocity.x *= -1;

            invaders[i].body.velocity.y = 50 + Math.random() * 50;
            invaders[i].body.bounce.x = 1;
            invaders[i].body.bounce.y = 1;
        }
    },


    collision: function(invader, singleTrail) {

        for (i = 0; i < trail.length; i++)
            trail[i].kill();

        trail = [];
        dude.body.x = 0;
        dude.body.y = game.world.height - dude.body.height;

        return;
    },

    update: function() {

    	game.physics.arcade.overlap(trailGroup, invaderGroup, this.collision, null, this);

        dude.body.velocity.x = 0;
        dude.body.velocity.y = 0;

        if (cursors.left.isDown)
        {
            dude.body.velocity.x = -150;
            dude.animations.play('left');
            this.updateTrail();   
        }
        else if (cursors.right.isDown)
        {
            dude.body.velocity.x = 150;
            dude.animations.play('right');
            this.updateTrail();      
        }
        else if (cursors.up.isDown) {
            dude.body.velocity.y = -150;
            dude.animations.play('left');
            this.updateTrail();
        }
        else if (cursors.down.isDown) {
            dude.body.velocity.y = 150;
            dude.animations.play('right');  
            this.updateTrail();
        }
        else
        {
            dude.animations.stop();
            dude.frame = 4;
        }
    },

    updateTrail: function() {
        if (dude.body.x == 0 || dude.body.x == game.world.width - dude.body.width || 
                dude.body.y == 0 || dude.body.y == game.world.height - dude.body.height) {
            if (trail.length > 0) {
                for (i = 0; i < trail.length; i++)
                    trail[i].kill();

                trail = [];
            }
            return;
        }
        var cur = trailGroup.create(dude.body.x + dudeWidth / 2.0, dude.body.y + dudeHeight / 2.0, 'trail');
        cur.scale.setTo(trailHeight / 256.0, trailHeight / 256.0);
        trail.push(cur);
    }
};


