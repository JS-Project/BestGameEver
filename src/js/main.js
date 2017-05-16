var game = new Phaser.Game(800, 600, Phaser.AUTO, '');


game.state.add('Preloader', preloader);
game.state.add('Menu',      menu);
game.state.add('Lvl1',      lvl1);
game.state.start('Preloader');