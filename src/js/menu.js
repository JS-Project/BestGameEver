menu = function(game) {
    this.touchToStart;
};

menu.prototype = {

    create: function() {

        touchToStart = this.add.text(this.world.centerX-155, this.world.centerY+180, 'Press any key to start', { fill: '#ffffff' });

        this.game.input.keyboard.onDownCallback = function() {
            this.game.state.start('Lvl1');
            
            var keyboard = this.game.input.keyboard;
            keyboard.onDownCallback = keyboard.onUpCallback = keyboard.onPressCallback = null;
        };
    }
};