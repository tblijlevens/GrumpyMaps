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
    inRangeSquares:Square[];
    rangeCutOffSquares:Square[];
    movementMode:boolean;
    freeMove:boolean;
    disengageMode:boolean;
    chargeMode:boolean;
    selectedPlayer:Player=null;
    cutOffMechanic:boolean;
    cutOffNumber:number;
    selectedSquares:Square[];
    selecting:boolean;
    deselecting:boolean;
    multiSelect:boolean;

    constructor() {
    }


}
