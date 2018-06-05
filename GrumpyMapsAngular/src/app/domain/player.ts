import {Physical} from './physical';

export class Player implements Physical{

    id:number;
    name:string;
    actionPoints:number;
    movementAmount:number;
    attacksPerRound:number;
    spellsPerRound:number;

    constructor(id, name, actionPoints, movementAmount, attacksPerRound, spellsPerRound){
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.movementAmount = movementAmount;
        this.attacksPerRound = attacksPerRound;
        this.spellsPerRound = spellsPerRound;    
    }
}
