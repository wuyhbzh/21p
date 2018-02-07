// cc.Class 生命周期 http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html?h=%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F
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
