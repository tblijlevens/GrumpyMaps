import {Square} from './square';
import * as $ from 'jquery';

export class Player{

    id:number;
    playerSquareId:number
    name:string;
    playerIcon:File;
    playerIconUrl:string;
    actionPoints:number;
    movementAmount:number;
    movementLeft:number;
    initiative:number;
    attacksPerRound:number;
    spellsPerRound:number;
    type:string;
    color:string;
    activeColor:string;
    mapHeightWidth:number
    isSelected:boolean;
    mapSquareId:number;
    realSquareId:number;
    squareMapCoordinate:string;
    mapId:number;

    constructor(id, playerSquareId, name, actionPoints, movementAmount, initiative, attacksPerRound, spellsPerRound, type, color, mapSquareId, mapHeightWidth, squareMapCoordinate, playerIcon, mapId){
        this.id = id;
        this.name = name;
        this.actionPoints = actionPoints;
        this.movementAmount = movementAmount;
        this.movementLeft = movementAmount;
        this.initiative = initiative;
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
        this.mapId = mapId;
        this.setActiveColor();
    }
    getName(){
        return this.name;
    }
    setMapSquareId(activeSquare){
        this.mapSquareId = activeSquare;
    }

    getMoveRange(currentSquareSize:number, allSquares:Square[]){
        // calculate movementleft based on actionPoints:
        this.movementLeft = this.movementAmount*(this.actionPoints/100);
        // calculate relativeMoveSpeed based on tile width
        var relativeMoveSpeed = +(this.movementLeft/currentSquareSize).toFixed(0);
        var moveRange = new Array();

        //get row and column of players current position coordinates:
        var rowNumber = this.squareMapCoordinate.split(":")[0].charCodeAt(0);
        var column = +this.squareMapCoordinate.split(":")[1];

        // calculate distance of elligable tiles:
        for (var i = 0 ; i < allSquares.length ; i++){
            var targetRowNumber = allSquares[i].mapCoordinate.split(":")[0].charCodeAt(0);
            var targetColumn = +allSquares[i].mapCoordinate.split(":")[1];

            var rowDif = this.getDifference(rowNumber, targetRowNumber);
            var colDif = this.getDifference(column, targetColumn);

            // make selection of tiles to do calculations on smaller:
            if (rowDif<=relativeMoveSpeed && colDif<=relativeMoveSpeed){

                var distance = 0;
                if (rowDif == 0){
                    distance = colDif*currentSquareSize
                }
                if (colDif == 0 && rowDif!=0){
                    distance = rowDif*currentSquareSize
                }

                // when diagonal movement calc distance based on a^2+b^2=c^2
                // just a diagonal line:
                if (colDif == rowDif && colDif !=0){
                    var squaredTileSize = Math.pow(currentSquareSize,2);
                    distance = colDif * Math.sqrt(squaredTileSize+squaredTileSize);
                }

                // combination of diagonal and vertical/horizontal line
                if (colDif!=rowDif && colDif>0 && rowDif>0){
                    var minimum = Math.min(colDif,rowDif);
                    var maximum = Math.max(colDif,rowDif);
                    var squaredTileSize = Math.pow(currentSquareSize,2);
                    var diagonal = minimum * Math.sqrt(squaredTileSize+squaredTileSize);
                    var straight = (maximum-minimum)*currentSquareSize;
                    distance=diagonal+straight;
                }

                // put in range tiles in the moveRange variable to return:
                if (distance <= this.movementLeft){
                    //set the distance of the square:
                    allSquares[i].currentDistance = +distance.toFixed(1);
                    moveRange.push(allSquares[i]);
                }
            }
        }

        return moveRange;
    }
    getDifference(num1, num2){
    return (num1 > num2)? num1-num2 : num2-num1
  }
    movePlayer(yardsMoved:number){
        this.movementLeft = this.movementAmount*(this.actionPoints/100);
        var percentageMoved = yardsMoved/this.movementAmount;
        this.actionPoints -= +(100*percentageMoved).toFixed(0);
        this.movementLeft = this.movementAmount*(this.actionPoints/100);
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
