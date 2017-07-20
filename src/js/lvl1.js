lvl1 = function(game) {

};

var lifeCount = 1, textGroup, lifeText, textStyle = {font: "15pt Arial", fill: '#ffffff'};
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
var invaderCount = 1;
var trail = [];
var borderGroup;
var borders = [];
var isDead;
var totalArea;
var borderPoints = [];
var foundInvader = 0;

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
        lifeText = game.make.text(0, 0, 'life count: ' + lifeCount, textStyle);
        textGroup.add(lifeText);    
    },


    collision: function(singleTrail, invader) {
        isDead = true;
        for (i = 4; i < borders.length; i++)
            borders[i].kill();
        borders.length = 4;
        for (i = 0; i < trail.length; i++)
            trail[i].kill();
        trail = [];
        dude.body.x = dudeStartX;
        dude.body.y = dudeStartY;
        lifeCount--;
        if (lifeCount == 0) {
            for (i = 0; i < borders.length; i++)
                borders[i].kill();
            dude.kill();
            textGroup.remove(lifeText);
            lifeText = game.make.text(game.world.width / 2.0 - 60, game.world.height / 2.0 - 3, 'Game Over', textStyle);
            textGroup.add(lifeText);
            return;
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

        var node = new Phaser.Point(trail[0].x+1, trail[0].y+1);

        this.fillArea(node, trail, borders);

      

        console.log("finished filling area\n");

        var newStart = this.getNearestPointOnBorder(trail[0]);
        var newEnd = this.getNearestPointOnBorder(trail[trail.length - 1]);
        trail.splice(0, 0, trailGroup.create(newStart.x, newStart.y, 'trail'));
        trail.push(trailGroup.create(newEnd.x, newEnd.y, 'trail'));
        for (i = 0; i < trail.length; i++) {
            trail[i].kill();
        }
       
        trail = [];
        // ends.push(newStart);
        // for (i = 1; i < trail.length - 1; i++) {
        //     if ((trail[i].body.x == trail[i - 1].body.x && trail[i].body.x == trail[i + 1].body.x) || 
        //         (trail[i].body.y == trail[i - 1].body.y && trail[i].body.y == trail[i + 1].body.y))
        //         continue;
        //     else
        //         ends.push(new Phaser.Point(trail[i].x, trail[i].y));
        // }
        // ends.push(newEnd);
      
        // var newBorderStartIndex = borders.length;
        // for (i = 0; i < ends.length - 1; i++) {
        //     var first = i;
        //     var second = i + 1;
        //     if ((ends[i].x == ends[i + 1].x && ends[i].y > ends[i + 1].y) || 
        //         (ends[i].y == ends[i + 1].y && ends[i].x > ends[i + 1].x)) {
        //         first = i + 1;
        //         second = i;
        //     }
        //     var newBorder = borderGroup.create(ends[first].x, ends[first].y, 'border');
        //     newBorder.scale.setTo(Math.abs(ends[i].x - ends[i + 1].x) + trailSize, 
        //         Math.abs(ends[i].y - ends[i + 1].y) + trailSize);
        //     newBorder.body.immovable = true;
        //     borders.push(newBorder);
        // }
        // var newBorderEndIndex = borders.length - 1;
        // var dir = (ends[ends.length - 2].x < ends[ends.length - 1].x || 
        //     (ends[ends.length - 2].x >= ends[ends.length - 1].x && ends[ends.length - 2].y < ends[ends.length - 1].y));
        // var curPoint = ends[ends.length - 1];
        // var oldIndex = borders.length - 1;
        // var curIndex = this.getBorderIndex(curPoint, oldIndex);
        // if (borders[borders.length - 1].width == borderSize) {//vertical
        //     dir = !dir;
        // }
       // console.log(borders[curIndex].x + " " + borders[curIndex].y + " " + borders[curIndex].width + " " + borders[curIndex].height);
        // while (true) {
        //     break;
        //     var newBorder;
        //     if (borders[curIndex].width == borderSize) {//vertical
        //         if (dir) {
        //             var startY = borders[oldIndex].y;
        //             var endY = borders[curIndex].y + borders[curIndex].height;
        //             newBorder = this.getBorderForVerticalSegment(startY, endY, borders[curIndex].x, false, curIndex, oldIndex);
        //             dir = true;
        //             if (newBorder == -1) {
        //                 newBorder = this.getBorderIndex(new Phaser.Point(borders[curIndex].x, borders[curIndex].y + borders[curIndex].height), curIndex);
        //                 dir = true;
        //             }
        //         } else {
        //             var endY = borders[oldIndex].y;
        //             var startY = borders[curIndex].y;
        //             newBorder = this.getBorderForVerticalSegment(startY, endY, borders[curIndex].x, true, curIndex, oldIndex);
        //             dir = false;
        //             if (newBorder == -1) {
        //                 newBorder = this.getBorderIndex(new Phaser.Point(borders[curIndex].x, borders[curIndex].y, curIndex));
        //                 dir = false;
        //             }
        //         }
        //         console.log("Y - " + startY, endY);
        //     } else {//horizontal
        //         if (dir) {
        //             var startX = borders[curIndex].x;
        //             var endX = borders[oldIndex].x;
        //             newBorder = this.getBorderForHorizontalSegment(endX, startX, borders[curIndex].y, false, curIndex, oldIndex);
        //             dir = true;
        //             if (newBorder == -1) {
        //                 newBorder = this.getBorderIndex(new Phaser.Point(borders[curIndex].x, borders[curIndex].y), curIndex);
        //                 dir = true;
        //             }
        //         } else {
        //             var startX = borders[oldIndex].x;
        //             var endX = borders[curIndex].x + borders[curIndex].width;
        //             newBorder = this.getBorderForHorizontalSegment(startX, endX, borders[curIndex].y, true, curIndex, oldIndex);
        //             dir = false;
        //             if (newBorder == -1) {
        //                 newBorder = this.getBorderIndex(new Phaser.Point(borders[curIndex].x + borders[curIndex].width, borders[curIndex].y), curIndex);
        //                 dir = false;
        //             }
        //         }
        //         console.log("X - " + startX, endX);
        //     }
            // oldIndex = curIndex;
            // curIndex = newBorder;
            // if (curIndex == -1) {
            //     console.log("-1");
            //     break;
            // }
            // console.log(dir);
            // console.log(curIndex);
            // console.log(borders[curIndex].x + " " + borders[curIndex].y + " " + borders[curIndex].width + " " + borders[curIndex].height);
            // console.log("--------------");
            // if (curIndex >= newBorderStartIndex)
            //     break; 
       // }

        //console.log(ends[ends.length - 1].body.x + " " + ends[ends.length - 1].body.y);
    },

    getBorderForHorizontalSegment: function(startX, endX, y, greater, otherIndex1, otherIndex2) {
        var segment = new Phaser.Line(startX, y, endX, y);
        console.log(segment);
        var ans = -1, dist = 2000000, index = -1;
        for (i = 0; i < borders.length; i++) {
            if (i == otherIndex1 || i == otherIndex2)
                continue;
            if (borders[i].height == borderSize)
                continue;
            if ((borders[i].y >= y) != greater)
                continue;
            var line;
            line = new Phaser.Line(borders[i].x, borders[i].y, borders[i].x, borders[i].y + borders[i].height);
            var p = Phaser.Line.intersects(segment, line, true);
            console.log(line);
            if (p != null) {
                if (getDist(new Phaser.Point(startX, y), p) < dist) {
                    ans = p;
                    dist = getDist(new Phaser.Point(startX, y), p);
                    index = i;
                }
            }
        }
        return index;
    },

    getBorderForVerticalSegment: function(startY, endY, x, greater, otherIndex1, otherIndex2) {
        var segment = new Phaser.Line(x, startY, x, endY);
        var ans = -1, dist = 2000000, index = -1;
        for (i = 0; i < borders.length; i++) {
            if (i == otherIndex1 || i == otherIndex2)
                continue;
            if (borders[i].width == borderSize)
                continue;
            if ((borders[i].x >= x) != greater)
                continue;
            var line;
            line = new Phaser.Line(borders[i].x, borders[i].y, borders[i].x + borders[i].width, borders[i].y);
            var p = Phaser.Line.intersects(segment, line, true);
            if (p != null) {
                if (getDist(new Phaser.Point(x, startY), p) < dist) {
                    ans = p;
                    dist = getDist(new Phaser.Point(x, startY), p);
                    index = i;
                }
            }
        }
        return index;
    },

    getBorderIndex: function(point, otherIndex) {
        for (i = 0; i < borders.length; i++) {
            if (i == otherIndex)
                continue;
            if (borders[i].width == borderSize) { //vertical
                if (point.x == borders[i].x && point.y >= borders[i].y && point.y <= borders[i].y + borders[i].height)
                    return i;
            } else {
                if (point.y == borders[i].y && point.x >= borders[i].x && point.x <= borders[i].x + borders[i].width)
                    return i;
            }
        }
        return -1;
    },

    update: function() {
        if (lifeCount == 0)
            return;
        dudeCenter.body.x = dude.body.x + dudeWidth / 2.0;
        dudeCenter.body.y = dude.body.y + dudeHeight / 2.0;
        dude.body.velocity.x = 0;
        dude.body.velocity.y = 0;
        isDead = false;
        game.physics.arcade.collide(dudeCenterGroup, borderGroup, this.dudeAtTheWall, null, this);
        game.physics.arcade.overlap(trailGroup, invaderGroup, this.collision, null, this);
        game.physics.arcade.overlap(dudeCenterGroup, trailGroup, this.trailIntersect, null, this);
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
        var point = this.getNearestPointOnBorder(dudeCenter, true);
        if (Phaser.Math.fuzzyLessThan(getDist(new Phaser.Point(dudeCenter.body.x, dudeCenter.body.y), point), 2, 2) || 
            dudeCenter.body.x == borderSize || dudeCenter.body.x == game.world.width - borderSize - 1 || 
                dudeCenter.body.y == borderSize || dudeCenter.body.y == game.world.height - borderSize - 1) {
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
        var toAdd = 0;
        for (i = 0; i < borders.length; i++) {
            if (borders[i].width == trailSize || i == 2 || i == 3) { //vertical border
                if (point.y >= borders[i].body.y && point.y <= borders[i].body.y + borders[i].height) {
                    if (Math.abs(point.x - borders[i].body.x) < bestDist) {
                        bestDist = Math.abs(point.x - borders[i].body.x);
                        x = borders[i].body.x;
                        y = point.y;
                    }
                }
            } else { //horizontal border
                if (point.x >= borders[i].body.x && point.x <= borders[i].body.x + borders[i].width) {
                    if (Math.abs(point.y - borders[i].body.y) < bestDist) {
                        bestDist = Math.abs(point.y - borders[i].body.y);
                        x = point.x;
                        y = borders[i].body.y;
                    }
                }
            }
        }
        ans = new Phaser.Point(x, y);
        return ans;
    },

    fillArea: function(node, trailPoints, borderPoints) {

      console.log("in fillArea, node is (", + node.x + "," + node.y + ")\n");

      if (node.y > this.world.height || node.y < 0 || node.x > this.world.width || node.x < 0)
        return;

      if (foundInvader === 1){
        console.log("found invader\n");
        return;
      }
      console.log("in fillArea, after foundInvader check\n");
      // check if node is part of trail
      if (this.pointBelongsTo(trailGroup, node) === true){   
        console.log("node (" + node.x +"," + node.y + ") is trail\n");
        return;
      }
      console.log("in fillArea, after trail\n");

      // OVERLAP JOBIA
      
      // check if node is part of border
      if (this.pointBelongsTo(borderGroup, node) === true){
        console.log("node (" + node.x +"," + node.y + ") is border\n");
        return;
      }
      console.log("in fillArea, after border check\n");
      //check if node is invader
      if (this.pointBelongsTo(invaderGroup, node) === true) {
        console.log("found invader on (" + node.x +"," + node.y + ")\n");
        foundInvader = 1;
        return;
      }

      borders.push(borderGroup.create(node.x, node.y, "border"));

      console.log("in fillArea, after invader check\n");
      this.fillArea(new Phaser.Point(node.x, node.y+1))
      this.fillArea(new Phaser.Point(node.x+1, node.y));
      this.fillArea(new Phaser.Point(node.x-1, node.y));       ; 
      this.fillArea(new Phaser.Point(node.x+1, node.y-1)); 
    
    },

    pointBelongsTo: function(group, node) {

        console.log("in pointBelongsTo\n");
       for (i = 0; i < group.children.length; i++) {
         if (group.children[i].world.equals(node) === true)
         {
           console.log("in pointBelongsTo, TRUE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
           return true;
         }
        }
        
        console.log("in pointBelongsTo, false\n");
        return false;
    }
};

function getArea(points) {
    var doubleArea = 0;
    for (i = 0; i < points.length; i++) {
        doubleArea += points[i].x * points[(i + 1) % points.length].y - points[i].y * points[(i + 1) % points.length].x;
    }
    return Math.abs(doubleArea) * 0.5;
}

function getDist(first, second) {
    return Math.sqrt((first.x - second.x) * (first.x - second.x) + 
        (first.y - second.y) * (first.y - second.y));
}


