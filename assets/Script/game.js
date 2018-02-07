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
        this.mNumPlayerBet= 0;
        this.mNumPlayerChip = 1000;
        this.mArrBottomBtns = ["BtnChip_5", "BtnChip_10", "BtnChip_25", "BtnChip_100"];
        this.mArrBottomBtnPoints = [];
        this.mHandGameState = "bet",
        this.mHandGameStates = {
            "bet": "bet",
            "deal": "deal",
            "end": "end",
        }

        
        this.root = this.node.getChildByName("root");
        this.LabChip.string = this.mNumPlayerChip;

        this.mBottomOffY = 200;
        for (var i in this.mArrBottomBtns) {
            var btn = this.root.getChildByName(this.mArrBottomBtns[i]);
            this.mArrBottomBtnPoints.push(btn.position)
            btn.y -= this.mBottomOffY;
        }
        this.mArrBottomBtns = [];
    },

    start() {
        cc.log('game start')
        
        
    },

    changeChip(num) {
        this.mNumPlayerBet += num;
        this.mNumPlayerChip -= num;
        this.LabBet.string = this.mNumPlayerBet;
        this.LabChip.string = this.mNumPlayerChip;

        if (5 == num)
            this.showBottomBtns(["BtnChip_5", "BtnChip_10", "BtnChip_25", "BtnChip_100"]);
        
        if (100 == num)
            this.showBottomBtns(["BtnChip_5", "BtnChip_100", "BtnChip_500", "BtnChip_1000"]);

    },

    showBottomBtns(pArrShowBottomBtns) {
        var moveTime = 0.5, offx = 0, offy = this.mBottomOffY;
        var delayTime = 0;

        var moveAction = function(node, time, offx,  offy) {
            var moveBy = cc.moveBy(time, cc.p(offx, offy));
            node.runAction(moveBy);
        }

        var doAction = function (nodesName, time, offx, offy) {
            for (var i in nodesName) {
                var btn = this.root.getChildByName(nodesName[i]);
                // 向上移动的时候， 初始移动位置
                if (btn && offy > 0) {
                    btn.position = this.mArrBottomBtnPoints[i];
                    btn.y -= offy
                }
                if (btn) moveAction(btn, time, offx, offy);
            }
        }.bind(this);
        
        if (this.mArrBottomBtns.length > 0) {
            doAction(this.mArrBottomBtns, moveTime, offx, -offy);
            delayTime = moveTime;
        }

        this.mArrBottomBtns = pArrShowBottomBtns;
        
        var delayCallBack = function() {
            doAction(this.mArrBottomBtns, moveTime, offx, offy);
        }
        this.scheduleOnce(delayCallBack, delayTime);
        
    },

    showDealBtn(pIsShow) {
        // var moveBy = cc.moveBy(0.5, cc.p(100, 0));
        // var moveBy1 = cc.moveBy(0.5, cc.p(-100,0));
        // var callback = cc.callFunc(function () { 
        //     this.BtnDeal.enabled = true;
        //     this.BtnDeal.node.active = true;
        // }.bind(this))
        // var callback1 = cc.callFunc(function () { 
        //     if (pIsShow){
        //         this.BtnDeal.enabled = false; // 隐藏单个组件
        //         this.BtnDeal.node.active = false; // 整个 node 的所有组件一起禁用 
        //     }
        //  }.bind(this))
        // this.BtnDeal.enabled = true;
        // this.BtnDeal.node.active = true;
        // var seq = cc.sequence(callback, moveBy, moveBy1, callback1);
        // this.BtnDeal.node.runAction(seq);
    },

    onBtnBack(event) {
        cc.director.loadScene('main')
    },

    onBtnChip(eventTouch, eventData) {
        var bet = parseInt(eventData);
        this.changeChip(bet);
        this.showDealBtn(bet == 5);
    },

    onCardBtn(eventTouch, eventData) {

    },

    update(dt) {
        this.time+=dt;
    },
});
