cc.Class({
    extends: cc.Component,

    properties: {
        LabBet: {
            default: null,
            type: cc.Label
        },
        LabChip: {
            default: null,
            type: cc.Label
        },
        BtnDeal: {
            default: null,
            type: cc.Button
        },
    },

    onLoad() {
        cc.log('game onLoad')
        this.playerBet= 0;
        this.playerChip = 1000;
        this.gameState= 1,
        this.gameStates = {
            "bet": 1,
            "deal": 2,
            "end": 3,
        }
    },

    start() {
        cc.log('game start')
        this.LabChip.string = this.playerChip;
    },

    changeChip(num) {
        this.playerBet += num;
        this.playerChip -= num;
        this.LabBet.string = this.playerBet;
        this.LabChip.string = this.playerChip;
    },

    showDealBtn(pIsShow) {
        var moveBy = cc.moveBy(0.5, cc.p(100, 0));
        var moveBy1 = cc.moveBy(0.5, cc.p(-100,0));
        var callback = cc.callFunc(function () { 
            this.BtnDeal.setVisible(true) 
        }.bind(this))
        var callback1 = cc.callFunc(function () { this.BtnDeal.setVisible(false) }.bind(this))
        var seq = cc.sequence(callback, moveBy, moveBy1, callback1);
        this.BtnDeal.node.runAction(seq);
    },

    onBtnBack(event) {
        cc.director.loadScene('main')
    },

    onBtnChip(eventTouch, eventData) {
        var bet = parseInt(eventData);
        this.changeChip(bet);
        this.showDealBtn(true);
    },

    update(dt) {
        this.time+=dt;
    },
});
