import { Injectable, EventEmitter, Output } from '@angular/core';
import { Square } from './domain/square';

@Injectable({
  providedIn: 'root'
})
export class MapShareService {
  private square: Square;
  private squareBorderStyle: string;
  private obstructionMode:boolean;
  @Output() squareUpdated: EventEmitter<Square> = new EventEmitter(true);
  @Output() squareBorderStyleUpdated: EventEmitter<string> = new EventEmitter(true);
  @Output() obstructionModeUpdated: EventEmitter<boolean> = new EventEmitter(true);

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

}
