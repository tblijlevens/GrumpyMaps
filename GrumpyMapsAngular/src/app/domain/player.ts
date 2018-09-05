import {Square} from './square';
import * as $ from 'jquery';

export class Player{

    id:number;
    playerSquareId:number
    name:string;
    playerIcon:File;
    playerIconUrl:string;
    type:string;
    color:string;
    activeColor:string;
    mapHeightWidth:number
    isSelected:boolean;
    mapSquareId:number;
    realSquareId:number;
    squareMapCoordinate:string;
    mapId:number;

// character stats:
    initiative:number;
    actionPoints:number;
    movementAmount:number;
    pointsPerYard:number;
    movementLeft:number;
    attacksPerRound:number;
    pointsPerAttack:number;
    attacksLeft:number
    spellsPerRound:number;
    pointsPerSpell:number;
    spellsLeft:number

    lowLightVisionRadius:number;
    hidden:boolean=false;
    zones:any[] = new Array();
    stasis:any[] = new Array();

    actions:any[] = new Array();

    constructor(id, playerSquareId, name, actionPoints, movementAmount, initiative, attacksPerRound, spellsPerRound, type, color, mapSquareId, mapHeightWidth, squareMapCoordinate, playerIcon, mapId){
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.movementAmount = movementAmount;
        this.movementLeft = movementAmount;
        this.initiative = initiative;
        this.isSelected = false;
        this.attacksPerRound = attacksPerRound;
        this.attacksLeft = attacksPerRound;
        this.spellsPerRound = spellsPerRound;
        this.spellsLeft = spellsPerRound;
        this.type = type;
        this.color = color;
        this.mapSquareId = mapSquareId;
        this.mapHeightWidth = mapHeightWidth;
        this.playerSquareId = playerSquareId;
        this.squareMapCoordinate = squareMapCoordinate;
        this.playerIcon = playerIcon;
        this.mapId = mapId;
        this.setActionPointCosts();
        this.setActiveColor();
    }
    setActionPointCosts(){
        this.pointsPerYard = +(this.actionPoints/this.movementAmount);
        this.pointsPerAttack = +(this.actionPoints/this.attacksPerRound);
        this.pointsPerSpell = +(this.actionPoints/this.spellsPerRound);

    }
    getName(){
        return this.name;
    }
    setMapSquareId(activeSquare){
        this.mapSquareId = activeSquare;
    }

    attack(){
        this.actionPoints -= this.pointsPerAttack;
        this.attacksLeft -= 1;
        this.updateMovement();
        this.updateSpells();
    }
    cast(){
        this.actionPoints -= this.pointsPerSpell;
        this.spellsLeft -= 1;
        this.updateAttacks();
        this.updateMovement();
    }
    movePlayer(yardsMoved:number){
        this.actionPoints -= (yardsMoved*this.pointsPerYard);
        this.movementLeft -= yardsMoved;

        this.updateAttacks();
        this.updateSpells();
    }

    updateAttacks(){
        this.attacksLeft = Math.floor((this.actionPoints/this.pointsPerAttack));
    }
    updateSpells(){
        this.spellsLeft = Math.floor((this.actionPoints/this.pointsPerSpell));
    }
    updateMovement(){
        this.movementLeft = +(this.actionPoints/this.pointsPerYard).toFixed(1);
    }

    attackCutOff(cutOffNumber:number){
        this.attacksLeft -= 1;
        this.actionPoints -= this.pointsPerAttack;
        this.updateSpells();

        if (this.actions.length == 0){ //this is the first action of the round
            this.movementLeft = this.movementAmount*cutOffNumber;
        }
        if (this.actions[0] == "halfRoundAction" || this.actions[0] == "move"){ // this is not the first action and first action was not a (halfRound)attack
            this.movementLeft = 0;
        }

        this.actions.push("attack");

    }
    castCutOff(cutOffNumber:number){
        this.spellsLeft -= 1;
        this.actionPoints -= this.pointsPerSpell;
        this.updateAttacks();

        if (this.actions.length == 0){ //this is the first action of the round
            this.movementLeft = this.movementAmount*cutOffNumber;
        }
        if (this.actions[0] == "halfRoundAction" || this.actions[0] == "move"){ // this is not the first action and first action was not a (halfRound)attack
            this.movementLeft = 0;
        }
        this.actions.push("attack");

    }
    movePlayerCutOff(yardsMoved:number, cutOffNumber:number){
        this.movementLeft -= yardsMoved;

        if (this.movementLeft < (this.movementAmount*cutOffNumber) || this.actions[0] == "attack" || this.actions[0] == "halfRoundAction"){ //moveleft is below half or first action was a (halfRound)attack or halfRoundAction
            this.attacksLeft = 0;
            this.spellsLeft = 0;
        }
        this.actions.push("move");
    }

    useFullRound(){
        this.actionPoints=0;
        this.movementLeft = 0;
        this.attacksLeft = 0;
        this.spellsLeft = 0;
    }

    halfRoundAction(cutOffNumber:number){
        if (this.actions.length == 0){ //this is the first action of the round
            this.movementLeft = this.movementAmount*cutOffNumber;
        }
        if (this.actions[0] == "halfRoundAction" || this.actions[0] == "move" || this.actions[0] == "attack"){ // this is the second action
            this.actionPoints=0;
            this.movementLeft = 0;
            this.attacksLeft = 0;
            this.spellsLeft = 0;
        }
        this.actions.push("halfRoundAction");
    }
    halfRoundAttack(cutOffNumber:number){
        if (this.actions.length == 0){ //this is the first action of the round
            this.movementLeft = this.movementAmount*cutOffNumber;
            this.attacksLeft = 0;
            this.spellsLeft = 0;
        }
        if (this.actions[0] == "halfRoundAction" || this.actions[0] == "move"){ // this is the second action (first action can not be an attack)
            this.actionPoints=0;
            this.movementLeft = 0;
            this.attacksLeft = 0;
            this.spellsLeft = 0;
        }
        this.actions.push("attack");
    }

    resetAllStats(){
        this.actionPoints=100;
        this.movementLeft = this.movementAmount;
        this.attacksLeft = this.attacksPerRound;
        this.spellsLeft = this.spellsPerRound;
        this.actions = new Array();
    }
    reduceDurations(){
        // ZONES
        var toRemove:any[] = new Array();
        for (var i = 0 ; i < this.zones.length ; i++){
            if (this.zones[i].duration>0){
                this.zones[i].duration--; // reduce duration
            }
            if (this.zones[i].duration==0){ //add zone to remove if duration is 0
                toRemove.push(this.zones[i]);
            }
        }
        for (var i = 0 ; i < toRemove.length ; i++){ // remove all selected zones
            this.removeZone(toRemove[i]);
        }

        // STASIS
        toRemove = new Array();
        for (var i = 0 ; i < this.stasis.length ; i++){
            if (this.stasis[i].duration>0){
                this.stasis[i].duration--; // reduce duration
            }
            if (this.stasis[i].duration==0){
                toRemove.push(this.stasis[i]);
            }
        }

        for (var i = 0 ; i < toRemove.length ; i++){ // remove all selected stasis
            this.removeStasis(toRemove[i]);
        }
    }

    removeZone(zone){
        var index = this.zones.indexOf(zone);
        this.zones.splice(index, 1);
    }
    removeStasis(stasis){
        var index = this.stasis.indexOf(stasis);
        this.stasis.splice(index, 1);
    }
    setActiveColor(){
        if (this.isSelected){
            $("#playerMap"+this.id).css({"box-shadow": "0px 0px 5px 3px " + this.color, "border-radius":"5px"});
            $("#playerDetail"+this.id).css({"box-shadow": "0px 0px 3px 3px " + this.color, "border-radius":"5px"});
            $("#playerDot"+this.id).css({"box-shadow": "0px 0px 5px 3px " + this.color, "border":"none"});
        }
        else
        {
            $("#playerMap"+this.id).css({"box-shadow": "none"});
            $("#playerDetail"+this.id).css({"box-shadow": "none"});
            $("#playerDot"+this.id).css({"box-shadow": "none", "border":"solid 1px black"});
        }
    }

}
