import { Injectable, EventEmitter, Output } from '@angular/core';
import { Square } from './domain/square';
import { DnDMap } from './domain/dn-dmap';
import { Observable, from, of} from 'rxjs';
import { distinct} from 'rxjs/operators';
import { Player} from './domain/player';


@Injectable({
  providedIn: 'root'
})
export class MapShareService {
  private square: Square;
  private squareBorderStyle: string;
  private rangeSquares:Square[] = new Array();
  private dndMap:DnDMap;
  private ready:boolean = false;
  private playerToMove: Player;
  @Output() squareUpdated: EventEmitter<Square> = new EventEmitter(true);
  @Output() squareBorderStyleUpdated: EventEmitter<string> = new EventEmitter(true);
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


/*
  private fillRangeSquares(squareIdNr){
      var allSquares = this.dndMap.squares;
      for (var i = 0 ; i<allSquares.length ; i++){
          allSquares[i].inRange = false; //first set everything out of range
          if (allSquares[i].id == squareIdNr){
              allSquares[i].inRange = true;
              selectedSquares.push(allSquares[i]);
              console.log("rangeSquares were updated");
          }
      }

         this.setRangeSquares(selectedSquares);
  }
  */


  setDnDMap(dndMap: DnDMap) {
    this.dndMap = dndMap;
    this.dndMapUpdated.emit(dndMap);
    console.log("dndMap was updated");
  }

}
