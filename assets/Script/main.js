cc.Class({
    extends: cc.Component,

    properties: {
        time: 0.0,
    },

    onLoad () {
        cc.log('main onLoad')
    },

    start () {
        cc.log('main start')
    },

    onBtnStart () {
        cc.director.loadScene('game')        
    },

    update (dt) {
    },
});
