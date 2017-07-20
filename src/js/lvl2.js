lvl2 = function(game) {

};

var lifeCount = 3, textGroup, lifeText, textStyle = {font: "15pt Arial", fill: '#ffffff'};
var dudeSpriteHeight = 48.0, dudeSpriteWidth = 32.0;
var dudeHeight = 24.0, dudeWidth = 16.0;
var borderSize = 2.0, trailSize = 2.0;
var dudeStartX, dudeStartY;
var dude;
var cursors;
var invaderGroup;
var trailGroup;
var dudeCenterGroup, dudeCenter;
var invaders = [];
var invaderSize = 16.0;
var invaderCount = 2;
var trail = [];
var borderGroup;
var borders = [];
var isDead;
var totalArea, startArea;
var worldX, worldY;
var worldWidth, worldHeight;
var leftBorder = 2, rightBorder = 3, bottomBorder = 0, topBorder = 1;
var heartGroup, hearts, heartSize = 16;

lvl2.prototype = {

    preload: function() {

    	game.load.spritesheet('dude', 'assets/images/dude.png', dudeSpriteWidth, dudeSpriteHeight);
        game.load.image('invader1', 'assets/images/invader1.png');
        game.load.image('invader2', 'assets/images/invader2.png');
        game.load.image('border', 'assets/images/1x1_blue.png');
        game.load.image('trail', 'assets/images/1x1_red.png');
        game.load.image('heart', 'assets/images/heart.png');
        cursors = game.input.keyboard.createCursorKeys();
    },
    	
    create: function() {

    	game.physics.startSystem(Phaser.Physics.ARCADE);
        totalArea = game.world.height * game.world.width - 2 * game.world.height * borderSize - 2 * (game.world.width - 2 * borderSize) * borderSize;
        startArea = totalArea;
        worldX = 0;
        worldY = 0;
        worldWidth = 800;
        worldHeight = 600;
        heartGroup = game.add.group();
        hearts = [];
        for (i = 0; i < lifeCount; i++) {
            hearts.push(heartGroup.create(0, 0, 'heart'));
            hearts[i].scale.setTo(heartSize / 2400.0, heartSize / 2400.0);   
        }
        this.adjustHearts();
        borderGroup = game.add.group();
        borderGroup.enableBody = true;
        borders.push(borderGroup.create(0, game.world.height - borderSize, 'border'));
        borders[0].width = game.world.width;
        borders[0].height = borderSize;

        borders.push(borderGroup.create(0, 0, 'border'));
        borders[1].width = game.world.width;
        borders[1].height = borderSize;
        
        borders.push(borderGroup.create(0, 0, 'border'));
        borders[2].width = borderSize;
        borders[2].height = game.world.height;

        borders.push(borderGroup.create(game.world.width - borderSize, 0, 'border'));
        borders[3].width = borderSize;
        borders[3].height = game.world.height;

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
        dudeCenter.height = 1.0;
        dudeCenter.width = 1.0;

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
    },

    adjustHearts: function() {
        while (hearts.length != lifeCount) {
            hearts[hearts.length - 1].kill();
            hearts.length = hearts.length - 1;
        }
        for (i = 0; i < lifeCount; i++) {
            hearts[i].x = worldX + trailSize + i * heartSize;
            hearts[i].y = worldY + trailSize;
            console.log(hearts[i].x, hearts[i].y);
        }
    },

    collision: function(singleTrail, invader) {
        for (i = 0; i < trail.length; i++)
            trail[i].kill();
        trail = [];
        dudeCenter.body.x = worldX + trailSize;
        dudeCenter.body.y = worldY + worldHeight - trailSize - 1;
        dude.body.y = dudeCenter.body.y - dudeHeight / 2.0;
        dude.body.x = dudeCenter.body.x - dudeWidth / 2.0;
        lifeCount--;
        this.adjustHearts();
        if (lifeCount == 0) {
            isDead = true;
            for (i = 0; i < borders.length; i++)
                borders[i].kill();
            dude.kill();
            lifeText = game.make.text(game.world.width / 2.0 - 60, game.world.height / 2.0 - 3, 'Game Over', textStyle);
            textGroup.add(lifeText);
            return;
        }
    },

    dudeAtTheWall: function(dudeCenter, border) {
        dude.body.velocity.x = 0;
        dude.body.velocity.y = 0;
        dude.body.x = dudeCenter.body.x - dudeWidth / 2.0;
        dude.body.y = dudeCenter.body.y - dudeHeight / 2.0;
        var ends = [];
        if (trail.length == 0)
            return;
        var newStart = this.getNearestPointOnBorder(trail[0]);
        var newEnd = this.getNearestPointOnBorder(trail[trail.length - 1]);
        trail.splice(0, 0, trailGroup.create(newStart.x, newStart.y, 'trail'));
        trail.push(trailGroup.create(newEnd.x, newEnd.y, 'trail'));
        ends.push(newStart);
        for (i = 1; i < trail.length - 1; i++) {
            if ((trail[i].body.x == trail[i - 1].body.x && trail[i].body.x == trail[i + 1].body.x) || 
                (trail[i].body.y == trail[i - 1].body.y && trail[i].body.y == trail[i + 1].body.y))
                continue;
            else
                ends.push(new Phaser.Point(trail[i].x, trail[i].y));
        }
        ends.push(newEnd);
        for (i = 0; i < trail.length; i++) {
            trail[i].kill();
        }
        trail = [];
        for (i = 0; i < ends.length - 1; i++) {
            var first = i;
            var second = i + 1;
            if ((ends[i].x == ends[i + 1].x && ends[i].y > ends[i + 1].y) || 
                (ends[i].y == ends[i + 1].y && ends[i].x > ends[i + 1].x)) {
                first = i + 1;
                second = i;
            }
            var newBorder = borderGroup.create(ends[first].x, ends[first].y, 'border');
            newBorder.width = Math.abs(ends[i].x - ends[i + 1].x) + trailSize;
            newBorder.height = Math.abs(ends[i].y - ends[i + 1].y) + trailSize;
            newBorder.body.immovable = true;
            borders.push(newBorder);
            var poly;
            if (newBorder.width == trailSize) { //vertical
                var leftArea = (newBorder.x - borders[leftBorder].x) * worldHeight;
                var rightArea = (borders[rightBorder].x - newBorder.x) * worldHeight;
                totalArea = Math.max(leftArea, rightArea);
                if (leftArea > rightArea) {
                    for (j = 0; j < invaders.length; j++) {
                        if (invaders[j].body.x > newBorder.x) {
                            invaders[j].kill();
                            invaderCount--;
                        }
                    }
                    worldWidth = newBorder.x - borders[leftBorder].x + trailSize;
                    borders[rightBorder].kill();
                    borders[rightBorder] = newBorder;
                } else {
                    for (j = 0; j < invaders.length; j++) {
                        if (invaders[j].body.x < newBorder.x) {
                            invaders[j].kill();
                            invaderCount--;
                        }
                    }
                    worldWidth = borders[rightBorder].x - newBorder.x + trailSize;
                    borders[leftBorder].kill();
                    borders[leftBorder] = newBorder;
                    borders[topBorder].body.x = newBorder.x;
                    borders[bottomBorder].body.x = newBorder.x;
                    worldX = newBorder.x;
                }
                borders[topBorder].width = worldWidth;
                borders[bottomBorder].width = worldWidth;
            } else { //horizontal
                var topArea = (newBorder.y - borders[topBorder].y) * worldWidth;
                var bottomArea = (borders[bottomBorder].y - newBorder.y) * worldWidth;
                totalArea = Math.max(topArea, bottomArea);
                if (topArea > bottomArea) {
                    for (j = 0; j < invaders.length; j++) {
                        if (invaders[j].body.y > newBorder.y) {
                            invaders[j].kill();
                            invaderCount--;
                        }
                    }
                    worldHeight = newBorder.y - borders[topBorder].y + trailSize;
                    borders[bottomBorder].kill();
                    borders[bottomBorder] = newBorder;
                } else {
                    for (j = 0; j < invaders.length; j++) {
                        if (invaders[j].body.y < newBorder.y) {
                            invaders[j].kill();
                            invaderCount--;
                        }
                    }
                    worldHeight = borders[bottomBorder].y - newBorder.y + trailSize;
                    borders[topBorder].kill();
                    borders[topBorder] = newBorder;
                    borders[rightBorder].body.y = newBorder.y;
                    borders[leftBorder].body.y = newBorder.y;
                    worldY = newBorder.y;
                }
                borders[rightBorder].height = worldHeight;
                borders[leftBorder].height = worldHeight;
            }
        }
        if (invaderCount == 0 || totalArea < startArea * 5 / 100) {
            for (i = 0; i < borders.length; i++)
                borders[i].kill();
            dude.kill();
            lifeText = game.make.text(game.world.width / 2.0 - 40, game.world.height / 2.0 - 3, 'VICTORY', textStyle);
            textGroup.add(lifeText);
            return;
        }
        this.adjustHearts();
        this.adjustDude();
    },

    adjustDude: function() {
        dudeCenter.body.x = Math.max(dudeCenter.body.x, worldX + trailSize);
        dudeCenter.body.y = Math.max(dudeCenter.body.y, worldY + trailSize);
        dudeCenter.body.x = Math.min(dudeCenter.body.x, worldX + worldWidth - trailSize - 1);
        dudeCenter.body.y = Math.min(dudeCenter.body.y, worldY + worldHeight - trailSize - 1);
    },

    update: function() {
        if (lifeCount == 0)
            return;
        if (invaderCount == 0 || totalArea < startArea * 5 / 100) {
            return;
        }
        dudeCenter.body.x = dude.body.x + dudeWidth / 2.0;
        dudeCenter.body.y = dude.body.y + dudeHeight / 2.0;
        isDead = false;
        game.physics.arcade.collide(dudeCenterGroup, borderGroup, this.dudeAtTheWall, null, this);
        game.physics.arcade.overlap(trailGroup, invaderGroup, this.collision, null, this);
        game.physics.arcade.collide(invaderGroup, borderGroup);
        if (isDead)
            return;
        if (this.isDudeAtTheWall()) {
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
        } else {
            this.updateTrail();
        }
    },

    isDudeAtTheWall: function() {
        return (dudeCenter.body.x == worldX + borderSize || dudeCenter.body.x == worldX + worldWidth - borderSize - 1 ||
            dudeCenter.body.y == worldY + borderSize || dudeCenter.body.y == worldY + worldHeight - borderSize - 1);
    },

    updateTrail: function() {
        if (this.isDudeAtTheWall()) {
            return;
        }
        var cur = trailGroup.create(dudeCenter.body.x, dudeCenter.body.y, 'trail');
        cur.scale.setTo(trailSize, trailSize);
        trail.push(cur);
    },

    //returns nearest point, which belongs to any border
    getNearestPointOnBorder: function(point) {
        var bestDist = 20000000;
        var ans;
        var x, y;
        for (i = 0; i < borders.length; i++) {
            if (i == 2 || i == 3) { //vertical border
                if (Math.abs(point.x - borders[i].body.x) < bestDist) {
                    bestDist = Math.abs(point.x - borders[i].body.x);
                    x = borders[i].body.x;
                    y = point.y;
                }
            } else if (i == 0 || i == 1) { //horizontal border
                if (Math.abs(point.y - borders[i].body.y) < bestDist) {
                    bestDist = Math.abs(point.y - borders[i].body.y);
                    x = point.x;
                    y = borders[i].body.y;
                }
            } 
        }
        ans = new Phaser.Point(x, y);
        return ans;
    }


};
