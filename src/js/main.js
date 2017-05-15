var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

// Add States
game.state.add('Preloader', Spliter.Preloader);
game.state.add('Menu',      Spliter.Menu);
game.state.add('Game',      Spliter.Game);

// Run first state
game.state.start('Preloader');