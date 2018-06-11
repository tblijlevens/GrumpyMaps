import { Injectable, EventEmitter, Output } from '@angular/core';
import { Square } from './domain/square';
import { DnDMap } from './domain/dn-dmap';
import { Observable, from, of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MapShareService {
  private square: Square;
  private squareBorderStyle: string;
  private obstructionMode:boolean;
  private allRangeSquares: number[];
  private dndMap:DnDMap;
  @Output() squareUpdated: EventEmitter<Square> = new EventEmitter(true);
  @Output() squareBorderStyleUpdated: EventEmitter<string> = new EventEmitter(true);
  @Output() obstructionModeUpdated: EventEmitter<boolean> = new EventEmitter(true);
  @Output() allRangeSquaresUpdated: EventEmitter<number[]> = new EventEmitter(true);
  @Output() dndMapUpdated: EventEmitter<DnDMap> = new EventEmitter(true);

  constructor() { }

  setSquare(square: Square) {
    this.square = square;
    this.squareUpdated.emit(square);
  }
  getSquare(): Square {
    return this.square;
  }

  setSquareBorderStyles(squareBorderStyle: string) {
    this.squareBorderStyle = squareBorderStyle;
    this.squareBorderStyleUpdated.emit(squareBorderStyle);
  }

  setObstructionMode(obstructionMode: boolean) {
    this.obstructionMode = obstructionMode;
    this.obstructionModeUpdated.emit(obstructionMode);
  }
  setAllRangeSquares(allRangeSquares: number[]) {
      var allSquares = this.dndMap.squares;
      var rangeSquares = new Array();
      for (var i = 0 ; i<allSquares.length ; i++){
          for (var j = 0 ; i<allRangeSquares.length ; j++){
              if (allSquares[i].mapSquareId == allRangeSquares[j]){
                  rangeSquares.push(allSquares[i]);
              }
          }
      }
      for (var i=0 ; i<rangeSquares.length ; i++){
          console.log("following squares will be styled: " + rangeSquares[i].id);
      }
    this.allRangeSquares = allRangeSquares;
    this.allRangeSquaresUpdated.emit(allRangeSquares);
  }
  setDnDMap(dndMap: DnDMap) {
    this.dndMap = dndMap;
    this.dndMapUpdated.emit(dndMap);
    console.log("dndMap was updated");
  }

}
