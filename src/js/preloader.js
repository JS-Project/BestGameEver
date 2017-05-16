var Spliter = {};

Spliter.Preloader.prototype = {

    preload: function() {
    	this.done = false;
    },

    create: function() {

    },

    update: function() {
        this.done = true;
        this.state.start('Menu');
    }

};