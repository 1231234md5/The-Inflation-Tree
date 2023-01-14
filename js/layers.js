//ExpantaNum.prototype.log=ExpantaNum.prototype.logBase
upgEff=(e,t)=>layers[e].upgrades[t].effect()
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),incrementy:EN(0)
    }},
    color: "#4BDC13",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: .04, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = player.points.root(5).mul(softcap(player.p.points,EN(1e4),0.3).root(4.8)).add(1).pow(3).sub(1).div(3).add(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return softcap(new ExpantaNum(1).add(player.points.add(10).slog(10).sub(1.25).max(0)).pow(2).sub(1).div(1.5).add(1),EN(1.75),.25)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},tabFormat:['main-display',
'prestige-button','resource-display',['display-text',()=>`Your points and prestige points multiply prestige point gain by ${format(layers.p.gainMult())}`
+` and raise prestige point gain by ${format(layers.p.gainExp())} (cap at 1.75, ^0.25).<br>the boosts above boost point gain by ${format(layers.p.gainMult().pow(layers.p.gainExp()).pow(.3))}.`]
,'upgrades'],upgrades:{
11:{title:"boost boosts point",description:"boost point gain based on boosts above",cost:EN(3600),
effect:()=>layers.p.gainMult().pow(layers.p.gainExp()).pow(.3).add(10).logBase(10).root(5),
effectDisplay:()=>'^'+format(upgEff('p',11))}
,12:{
title:"Ordinal Markup-ify",description:"there is exponentially rising incrementy and gain (^0.625 the prestige points you gain on reset+a flat 1e12/s) prestige points each second",cost:EN('e13.3333333333333333333333'),
effectDisplay:()=>format(player.p.incrementy)+' incrementy',onPurchase:()=>player.p.incrementy=EN(1)
},13:{
title:"not useless",description:"incrementy boost itself.",cost:EN(1e280),currencyInternalName:"incrementy",
currencyLayer:"p",currencyDisplayName:'incrementy',effect:()=>EN.pow(10,player.p.incrementy.add(10).slog(10).pow(300).div(1e84).max(10).logBase(10).pow(1.5)).mul(player.p.incrementy.logBase(10).pow(75).mul(player.p.incrementy.root(5000).div(1e260).max(1))),
effectDisplay:()=>'x'+format(upgEff('p',13))
}
},update(){if(hasUpgrade('p',12))player.p.points=player.p.points.add(getResetGain('p').pow(.625).add(5e10));
player.p.incrementy=player.p.incrementy.mul(2).mul(hasUpgrade('p',13)?upgEff('p',13):1)},
})
