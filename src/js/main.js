var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('Preloader', preloader);
game.state.add('Menu', menu);
game.state.add('Lvl2', lvl2);
game.state.start('Preloader');
