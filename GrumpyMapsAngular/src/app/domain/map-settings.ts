import { Player } from './player';
import { Square } from './square';
import { DnDMap } from './dn-dmap';

export class MapSettings {
/*    [squareHeightWidth]=square.squareHeightWidth [square]=square [squareSize]=squareSize [allSquares]=dndMap.squares [squareIndex]=i [rowIndexAsLetter]=setRowIndexLetter(j) [obstructionMode]=obstructionMode [inRangeSquares]=rangeSquares [_rangeCutOffSquares]=rangeCutOffSquares [movementMode]=movementMode [freeMove]=freeMove [disengageMode]=disengageMode [chargeMode]=chargeMode [selectedPlayer]=selectedPlayer [cutOffMechanic]=cutOffMechanic [cutOffNumber]=cutOffNumber [_squareBorderStyles]=squareBorderStyle [_selectedSquares]=selectedSquares [selecting]=selecting [deselecting]=deselecting [_multiSelect]=multiSelect [setStyles]=setStyles  (moveModeEvent)="receiveMoveMode($event)" (freeMoveEvent)="receiveFreeMove($event)" (disengageModeEvent)="receiveDisengageMode($event)" (chargeModeEvent)="receiveChargeMode($event)" (setRangeSquaresEvent)="receiveRangeSquares($event)" (selectedSquaresEvent)="receiveSelectedSquares($event)"
    (selectingEvent)="receiveSelecting($event)" (deselectingEvent)="receiveDeselecting($event)" (setSelectedPlayerEvent)="receiveSelectedPlayer($event)"*/
    dndMap:DnDMap;
    allSquares:Square[];
    squareHeightWidth:string;
    squareSize:number;
    rangeSquares:Square[] = new Array();
    rangeCutOffSquares:Square[] = new Array();
    movementMode:boolean;
    freeMove:boolean;
    disengageMode:boolean;
    chargeMode:boolean;
    selectedPlayer:Player=null;
    cutOffMechanic:boolean;
    cutOffNumber:number;
    selectedSquares:Square[] = new Array();
    selecting:boolean;
    deselecting:boolean;
    multiSelect:boolean;

    constructor() {
    }

    public setRange(rangeSquares:Square[]){
        //set styles of the previous rangeSquares:
        for (var i = 0 ; i< this.rangeSquares.length ; i++){
            this.rangeSquares[i].inRange=false;
            this.setRangeSquareStyles(this.rangeSquares[i]);
        }

        this.rangeSquares = rangeSquares;
        //set styles of the new rangeSquares:
        for (var i = 0 ; i< this.rangeSquares.length ; i++){
            this.setRangeSquareStyles(this.rangeSquares[i]);
        }
    }
    public setCutOffRange(rangeCutOffSquares:Square[]){
        //set styles of the previous rangeSquares:
        for (var i = 0 ; i< this.rangeCutOffSquares.length ; i++){
            this.rangeCutOffSquares[i].inRange=false;
            this.setRangeSquareStyles(this.rangeCutOffSquares[i]);
        }

        this.rangeCutOffSquares = rangeCutOffSquares;
        //set styles of the new rangeSquares:
        for (var i = 0 ; i< this.rangeCutOffSquares.length ; i++){
            this.setRangeSquareStyles(this.rangeCutOffSquares[i]);
        }
    }

    public setRangeSquareStyles(square:Square) {

      if (!square.obstructed && !this.selectedSquares.includes(square)) {
        if (square.inRange) {
            if (this.rangeCutOffSquares.includes(square)) {
                if (!square.fogged){
                //   this.squareStyles['background-color'] = 'rgba(0, 161, 161, 0.5)';
                  $("#squarecontainer"+square.mapSquareId).css({"backgroundColor":"rgba(0, 161, 161, 0.5)"});
                }
                else {
                //   this.squareStyles['background-color'] = 'rgba(0, 35, 35, 1)';
                  $("#squarecontainer"+square.mapSquareId).css({"backgroundColor":"rgba(0, 35, 35, 1)"});
                }
            }
            else {
                if (!square.fogged){
                //   this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0.5)';
                  $("#squarecontainer"+square.mapSquareId).css({"backgroundColor":"rgba(8, 161, 0, 0.5)"});
                }
                else {
                //   this.squareStyles['background-color'] = 'rgba(8, 35, 0, 1)';
                  $("#squarecontainer"+square.mapSquareId).css({"backgroundColor":"rgba(8, 35, 0, 1)"});
                }
            }
        }
        else {
            if (!square.fogged){
                //this.squareStyles['background-color'] = "rgba(0, 0, 0, 0.0)";
                $("#squarecontainer"+square.mapSquareId).css({"backgroundColor":"rgba(0, 0, 0, 0.0)"});
            }
        }
       // this.selectionStyles();
      }
    }

}
