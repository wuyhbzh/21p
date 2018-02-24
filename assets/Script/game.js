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
        BtnStart: {
            default: null,
            type: cc.Button
        },
    },

    onLoad() {
        cc.log('game onLoad')
        this.mPileCard = { data: [] };
        this.mHandCard = { nodes: {}, data: [], point: 0 };    // nodes:牌节点  data:牌数据  point:拍型点
        this.mBankerCard = { nodes: {}, data: [], point: 0 };

        this.mArrCardBtn = ["Btn2Card", "Btn2Score", "BtnCardGet", "BtnCardStop"];  // 分牌 双倍 拿牌 停牌 按钮
        this.mArrBetBtn_1 = ["BtnChip_5", "BtnChip_10", "BtnChip_25", "BtnChip_100"];   // 下注按钮
        this.mArrBetBtn_2 = ["BtnChip_10", "BtnChip_25", "BtnChip_500", "BtnChip_1000"];    // 下注按钮
        this.mArrBottomBtns = this.mArrBetBtn_1;   // 底部展示出来的按钮
        this.mArrBottomBtnPoints = [];  // 底部按钮的位置
        this.mHandGameState = "bet",    // 当前游戏状态
        this.mHandGameStates = {        // 游戏的所有状态
            "start": "start",
            "end": "end",
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
        this.gameStart();
        this.mHandGameState = this.mHandGameStates.bet;
        cc.log('this.mHandGameState', this.mHandGameState);
    },

    update(dt) {
        this.time += dt;
    },
    
    // 逻辑 //
    gameStart() {
        cc.log('gameStart') 
        this.mNumPlayerBet = 0;  // 玩家下注数量
        this.mNumPlayerChip = 1000; // 玩家手上筹码数量

        this.mPileCard = { data: [] };
        this.mHandCard = { nodes: {}, data: [], point: 0 };    // nodes:牌节点  data:牌数据  point:拍型点
        this.mBankerCard = { nodes: {}, data: [], point: 0 };
        
        // 洗牌
        this.mHandGameState = this.mHandGameStates.start;
        cc.log('this.mHandGameState', this.mHandGameState);
        
        this.mPileCard.data = [];
        for(var i = 0; i < 52; i++) {
            var type = Math.floor(i / 13) + 1;
            var value = i % 13 + 1;
            var cardValue = type * 100 + value;
            this.mPileCard.data.push(cardValue);
        }
        this.mPileCard.data = this.shuffleCard(this.mPileCard.data);
        this.updateBottomBtnsShow(this.mArrBetBtn_1);
    },

    gameEnd() {
        this.mHandGameState = this.mHandGameStates.end;
        cc.log('this.mHandGameState', this.mHandGameState);
        this.updateBottomBtnsShow([])

        for (var i in this.mHandCard.nodes) {
            this.mHandCard.nodes[i].removeFromParent();
        }

        for (var i in this.mBankerCard.nodes) {
            this.mBankerCard.nodes[i].removeFromParent();
        }
    },

    shuffleCard (cards) {
        for (var i = 0; i < cards.length; i++) {
            var randIndex = i + Math.floor(Math.random() * (cards.length - i));
            var temp = cards[i];
            cards[i] = cards[randIndex];
            cards[randIndex] = temp;
        }
        return cards;
    },

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
        if(this.mHandGameState == this.mHandGameStates.bet) {
            gg.api.moveOff(this.BtnDeal.node, 0.5, -150, 0);

        } else if (this.mHandGameState == this.mHandGameStates.deal) {
            gg.api.moveOff(this.BtnDeal.node, 0.5, 150, 0);

        } else if (this.mHandGameState == this.mHandGameStates.end) {
            gg.api.moveOff(this.BtnStart.node, 0.5, -150, 0);
            
        } else if (this.mHandGameState == this.mHandGameStates.start) {
            gg.api.moveOff(this.BtnStart.node, 0.5, 150, 0);
            
        }
    },

    updateCardShow() {
        var x = -100, y = -100;
        for (var i in this.mHandCard.data) {
            var cardValue = this.mHandCard.data[i];
            var newcard = cc.instantiate(this.PreCard);
            if (this.mHandCard.nodes[i]){
                this.mHandCard.nodes[i].removeFromParent();
            }
            newcard.getComponent('preCard').showCard(cardValue);
            x += 50;
            newcard.x += x;
            newcard.y = y;
            this.mHandCard.nodes[i] = newcard;
            this.root.addChild(newcard);
        }

        x = -100, y = 300;
        for (var i in this.mBankerCard.data) {
            var cardValue = this.mBankerCard.data[i];
            var newcard = cc.instantiate(this.PreCard);
            if (this.mBankerCard.nodes[i]) {
                this.mBankerCard.nodes[i].removeFromParent();
            }
            newcard.getComponent('preCard').showCard(cardValue);
            x += 50;
            newcard.x += x;
            newcard.y = y;
            this.mBankerCard.nodes[i] = newcard;
            this.root.addChild(newcard);
        }

    },

    onBtnBack(event) {
        cc.director.loadScene('main')
    },

    onBtnChip(eventTouch, eventData) {
        var bet = parseInt(eventData);
        if (this.mNumPlayerBet == 0) this.updateDealBtnShow();
        this.changeChip(bet);
    },

    onBtnDeal(eventTouch, eventData) {
        this.mHandGameState = this.mHandGameStates.deal;
        cc.log('this.mHandGameState', this.mHandGameState);
        this.updateDealBtnShow();
        this.updateBottomBtnsShow(this.mArrCardBtn);

        this.mHandCard.data.push(this.mPileCard.data.pop());
        this.mHandCard.data.push(this.mPileCard.data.pop());
        this.mBankerCard.data.push(this.mPileCard.data.pop());
        this.mBankerCard.data.push(this.mPileCard.data.pop());
        this.updateCardShow();
    },

    onBtnStart(eventTouch, eventData) {
        this.gameStart();
        this.updateDealBtnShow();
        this.mHandGameState = this.mHandGameStates.bet;
        cc.log('this.mHandGameState', this.mHandGameState);
    },

    onBtnCard(eventTouch, eventData) {
        if ("BtnCardGet" == eventData) {
            this.mHandCard.data.push(this.mPileCard.data.pop());
            this.updateCardShow();
        }

        if ("Btn2Card" == eventData) { }

        if ("Btn2Score" == eventData) { }

        if ("BtnCardStop" == eventData) { 
            this.gameEnd();
            this.updateDealBtnShow();
        }
    },

});
