import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {

    @Input() rowIndex:number;
    rowIndexAsLetter:string;

    @Input()
    squareHeightWidth: string;
    @Input()
    rowStyles = {};

    constructor() { }

    ngOnInit() {
        this.setRowIndexLetters();
    }

    private setRowIndexLetters(){
        switch(this.rowIndex) {
            case 0: {
                this.rowIndexAsLetter="A";
                break;
            }
            case 1: {
                this.rowIndexAsLetter="B";
                break;
            }
            case 2: {
                this.rowIndexAsLetter="C";
                break;
            }
            case 3: {
                this.rowIndexAsLetter="D";
                break;
            }
            case 4: {
                this.rowIndexAsLetter="E";
                break;
            }
            case 5: {
                this.rowIndexAsLetter="F";
                break;
            }
            case 6: {
                this.rowIndexAsLetter="G";
                break;
            }
            case 7: {
                this.rowIndexAsLetter="H";
                break;
            }
            case 8: {
                this.rowIndexAsLetter="I";
                break;
            }
            case 9: {
                this.rowIndexAsLetter="J";
                break;
            }
            case 10: {
                this.rowIndexAsLetter="K";
                break;
            }
            case 11: {
                this.rowIndexAsLetter="L";
                break;
            }
            case 12: {
                this.rowIndexAsLetter="M";
                break;
            }
            case 13: {
                this.rowIndexAsLetter="N";
                break;
            }
            case 14: {
                this.rowIndexAsLetter="O";
                break;
            }
            case 15: {
                this.rowIndexAsLetter="P";
                break;
            }
            case 16: {
                this.rowIndexAsLetter="Q";
                break;
            }
            case 17: {
                this.rowIndexAsLetter="R";
                break;
            }
            case 18: {
                this.rowIndexAsLetter="S";
                break;
            }
            case 19: {
                this.rowIndexAsLetter="T";
                break;
            }
            case 20: {
                this.rowIndexAsLetter="U";
                break;
            }
            case 21: {
                this.rowIndexAsLetter="V";
                break;
            }
            case 22: {
                this.rowIndexAsLetter="W";
                break;
            }
            case 23: {
                this.rowIndexAsLetter="X";
                break;
            }
            case 24: {
                this.rowIndexAsLetter="Y";
                break;
            }
        }
    }
}
