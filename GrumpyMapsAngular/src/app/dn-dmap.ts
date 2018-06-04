import {Square} from './square';

export class DnDMap {
    id:number
    mapHeight:number = 0;
    mapWidth:number = 0;
    squares:Square[]= new Array();

    constructor(mapHeight: number, mapWidth:number, amountSquares:number, squareScale:string) {
      this.mapHeight = mapHeight;
      this.mapWidth = mapWidth;
      for (var i = 0 ; i<amountSquares ; i++){
          this.squares.push(new Square(i, squareScale));
      }
    }

    getSquares(){
        return this.squares;
    }
}
