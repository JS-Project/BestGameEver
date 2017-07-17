lvl1 = function(game) {

};

var lifeCount = 3, textGroup, lifeText, textStyle = {font: "15pt Arial", fill: '#ffffff'};
var dudeSpriteHeight = 48.0, dudeSpriteWidth = 32.0;
var dudeHeight = 24.0, dudeWidth = 16.0;
var borderSize = 8.0;
var dude;
var cursors;
var invaderGroup;
var trailGroup;
var dudeCenterGroup, dudeCenter;
var invaders = [];
var invaderSize = 16.0;
var invaderCount = 0;
var trail = [];
var borderGroup;
var borders = [];

lvl1.prototype = {

    preload: function() {

    	game.load.spritesheet('dude', 'assets/images/dude.png', dudeSpriteWidth, dudeSpriteHeight);
        game.load.image('invader1', 'assets/images/invader1.png');
        game.load.image('invader2', 'assets/images/invader2.png');
        game.load.image('border', 'assets/images/1x1_blue.png');
        game.load.image('trail', 'assets/images/1x1_red.png')

        cursors = game.input.keyboard.createCursorKeys();
    },
    	
    create: function() {

    	game.physics.startSystem(Phaser.Physics.ARCADE);

        borderGroup = game.add.group();
        borderGroup.enableBody = true;
        borders.push(borderGroup.create(0, game.world.height - borderSize, 'border'));
        borders[0].scale.setTo(game.world.width, borderSize);

        borders.push(borderGroup.create(0, 0, 'border'));
        borders[1].scale.setTo(game.world.width, borderSize);
        
        borders.push(borderGroup.create(0, 0, 'border'));
        borders[2].scale.setTo(borderSize, game.world.height);

        borders.push(borderGroup.create(game.world.width - borderSize, 0, 'border'));
        borders[3].scale.setTo(borderSize, game.world.height);

        for (i = 0; i < 4; i++)
            borders[i].body.immovable = true;
        //align dudecenter with border
        dude = game.add.sprite(borderSize - dudeWidth / 2.0, game.world.height - borderSize - dudeHeight / 2.0, 'dude');

        dude.enableBody = true;
        game.physics.arcade.enable(dude);
        dude.body.collideWorldBounds = false;
        dude.scale.setTo(dudeHeight / dudeSpriteHeight, dudeWidth / dudeSpriteWidth);

        dude.animations.add('left', [0, 1, 2 ,3], 10, true);
        dude.animations.add('right', [5, 6, 7, 8], 10, true);

        invaderGroup = game.add.group();
        invaderGroup.enableBody = true;

        trailGroup = game.add.group();
        trailGroup.enableBody = true;

        dudeCenterGroup = game.add.group();
        dudeCenterGroup.enableBody = true;

        dudeCenter = dudeCenterGroup.create(dude.body.x + dudeWidth / 2.0, dude.body.y + dudeHeight / 2.0 - 1);
        dudeCenter.body.height = 1.0;
        dudeCenter.body.width = 1.0;

        console.log(dudeCenter.body.x);

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
        textGroup = game.add.group();
        lifeText = game.make.text(0, 0, 'life count: ' + lifeCount, textStyle);
        textGroup.add(lifeText);    
    },


    collision: function(singleTrail, invader) {
        for (i = 0; i < trail.length; i++)
            trail[i].kill();
        trail = [];
        dude.body.x = 0;
        dude.body.y = game.world.height - dude.body.height;
        lifeCount--;
        if (lifeCount == 0) {
            // Game over
        }
        textGroup.remove(lifeText);
        lifeText = game.make.text(0, 0, 'life count: ' + lifeCount, textStyle);
        textGroup.add(lifeText);
    },

    trailIntersect: function(dude, singleTrail) {
        for (i = 0; i < trail.length; i++) {
            if (trail[i] == singleTrail) {
                if (i < trail.length) {
                    for (j = i; j < trail.length; j++)
                        trail[j].kill();
                    trail.length = i;
                    break;
                }
                else
                    break;
            }
        }
    },

    dudeAtTheWall: function(dudeCenter, border) {
        dude.body.x = dudeCenter.body.x - dudeWidth / 2.0;
        dude.body.y = dudeCenter.body.y - dudeHeight / 2.0
        if (trail.length > 8) {

        }
        if (trail.length > 0) {
            for (i = 0; i < trail.length; i++)
                trail[i].kill();
            trail = [];
        }
    },

    update: function() {

        dudeCenter.body.x = dude.body.x + dudeWidth / 2.0;
        dudeCenter.body.y = dude.body.y + dudeHeight / 2.0;

        game.physics.arcade.overlap(trailGroup, invaderGroup, this.collision, null, this);
        game.physics.arcade.overlap(dudeCenterGroup, trailGroup, this.trailIntersect, null, this);
        game.physics.arcade.collide(dudeCenter, borderGroup, this.dudeAtTheWall, null, this);
        game.physics.arcade.collide(invaderGroup, borderGroup);

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
        if (dudeCenter.body.x == borderSize || dudeCenter.body.x == game.world.width - borderSize - 1 || 
                dudeCenter.body.y == borderSize || dudeCenter.body.y == game.world.height - borderSize - 1) {
            return;
        }
        var cur = trailGroup.create(dudeCenter.body.x, dudeCenter.body.y,  'trail');
        cur.scale.setTo(2, 2);
        trail.push(cur);
    }
};


