import { Injectable, EventEmitter, Output } from '@angular/core';
import { Square } from './domain/square';

@Injectable({
  providedIn: 'root'
})
export class SquareDetailShareService {
  private square: Square;
  private squareStyles: object;
  @Output() squareUpdated: EventEmitter<Square> = new EventEmitter(true);
  @Output() squareStylesUpdated: EventEmitter<object> = new EventEmitter(true);

  constructor() { }

  setSquare(square: Square) {
    this.square = square;
    this.squareUpdated.emit(square);
  }
  getSquare(): Square {
    return this.square;
  }

  setSquareStyles(squareStyles: object) {
    this.squareStyles = squareStyles;
    this.squareStylesUpdated.emit(squareStyles);
  }

}
