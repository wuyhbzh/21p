
cc.Class({
    extends: cc.Component,

    properties: {
        AtlasCard: {
            default: null,
            type: cc.SpriteAtlas
        },
    },

    onLoad () {
        
    },

    start () {

    },

    showCard (num) {
        cc.log('show card');
        var spriteNode = this.node.getComponent('cc.Sprite')
        spriteNode.spriteFrame = this.AtlasCard.getSpriteFrame("card_" + num);
    },
    // update (dt) {},
});
