lvl2 = function(game) {

};

var textGroup, lifeText; // this.game.assets.textStyle = {font: "15pt Arial", fill: '#ffffff'};
var dudeStartX, dudeStartY;
var dude;
var cursors;
var invaderGroup;
var trailGroup;
var dudeCenterGroup, dudeCenter;
var invaders = [];
var invaderSize = 16.0;
var invaderCount = 5;
var trail = [];
var borderGroup;
var borders = [];
var isDead;
var totalArea, startArea;
var worldX, worldY;
var worldWidth, worldHeight;
var leftBorder = 2, rightBorder = 3, bottomBorder = 0, topBorder = 1;
var heartGroup, hearts;
var winPercent = 5, invaderPercent = 20;


lvl2.prototype = {

    preload: function() {

    	game.load.spritesheet('dude', this.game.assets.dudeImage, this.game.assets.dudeSpriteWidth, this.game.assets.dudeSpriteHeight);
        game.load.image('invader1', this.game.assets.invader1Image);
        game.load.image('invader2', this.game.assets.invader2Image);
        game.load.image('border', this.game.assets.borderImage);
        game.load.image('trail', this.game.assets.trailImage);
        game.load.image('heart', this.game.assets.heartImage);
        cursors = game.input.keyboard.createCursorKeys();
    },
    	
    create: function() {

    	game.physics.startSystem(Phaser.Physics.ARCADE);
        totalArea = game.world.height * game.world.width - 2 * game.world.height * this.game.assets.borderSize - 2 * (game.world.width - 2 * this.game.assets.borderSize) * this.game.assets.borderSize;
        startArea = totalArea;
        worldX = 0;
        worldY = 0;
        worldWidth = 800;
        worldHeight = 600;
        heartGroup = game.add.group();
        hearts = [];
        for (i = 0; i < this.game.assets.lifeCount; i++) {
            hearts.push(heartGroup.create(0, 0, 'heart'));
            hearts[i].scale.setTo(this.game.assets.heartSize / 2400.0, this.game.assets.heartSize / 2400.0);   
        }
        this.adjustHearts();
        borderGroup = game.add.group();
        borderGroup.enableBody = true;
        borders.push(borderGroup.create(0, game.world.height - this.game.assets.borderSize, 'border'));
        borders[0].width = game.world.width;
        borders[0].height = this.game.assets.borderSize;

        borders.push(borderGroup.create(0, 0, 'border'));
        borders[1].width = game.world.width;
        borders[1].height = this.game.assets.borderSize;
        
        borders.push(borderGroup.create(0, 0, 'border'));
        borders[2].width = this.game.assets.borderSize;
        borders[2].height = game.world.height;

        borders.push(borderGroup.create(game.world.width - this.game.assets.borderSize, 0, 'border'));
        borders[3].width = this.game.assets.borderSize;
        borders[3].height = game.world.height;

        for (i = 0; i < 4; i++)
            borders[i].body.immovable = true;
        //align dudecenter with border
        dudeStartX = this.game.assets.borderSize - this.game.assets.dudeWidth / 2.0;
        dudeStartY = game.world.height - this.game.assets.borderSize - this.game.assets.dudeHeight / 2.0;
        dude = game.add.sprite(dudeStartX, dudeStartY, 'dude');

        dude.enableBody = true;
        game.physics.arcade.enable(dude);
        dude.body.collideWorldBounds = false;
        dude.scale.setTo(this.game.assets.dudeHeight / this.game.assets.dudeSpriteHeight, this.game.assets.dudeWidth / this.game.assets.dudeSpriteWidth);

        dude.animations.add('left', [0, 1, 2 ,3], 10, true);
        dude.animations.add('right', [5, 6, 7, 8], 10, true);

        invaderGroup = game.add.group();
        invaderGroup.enableBody = true;

        trailGroup = game.add.group();
        trailGroup.enableBody = true;

        dudeCenterGroup = game.add.group();
        dudeCenterGroup.enableBody = true;

        dudeCenter = dudeCenterGroup.create(this.game.assets.borderSize, game.world.height - this.game.assets.borderSize - 1);
        dudeCenter.height = 1.0;
        dudeCenter.width = 1.0;

        for (i = 0; i < invaderCount; i++) {
            if (Math.random() < 0.5)
                invaders.push(invaderGroup.create(game.world.width / (invaderCount + 1.0) * (i + 1), this.game.assets.borderSize, 'invader1'));
            else
                invaders.push(invaderGroup.create(game.world.width / (invaderCount + 1.0) * (i + 1), this.game.assets.borderSize, 'invader2'));
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
        while (hearts.length != this.game.assets.lifeCount) {
            hearts[hearts.length - 1].kill();
            hearts.length = hearts.length - 1;
        }
        for (i = 0; i < this.game.assets.lifeCount; i++) {
            hearts[i].x = worldX + this.game.assets.trailSize + i * this.game.assets.heartSize;
            hearts[i].y = worldY + this.game.assets.trailSize;
            console.log(hearts[i].x, hearts[i].y);
        }
    },

    collision: function(singleTrail, invader) {
        for (i = 0; i < trail.length; i++)
            trail[i].kill();
        trail = [];
        dudeCenter.body.x = worldX + this.game.assets.trailSize;
        dudeCenter.body.y = worldY + worldHeight - this.game.assets.trailSize - 1;
        dude.body.y = dudeCenter.body.y - this.game.assets.dudeHeight / 2.0;
        dude.body.x = dudeCenter.body.x - this.game.assets.dudeWidth / 2.0;
        this.game.assets.lifeCount--;
        this.adjustHearts();
        if (this.game.assets.lifeCount == 0) {
            isDead = true;
            for (i = 0; i < borders.length; i++)
                borders[i].kill();
            dude.kill();
            lifeText = game.make.text(game.world.width / 2.0 - 60, game.world.height / 2.0 - 3, 'Game Over', this.game.assets.textStyle);
            textGroup.add(lifeText);
            return;
        }
    },

    dudeAtTheWall: function(dudeCenter, border) {
        dude.body.velocity.x = 0;
        dude.body.velocity.y = 0;
        dude.body.x = dudeCenter.body.x - this.game.assets.dudeWidth / 2.0;
        dude.body.y = dudeCenter.body.y - this.game.assets.dudeHeight / 2.0;
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
            newBorder.width = Math.abs(ends[i].x - ends[i + 1].x) + this.game.assets.trailSize;
            newBorder.height = Math.abs(ends[i].y - ends[i + 1].y) + this.game.assets.trailSize;
            newBorder.body.immovable = true;
            borders.push(newBorder);
            var poly;
            if (newBorder.width == this.game.assets.trailSize) { //vertical
                var leftArea = (newBorder.x - borders[leftBorder].x) * worldHeight;
                var rightArea = (borders[rightBorder].x - newBorder.x) * worldHeight;
                var leftInvaderCount = 0, rightInvaderCount = 0;
                for (i = 0; i < invaders.length; i++) {
                    if (invaders[i].body.x > newBorder.x) {
                        rightInvaderCount++;
                    } else {
                        leftInvaderCount++;
                    }
                }
                if (leftArea + leftInvaderCount * startArea * invaderPercent / 100.0 > rightArea + rightInvaderCount * startArea * invaderPercent / 100.0) {
                    for (j = 0; j < invaders.length; j++) {
                        if (invaders[j].body.x > newBorder.x) {
                            invaders[j].kill();
                            invaderCount--;
                            invaders.splice(j, 1);
                            j--;
                        }
                    }

                    totalArea = leftArea;
                    worldWidth = newBorder.x - borders[leftBorder].x + this.game.assets.trailSize;

                    borders[rightBorder].kill();
                    borders[rightBorder] = newBorder;
                } else {
                    for (j = 0; j < invaders.length; j++) {
                        if (invaders[j].body.x < newBorder.x) {
                            invaders[j].kill();
                            invaderCount--;
                            invaders.splice(j, 1);
                            j--;
                        }
                    }

                    totalArea = rightArea;
                    worldWidth = borders[rightBorder].x - newBorder.x + this.game.assets.trailSize;

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
                var topInvaderCount = 0, bottomInvaderCount = 0;
                for (i = 0; i < invaders.length; i++) {
                    if (invaders[i].body.y > newBorder.y) {
                        bottomInvaderCount++;
                    } else {
                        topInvaderCount++;
                    }
                }                
                if (topArea + topInvaderCount * startArea * invaderPercent / 100.0 > bottomArea + bottomInvaderCount * startArea * invaderPercent / 100.0) {
                    for (j = 0; j < invaders.length; j++) {
                        if (invaders[j].body.y > newBorder.y) {
                            invaders[j].kill();
                            invaderCount--;
                            invaders.splice(j, 1);
                            j--;
                        }
                    }

                    totalArea = topArea;
                    worldHeight = newBorder.y - borders[topBorder].y + this.game.assets.trailSize;

                    borders[bottomBorder].kill();
                    borders[bottomBorder] = newBorder;
                } else {
                    for (j = 0; j < invaders.length; j++) {
                        if (invaders[j].body.y < newBorder.y) {
                            invaders[j].kill();
                            invaderCount--;
                            invaders.splice(j, 1);
                            j--;
                        }
                    }

                    totalArea = bottomArea;
                    worldHeight = borders[bottomBorder].y - newBorder.y + this.game.assets.trailSize;

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
        if (invaderCount == 0 || totalArea < startArea * winPercent / 100) {
            for (i = 0; i < borders.length; i++)
                borders[i].kill();
            dude.kill();
            lifeText = game.make.text(game.world.width / 2.0 - 40, game.world.height / 2.0 - 3, 'VICTORY', this.game.assets.textStyle);
            textGroup.add(lifeText);
            return;
        }
        this.adjustHearts();
        this.adjustDude();
    },

    adjustDude: function() {
        dudeCenter.body.x = Math.max(dudeCenter.body.x, worldX + this.game.assets.trailSize);
        dudeCenter.body.y = Math.max(dudeCenter.body.y, worldY + this.game.assets.trailSize);
        dudeCenter.body.x = Math.min(dudeCenter.body.x, worldX + worldWidth - this.game.assets.trailSize - 1);
        dudeCenter.body.y = Math.min(dudeCenter.body.y, worldY + worldHeight - this.game.assets.trailSize - 1);
    },

    update: function() {
        if (this.game.assets.lifeCount == 0)
            return;
        if (invaderCount == 0 || totalArea < startArea * 5 / 100) {
            return;
        }
        dudeCenter.body.x = dude.body.x + this.game.assets.dudeWidth / 2.0;
        dudeCenter.body.y = dude.body.y + this.game.assets.dudeHeight / 2.0;
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
        return (dudeCenter.body.x == worldX + this.game.assets.borderSize || dudeCenter.body.x == worldX + worldWidth - this.game.assets.borderSize - 1 ||
            dudeCenter.body.y == worldY + this.game.assets.borderSize || dudeCenter.body.y == worldY + worldHeight - this.game.assets.borderSize - 1);
    },

    updateTrail: function() {
        if (this.isDudeAtTheWall()) {
            return;
        }
        var cur = trailGroup.create(dudeCenter.body.x, dudeCenter.body.y, 'trail');
        cur.scale.setTo(this.game.assets.trailSize, this.game.assets.trailSize);
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
