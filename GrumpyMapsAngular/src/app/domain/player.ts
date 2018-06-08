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

    constructor(id, name, actionPoints, movementAmount, attacksPerRound, spellsPerRound, type, color){
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.movementAmount = movementAmount;
        this.attacksPerRound = attacksPerRound;
        this.spellsPerRound = spellsPerRound;
        this.type = type;
        this.color = color;
    }
    getName(){
        return this.name;
    }
}
