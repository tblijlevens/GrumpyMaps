import {Physical} from './physical';

export class Player implements Physical{

    id:number;
    name:string;
    actionPoints:number;
    movementAmount:number;
    attacksPerRound:number;
    spellsPerRound:number;
    type:string;
    color:string;
    squareId:number;
    mapHeightWidth:number
    moveRange:number[];

    constructor(id, name, actionPoints, movementAmount, attacksPerRound, spellsPerRound, type, color, squareId, mapHeightWidth){
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.movementAmount = movementAmount;
        this.attacksPerRound = attacksPerRound;
        this.spellsPerRound = spellsPerRound;
        this.type = type;
        this.color = color;
        this.squareId = squareId;
        this.mapHeightWidth = mapHeightWidth;
        this.setMoveRange();
    }
    getName(){
        return this.name;
    }
    setSquareId(activeSquare){
        this.squareId = activeSquare;
        this.setMoveRange();
    }

    setMoveRange(){
        this.moveRange = new Array();
        for (var i = -this.movementAmount ; i <= this.movementAmount ; i++){
            var availableSquare = this.squareId + (i*this.mapHeightWidth);
            this.moveRange.push(availableSquare);

            if(i<=0){
                for (var j=1 ; j<= i+this.movementAmount ; j++){
                    this.moveRange.push(availableSquare-j);
                    this.moveRange.push(availableSquare+j);
                }
            }
            if(i>0){
                for (var j=1 ; j> i-this.movementAmount ; j--){
                    this.moveRange.push(availableSquare-(i-this.movementAmount));
                    this.moveRange.push(availableSquare+(i-this.movementAmount));
                }
            }
        }
        console.log(this.moveRange);
    }

}
