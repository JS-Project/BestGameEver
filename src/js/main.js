var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('Preloader', preloader);
game.state.add('Menu', menu);
game.state.add('Lvl2', lvl2);
game.state.start('Preloader');

game.assets = {
 borderSize:          2.0,
 trailSize:           2.0,

 dudeHeight:          24.0,
 dudeWidth:           16.0,
 
 dudeSpriteHeight:    48.0,
 dudeSpriteWidth:     32.0,
 
 lifeCount: 		  3,
 textStyle:           {font: "15pt Arial", fill: '#ffffff'},
 heartSize:           16

}
