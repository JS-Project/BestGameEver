preloader = function () {

};

preloader.prototype = {

    preload: function() {
    	this.done = false;
    },

    create: function() {

    },

    update: function() {
        this.done = true;
        this.game.state.start('Menu');
    }

};