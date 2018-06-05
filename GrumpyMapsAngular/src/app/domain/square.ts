import {Physical} from './physical';

export class Square {
    id:number;
    scale:number;
    squareScale:string;
    squareSize:number;
    physicals:Physical[];

    constructor(id:number, squareSize:number, squareScale:string) {
        this.id = id;
        this.squareScale = squareScale;
        this.squareSize = squareSize;
    }

    

}
