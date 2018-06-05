import {Square} from './square';

export class DnDMap {
    id:number
    heightWidth:number = 0;
    squares:Square[]= new Array();

    constructor(heightWidth:number, amountSquares:number, squareScale:string) {
      this.heightWidth = heightWidth;
      for (var i = 0 ; i<amountSquares ; i++){
          this.squares.push(new Square(i, squareScale));
      }
    }

    getSquares(){
        return this.squares;
    }
}
