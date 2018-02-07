function moveOff(node, time, offx, offy) {
    var moveBy = cc.moveBy(time, cc.p(offx, offy));
    node.runAction(moveBy);
}

module.exports = {
    moveOff: moveOff
};
