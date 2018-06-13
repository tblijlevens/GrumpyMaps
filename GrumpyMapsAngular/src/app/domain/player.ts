import {Physical} from './physical';

export class Player implements Physical{

    id:number;
    playerSquareId:number
    name:string;
    actionPoints:number;
    movementAmount:number;
    attacksPerRound:number;
    spellsPerRound:number;
    type:string;
    color:string;
    squareId:number;
    mapHeightWidth:number
    isSelected:boolean;

    constructor(id, playerSquareId, name, actionPoints, movementAmount, attacksPerRound, spellsPerRound, type, color, squareId, mapHeightWidth){
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.movementAmount = movementAmount;
        this.isSelected = false;
        this.attacksPerRound = attacksPerRound;
        this.spellsPerRound = spellsPerRound;
        this.type = type;
        this.color = color;
        this.squareId = squareId;
        this.mapHeightWidth = mapHeightWidth;
        this.playerSquareId = playerSquareId;
    }
    getName(){
        return this.name;
    }
    setSquareId(activeSquare){
        this.squareId = activeSquare;
    }

    getMoveRange(){
        var moveRange = new Array();
        for (var i = -this.movementAmount ; i <= this.movementAmount ; i++){
            var availableSquare = this.squareId + (i*this.mapHeightWidth);

            if(i<=0){
                for (var j=-i-this.movementAmount ; j<= i+this.movementAmount ; j++){
                    moveRange.push(availableSquare+j);
                }
            }
            if(i>0){
                for (var j=i-this.movementAmount ; j<= this.movementAmount-i ; j++){
                    moveRange.push(availableSquare+j);
                }
            }
        }
        return moveRange;
    }

}
