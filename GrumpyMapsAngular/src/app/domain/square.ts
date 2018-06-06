import {Player} from './player';

export class Square {
    id:number;
    squareScale:string;
    squareSize:number;
    players:Player[] = new Array();

    constructor(id:number, squareSize:number, squareScale:string) {
        this.id = id;
        this.squareScale = squareScale;
        this.squareSize = squareSize;
    }

    addPhysical(object:Player){
        this.players.push(object);
    }

}
