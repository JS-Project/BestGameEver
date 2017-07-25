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
var area;
var checkArea;
var foundInvader = 0;
var invanders = [];

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

        checkArea = new Array(game.world.width);

         for (var i = 0; i < game.world.width; i++) {
        	//area[i] = new Array(game.world.height);
        	checkArea[i] = new Array(game.world.height);
        }

        for (var i = 0; i<game.world.width; i++) {
			for (var j = 0; j<game.world.height; j++) {
 				//area[i,j] = 0;
 				checkArea[i,j] = 0;
 			}			              	
        }

        borderGroup = game.add.group();
        borderGroup.enableBody = true;

         // bottom border
        for (var i = 0; i < game.world.width; i++) {
        	for (j = 0; j < borderSize; j++) {
        		borders.push(borderGroup.create(i, game.world.height-j-1, 'border'));
        		checkArea[i, game.world.height-j] = 1;
        	}
        }
		
		// left border
        for (var i = 0; i < borderSize; i++) {
        	for (j = 0; j <= game.world.height-borderSize; j++) {
        		borders.push(borderGroup.create(i, j, 'border'));
        		checkArea[i,j] = 1;
        	}
        }

        // upper border
		for (var i = borderSize; i < game.world.width; i++) {
        	for (j = 0; j < borderSize; j++) {
        		borders.push(borderGroup.create(i, j, 'border'));
        		checkArea[i,j] = 1;
        	}
        }

        // right border

		for (var i = game.world.width-borderSize; i < game.world.width; i++) {
        	for (j = borderSize; j <= game.world.height-borderSize; j++) {
        		borders.push(borderGroup.create(i, j, 'border'));
        		checkArea[i,j] = 1;
        	}
        }

        for (var i = 0; i < borders.length; i++) {
        	borders[i].width = 1;
        	borders[i].height = 1;
			borders[i].body.immovable = true;
		}        

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

        // creating 2D arrays
       // area = new Array(game.world.height);
      //  checkArea = new Array(game.world.height);

        //set init values

       
        //add borders
        // for (var i=0; i <= game.world.height; i++) {
        // 	for (j=0; j <= borderSize; j++) {
        // 		area[i, j] = 1;
        // 		checkArea[i, j] = 1;
	       //  	area[i, game.world.height-j] = 1;
    	   //  	checkArea[i, game.world.height-j] = 1;
        // 	}
        // }

        // for (var i=0; i <= game.world.height; i++) {
        // 	for (j=0; j <= borderSize; j++) {
        // 		checkArea[j, i] = 1;
	       //  	area[game.world.height-j, i] = 1;
    	   //  	checkArea[game.world.height-j, i] = 1;
        // 	}
        // }


        console.log("Height is " + game.world.height + ", width is " + game.world.width + "\n");
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
      
        if (trail.length == 0)
            return;

        var node = new Phaser.Point(Math.round(trail[0].x)-1, Math.round(trail[0].y)+1);

        this.fillArea(node, trail, borders);

        var fillFlag;

        // choose which part to fill
        if (foundInvader === 1) {
        	fillFlag = 0;
		}
		else {
			fillFlag = 2;
		}

        for (var i = 0; i <game.world.height; i++) {
        	for (var j = 0; j < game.world.width; j++) {

        		if (checkArea[i, j] === fillFlag) {
        			newBorder = borderGroup.create(i, j, 'border');
        			newBorder.width = 1;
        			newBorder.height = 1;
        			newBorder.body.immovable = true;
        			borders.push(newBorder);
        			checkArea[i, j] = 1;
        		}
        	}
        }
      
        console.log("finished filling area\n");

		for (var i = 0; i <trail.length; i++) {
			borders.push(borderGroup.create(trail[i].x, trail[i].y), "border");

			trail[i].kill();
		}

        console.log("deleted trail\n");
	},

    update: function() {
        if (lifeCount == 0)
            return;
        dudeCenter.body.x = dude.body.x + dudeWidth / 2.0;
        dudeCenter.body.y = dude.body.y + dudeHeight / 2.0;
        dude.body.velocity.x = 0;
        dude.body.velocity.y = 0;
        isDead = false;

        game.physics.arcade.overlap(dudeCenterGroup, borderGroup, this.dudeAtTheWall, null, this);
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

    	if (checkArea[dudeCenter.body.x, dudeCenter.body.y] == 1) {
    		return;
    	} 	

        var cur = trailGroup.create(dudeCenter.body.x, dudeCenter.body.y, 'trail');
        cur.scale.setTo(trailSize, trailSize);
        trail.push(cur);
    },

    fillArea: function(node, trailPoints, borderPoints) {

      console.log("in fillArea, node is (", + node.x + "," + node.y + ")\n");

      if (node.y > game.world.height || node.y < 0 || node.x > game.world.width || node.x < 0)
        return;

    //  console.log("in fillArea, after foundInvader check\n");
      // check if node is part of trail
      if (this.pointBelongsTo(trailGroup, node) === true){   
     //////   console.log("node (" + node.x +"," + node.y + ") is trail\n");
        return;
      }
      //console.log("in fillArea, after trail\n");

      // OVERLAP JOBIA
      
      // check if node is part of border
      if (checkArea[node.x, node.y] === 2 || checkArea[node.x, node.y] === 1) {
    //    console.log("node (" + node.x +"," + node.y + ") is border\n");
        return;
      }
     // console.log("in fillArea, after border check\n");
      //check if node is invader
      if (this.pointBelongsTo(invaderGroup, node) === true) {
      //  console.log("found invader on (" + node.x +"," + node.y + ")\n");
        foundInvader = 1;
        invaders.push[node];
        return;
      }

      //borders.push(borderGroup.create(node.x, node.y, "border"));

      checkArea[node.x, node.y] = 2;
     // console.log("in fillArea, after invader check\n");
      this.fillArea(new Phaser.Point(node.x, node.y+1))
      this.fillArea(new Phaser.Point(node.x+1, node.y));
      this.fillArea(new Phaser.Point(node.x-1, node.y));       
      this.fillArea(new Phaser.Point(node.x, node.y-1)); 
    
    },

    pointBelongsTo: function(group, node) {

       // console.log("in pointBelongsTo\n");
       for (i = 0; i < group.children.length; i++) {
         if (group.children[i].world.equals(node) === true)
         {
         //  console.log("in pointBelongsTo, TRUE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
           return true;
         }
        }
        
       // console.log("in pointBelongsTo, false\n");
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


