import { Injectable , EventEmitter, Output} from '@angular/core';
import {Square} from './domain/square';

@Injectable({
  providedIn: 'root'
})
export class SquareDetailShareService {
    private square:Square;
    @Output() squareUpdated:EventEmitter<Square> = new EventEmitter(true);

  constructor() { }

  setSquare(square:Square){
      this.square=square;
      this.squareUpdated.emit(square);
  }
  getSquare():Square{
      return this.square;
  }
}
