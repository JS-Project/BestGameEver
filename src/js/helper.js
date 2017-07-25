var Helper = function Helper()
{
  this.load = function(cursors)
  {
  	  game.load.spritesheet('dude', game.assets.dudeImage, game.assets.dudeSpriteWidth, game.assets.dudeSpriteHeight);
      game.load.image('invader1', game.assets.invader1Image);
      game.load.image('invader2', game.assets.invader2Image);
      game.load.image('border', game.assets.borderImage);
      game.load.image('trail', game.assets.trailImage);
      game.load.image('heart', game.assets.heartImage);
      var cursors = game.input.keyboard.createCursorKeys();

      return cursors;
  },

  this.getNearestPointOnBorder = function(point, borders)
  {
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

