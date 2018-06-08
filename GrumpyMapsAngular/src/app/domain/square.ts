import {Player} from './player';

export class Square {
    mapSquareId:number;
    squareScale:string;
    squareSize:number;
    obstructed:boolean = false;
    players:Player[] = new Array();

    constructor(mapSquareId:number, squareSize:number, squareScale:string) {
        this.mapSquareId = mapSquareId;
        this.squareScale = squareScale;
        this.squareSize = squareSize;
    }

    addPhysical(object:Player){
        this.players.push(object);
    }

}
