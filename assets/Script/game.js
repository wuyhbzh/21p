var ccapi = require("ccapi")

cc.Class({
    extends: cc.Component,

    properties: {
        PreCard: {
            default: null,
            type: cc.Prefab
        },
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
        this.mNumPlayerBet= 0;  // 玩家下注数量
        this.mNumPlayerChip = 1000; // 玩家手上筹码数量
        this.mArrCardBtn = ["Btn2Card", "Btn2Score", "BtnCardGet", "BtnCardStop"];  // 分牌 双倍 拿牌 停牌 按钮
        this.mArrBetBtn_1 = ["BtnChip_5", "BtnChip_10", "BtnChip_25", "BtnChip_100"];   // 下注按钮
        this.mArrBetBtn_2 = ["BtnChip_10", "BtnChip_25", "BtnChip_500", "BtnChip_1000"];    // 下注按钮
        this.mArrBottomBtns = this.mArrBetBtn_1;   // 底部展示出来的按钮
        this.mArrBottomBtnPoints = [];  // 底部按钮的位置
        this.mHandGameState = "bet",    // 当前游戏状态
        this.mHandGameStates = {        // 游戏的所有状态
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
        this.updateBottomBtnsShow(this.mArrBetBtn_1);
    },

    update(dt) {
        this.time += dt;
    },

    
    // 逻辑 //

    changeChip(num) {
        this.mNumPlayerBet += num;
        this.mNumPlayerChip -= num;
        this.LabBet.string = this.mNumPlayerBet;
        this.LabChip.string = this.mNumPlayerChip;
    },

    updateBottomBtnsShow(pArrShowBottomBtns) {
        var moveTime = 0.5, offx = 0, offy = this.mBottomOffY;
        var delayTime = 0;

        var doAction = function (nodesName, time, offx, offy) {
            for (var i in nodesName) {
                var btn = this.root.getChildByName(nodesName[i]);
                // 向上移动的时候， 初始移动位置
                if (btn && offy > 0) {
                    btn.position = this.mArrBottomBtnPoints[i];
                    btn.y -= offy
                }
                if (btn) gg.api.moveOff(btn, time, offx, offy);
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

    updateDealBtnShow() {
        var nowIsShow = this.BtnDeal.enabled;

        if(this.mHandGameState == this.mHandGameStates.bet) {
            if (this.mNumPlayerBet > 0 && nowIsShow == false) {
                this.BtnDeal.enabled = true; // 显示单个组件 为true才会执行 moveOff的动作
                this.BtnDeal.node.active = true; // 整个 node 的所有组件一起禁用 
                gg.api.moveOff(this.BtnDeal.node, 0.5, -100, 0);
            } else if (this.mNumPlayerBet <= 0 && nowIsShow) {

            }

        } else if (this.mHandGameState == this.mHandGameStates.deal) {
            gg.api.moveOff(this.BtnDeal.node, 0.5, 100, 0);
            var delayCallBack = function () {
                this.BtnDeal.enabled = false;
                this.BtnDeal.node.active = false;
            }.bind(this)
            this.scheduleOnce(delayCallBack, 0.5);


        }
    },

    addHandCard() {

    },

    onBtnBack(event) {
        cc.director.loadScene('main')
    },

    onBtnChip(eventTouch, eventData) {
        var bet = parseInt(eventData);
        this.changeChip(bet);
        this.updateDealBtnShow();
    },

    onBtnDeal(eventTouch, eventData) {
        this.mHandGameState = this.mHandGameStates.deal;
        this.updateDealBtnShow();
        this.updateBottomBtnsShow(this.mArrCardBtn);
    },

    onBtnCard(eventTouch, eventData) {
        if("getcard" == eventData) {
            var newcard = cc.instantiate(this.PreCard);
            this.root.addChild(newcard);
            newcard.getComponent('preCard').showCard(101);
        }
    },

});
