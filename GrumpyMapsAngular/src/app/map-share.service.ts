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
  private rangeSquares:Square[] = new Array();
  private dndMap:DnDMap;
  @Output() squareUpdated: EventEmitter<Square> = new EventEmitter(true);
  @Output() playerZonesUpdated: EventEmitter<boolean> = new EventEmitter(true);
  @Output() tileZonesUpdated: EventEmitter<boolean> = new EventEmitter(true);

  constructor() { }

  setSquare(square: Square) {
    this.square = square;
    this.squareUpdated.emit(square);
  }
  getSquare(): Square {
    return this.square;
  }
  setPlayerZones() {
    this.playerZonesUpdated.emit(true);
  }

  setTileZones() {
    this.tileZonesUpdated.emit(true);
  }



}
