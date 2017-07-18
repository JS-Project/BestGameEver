lvl1 = function(game) {

};

var lifeCount = 3, textGroup, lifeText, textStyle = {font: "15pt Arial", fill: '#ffffff'};
var dudeSpriteHeight = 48.0, dudeSpriteWidth = 32.0;
var dudeHeight = 24.0, dudeWidth = 16.0;
var borderSize = 8.0;
var dudeStartX, dudeStartY;
var dude;
var cursors;
var invaderGroup;
var trailGroup;
var dudeCenterGroup, dudeCenter;
var invaders = [];
var invaderSize = 16.0;
var invaderCount = 1;
var trail = [];
var borderGroup;
var borders = [];
var isDead;
var totalArea;

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
        totalArea = game.world.height * game.world.width - 2 * game.world.height * borderSize - 2 * (game.world.width - 2 * borderSize) * borderSize;

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
        dudeStartX = borderSize - dudeWidth / 2.0;
        dudeStartY = game.world.height - borderSize - dudeHeight / 2.0;
        dude = game.add.sprite(dudeStartX, dudeStartY, 'dude');

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

        dudeCenter = dudeCenterGroup.create(borderSize, game.world.height - borderSize - 1);
        dudeCenter.body.height = 1.0;
        dudeCenter.body.width = 1.0;

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
        isDead = true;
        for (i = 0; i < trail.length; i++)
            trail[i].kill();
        trail = [];
        dude.body.x = dudeStartX;
        dude.body.y = dudeStartY;
        lifeCount--;
        if (lifeCount == 0) {
            // Game over
        }
        textGroup.remove(lifeText);
        lifeText = game.make.text(0, 0, 'life count: ' + lifeCount, textStyle);
        textGroup.add(lifeText);
    },

    trailIntersect: function(dudeCenter, singleTrail) {
        for (i = 0; i < trail.length; i++) {
            if (trail[i] == singleTrail) {
                if (i < trail.length) {
                    for (j = i; j < trail.length; j++) {
                        trail[j].kill();
                    }
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
        dude.body.y = dudeCenter.body.y - dudeHeight / 2.0;
        dude.body.velocity.x = 0;
        dude.body.velocity.y = 0;
        var ends = [];
        if (trail.length == 0)
            return;
        ends.push(trail[0]);
        for (i = 1; i < trail.length - 1; i++) {
            if ((trail[i].body.x == trail[i - 1].body.x && trail[i].body.x == trail[i + 1].body.x) || 
                (trail[i].body.y == trail[i - 1].body.y && trail[i].body.y == trail[i + 1].body.y))
                continue;
            else
                ends.push(trail[i]);
        }
        ends.push(trail[trail.length - 1]);
        for (i = 0; i < trail.length; i++) {
            trail[i].kill();
        }
        trail = [];
        for (i = 0; i < ends.length - 1; i++) {
            //console.log(ends[i].body.x + " " + ends[i].body.y);
            var first = i;
            var second = i + 1;
            var height, width;
            if ((ends[i].body.x == ends[i + 1].body.x && ends[i].body.y > ends[i + 1].body.y) || 
                (ends[i].body.y == ends[i + 1].body.y && ends[i].body.x > ends[i + 1].body.x)) {
                first = i + 1;
                second = i;
            }
            var newBorder = borderGroup.create(ends[first].x, ends[first].y, 'border');
            newBorder.scale.setTo(Math.abs(ends[i].body.x - ends[i + 1].body.x) + 2, Math.abs(ends[i].body.y - ends[i + 1].body.y) + 2);
            newBorder.body.immovable = true;
            borders.push(newBorder);
        }
        //console.log(ends[ends.length - 1].body.x + " " + ends[ends.length - 1].body.y);
    },

    update: function() {
        dudeCenter.body.x = dude.body.x + dudeWidth / 2.0;
        dudeCenter.body.y = dude.body.y + dudeHeight / 2.0;
        dude.body.velocity.x = 0;
        dude.body.velocity.y = 0;
        isDead = false;
        game.physics.arcade.overlap(trailGroup, invaderGroup, this.collision, null, this);
        game.physics.arcade.overlap(dudeCenterGroup, trailGroup, this.trailIntersect, null, this);
        game.physics.arcade.collide(dudeCenterGroup, borderGroup, this.dudeAtTheWall, null, this);
        game.physics.arcade.collide(invaderGroup, borderGroup);
        if (isDead)
            return;
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
        var cur = trailGroup.create(dudeCenter.body.x, dudeCenter.body.y, 'trail');
        cur.scale.setTo(2, 2);
        trail.push(cur);
    }
};

function getArea(points) {
    var doubleArea = 0;
    for (i = 0; i < points.length; i++) {
        doubleArea += points[i].body.x * points[(i + 1) % points.length].body.y - points[i].body.y * points[(i + 1) % points.length].body.x;
    }
    return Math.abs(doubleArea) * 0.5;
}

function getDist(first, second) {
    return Math.sqrt((first.body.x - second.body.x) * (first.body.x - second.body.x) + 
        (first.body.y - second.body.y) * (first.body.y - second.body.y));
}


