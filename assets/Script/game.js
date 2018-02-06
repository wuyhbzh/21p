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
            this.BtnDeal.enabled = true;
            this.BtnDeal.node.active = true;
        }.bind(this))
        var callback1 = cc.callFunc(function () { 
            if (pIsShow){
                this.BtnDeal.enabled = false; // 隐藏单个组件
                this.BtnDeal.node.active = false; // 整个 node 的所有组件一起禁用 
            }
         }.bind(this))
        this.BtnDeal.enabled = true;
        this.BtnDeal.node.active = true;
        var seq = cc.sequence(callback, moveBy, moveBy1, callback1);
        this.BtnDeal.node.runAction(seq);
    },

    onBtnBack(event) {
        cc.director.loadScene('main')
    },

    onBtnChip(eventTouch, eventData) {
        var bet = parseInt(eventData);
        this.changeChip(bet);
        this.showDealBtn(bet == 5);
    },

    update(dt) {
        this.time+=dt;
    },
});
