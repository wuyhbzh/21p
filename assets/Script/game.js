cc.Class({
    extends: cc.Component,

    properties: {
        time: 0.0,
        LabBet: {
            default: null,
            type: cc.Label
        },
        LabChip: {
            default: null,
            type: cc.Label
        }
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

    onBtnBack(event) {
        cc.director.loadScene('main')
    },

    onBtnChip(eventTouch, eventData) {
        var bet = parseInt(eventData);
        this.changeChip(bet);
    },

    update(dt) {
        this.time+=dt;
    },
});
