import {Physical} from './physical';
import * as $ from 'jquery';

export class Player implements Physical{

    id:number;
    playerSquareId:number
    name:string;
    playerIcon:File;
    playerIconUrl:string;
    actionPoints:number;
    movementAmount:number;
    attacksPerRound:number;
    spellsPerRound:number;
    type:string;
    color:string;
    activeColor:string;
    mapSquareId:number;
    mapHeightWidth:number
    isSelected:boolean;
    realSquareId:number;
    squareMapCoordinate:string;

    constructor(id, playerSquareId, name, actionPoints, movementAmount, attacksPerRound, spellsPerRound, type, color, mapSquareId, mapHeightWidth, squareMapCoordinate, playerIcon){
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.movementAmount = movementAmount;
        this.isSelected = false;
        this.attacksPerRound = attacksPerRound;
        this.spellsPerRound = spellsPerRound;
        this.type = type;
        if(this.color != "#00ff00"){
        this.color = color;
      } else {
        this.color = "#00c40c";
      }
        this.mapSquareId = mapSquareId;
        this.mapHeightWidth = mapHeightWidth;
        this.playerSquareId = playerSquareId;
        this.squareMapCoordinate = squareMapCoordinate;
        this.playerIcon = playerIcon;
        this.setActiveColor();
    }
    getName(){
        return this.name;
    }
    setMapSquareId(activeSquare){
        this.mapSquareId = activeSquare;
    }

    getMoveRange(){
        var moveRange = new Array();
        for (var i = -this.movementAmount ; i <= this.movementAmount ; i++){
            var availableSquare = this.mapSquareId + (i*this.mapHeightWidth);

            if(i<=0){
                for (var j=-i-this.movementAmount ; j<= i+this.movementAmount ; j++){
                    moveRange.push(availableSquare+j);
                }
            }
            if(i>0){
                for (var j=i-this.movementAmount ; j<= this.movementAmount-i ; j++){
                    moveRange.push(availableSquare+j);
                }
            }
        }
        return moveRange;
    }

    setActiveColor(){
        if (this.isSelected){
            $("#playerMap"+this.id).css({"box-shadow": "0px 0px 15px 3px " + this.color, "border-radius":"5px"});
            $("#playerDetail"+this.id).css({"box-shadow": "0px 0px 15px 3px " + this.color, "border-radius":"5px"});
            $("#playerDot"+this.id).css({"box-shadow": "0px 0px 15px 3px " + this.color, "border":"none"});
        }
        else
        {
            $("#playerMap"+this.id).css({"box-shadow": "none"});
            $("#playerDetail"+this.id).css({"box-shadow": "none"});
            $("#playerDot"+this.id).css({"box-shadow": "none", "border":"solid 1px black"});
        }
    }

}
