import {Square} from './square';

export class DnDMap {
    id:number
    heightWidth:number;
    numberOfSquares:number;
    squares:Square[]= new Array();

    constructor(id:number, heightWidth:number, squareSize:number) {
      this.id = id;
      this.heightWidth = heightWidth;
      this.createSquares(squareSize);
    }

    getSquares(){
        return this.squares;
    }
    setHeightWidth(heightWidth:number, squareSize:number){
        this.heightWidth = heightWidth;
        this.createSquares(squareSize);
    }
    private createSquares(squareSize:number){
        var squareScale = 100/this.heightWidth+'%';
        this.numberOfSquares = this.heightWidth*this.heightWidth;
        this.squares = new Array();
        for (var i = 0 ; i<this.numberOfSquares ; i++){
            this.squares.push(new Square(i+1, squareSize, squareScale));
        }
    }
}
