import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DnDMap } from '../domain/dn-dmap'
import { Square } from '../domain/square'
import { Player } from '../domain/player'

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {

    private rowIndex:number;
    @Input() set _rowIndex(rowIndex: number) {
        this.rowIndex=rowIndex;
        this.setRowIndexLetters();
    }
    rowIndexAsLetter:string;
    @Input() dndMap:DnDMap;

    private heightWidth: number;
    @Input() set _heightWidth(heightWidth: number) {
        this.heightWidth=heightWidth;
        this.setRowSquares();
    }
    rowSquares: Square[] = new Array();

    @Input() rowStyles = {};

    @Input() obstructionMode: boolean = false;
    @Input() movementMode: boolean;
    @Output() moveModeEvent = new EventEmitter<boolean>();
    @Output() setRangeSquaresEvent = new EventEmitter<number[]>();
    @Input() inRangeSquares: Square[] = new Array();


    @Input() squareBorderStyle:string;
    @Input() playerToMove: Player;


    constructor() { }

    ngOnInit() {
    }

    private setRowSquares(){
        this.rowSquares = new Array();
        //this.dndMap.squares = this.dndMap.squares;
        for (var i=0 ; i<this.dndMap.squares.length ; i++){
            if (this.dndMap.squares[i].mapSquareId >= (this.rowIndex-1)*this.heightWidth+1
            && this.dndMap.squares[i].mapSquareId <= this.rowIndex*this.heightWidth){
                this.rowSquares.push(this.dndMap.squares[i]);
                this.dndMap.squares[i].mapCoordinate = this.rowIndexAsLetter+ this.rowSquares.length;
                console.log(this.rowIndexAsLetter + " setting rowSquare: " +this.dndMap.squares[i].id + " wih mapsqId: " + this.dndMap.squares[i].mapSquareId +" and coordinate: " + this.dndMap.squares[i].mapCoordinate);
            }
        }
    }

    public receiveMoveMode($event){
        this.moveModeEvent.emit($event);
    }
    public receiveRangeSquares($event){
        this.setRangeSquaresEvent.emit($event);
    }

    private setRowIndexLetters(){
        switch(this.rowIndex) {
            case 1: {
                this.rowIndexAsLetter="A";
                break;
            }
            case 2: {
                this.rowIndexAsLetter="B";
                break;
            }
            case 3: {
                this.rowIndexAsLetter="C";
                break;
            }
            case 4: {
                this.rowIndexAsLetter="D";
                break;
            }
            case 5: {
                this.rowIndexAsLetter="E";
                break;
            }
            case 6: {
                this.rowIndexAsLetter="F";
                break;
            }
            case 7: {
                this.rowIndexAsLetter="G";
                break;
            }
            case 8: {
                this.rowIndexAsLetter="H";
                break;
            }
            case 9: {
                this.rowIndexAsLetter="I";
                break;
            }
            case 10: {
                this.rowIndexAsLetter="J";
                break;
            }
            case 11: {
                this.rowIndexAsLetter="K";
                break;
            }
            case 12: {
                this.rowIndexAsLetter="L";
                break;
            }
            case 13: {
                this.rowIndexAsLetter="M";
                break;
            }
            case 14: {
                this.rowIndexAsLetter="N";
                break;
            }
            case 15: {
                this.rowIndexAsLetter="O";
                break;
            }
            case 16: {
                this.rowIndexAsLetter="P";
                break;
            }
            case 17: {
                this.rowIndexAsLetter="Q";
                break;
            }
            case 18: {
                this.rowIndexAsLetter="R";
                break;
            }
            case 19: {
                this.rowIndexAsLetter="S";
                break;
            }
            case 20: {
                this.rowIndexAsLetter="T";
                break;
            }
            case 21: {
                this.rowIndexAsLetter="U";
                break;
            }
            case 22: {
                this.rowIndexAsLetter="V";
                break;
            }
            case 23: {
                this.rowIndexAsLetter="W";
                break;
            }
            case 24: {
                this.rowIndexAsLetter="X";
                break;
            }
            case 25: {
                this.rowIndexAsLetter="Y";
                break;
            }
        }
    }
}
