$(document).ready(function() {
    $("#mapSetup").toggle( 1000 );

    // responsive sizing on resizing the window (e.g. fullscreen)
    $(window).on('resize', function(){
        // set three column widths:
        var contentWidth = $("#allContent").css('width');
        var mapHeightPX = $(".mapcontainer").css('height');
        var mapHeight = +mapHeightPX.split("px")[0];
        var mapInnerHeight = $(".mapcontainer").innerHeight();
        var columnWidth = (+contentWidth.split("px")[0]-+mapHeightPX.split("px")[0])/2;
        columnWidth -= 12;
        var columnWidthFirst = columnWidth-35;
        $(".mapcontainer").css({width: mapHeightPX});
        $("#firstColumn").css({width: columnWidthFirst});
        $("#secondColumn").css({width: columnWidth});

        var mapOffset = $(".mapcontainer").offset();
        var mapPos = $(".mapcontainer").position();

        // set rowletters and colnumbers size and position:
        $("#rowLetters").css({
            height:mapInnerHeight,
            left: mapPos.left
        });
        $("#columnNumbers").css({
            width:mapInnerHeight,
            left: mapPos.left
        });

        // set rowLetters in correct position:
        var rowHeight = $(".rowLetter").css("height");
         $(".rowLetter").css({"line-height":rowHeight});

        // set setup box width:
        $("#mapSetup").css({width: columnWidth+40});

        //set infobox width
        $("#infoBox").css({"width":(mapHeight-40)});

        //set legend size and position:
        $("#legend").css({
            width: mapHeightPX,
            top: mapHeight,
            left: mapPos.left
        });

    });

    //make right mouse click in map not popup the contextmenu
    $( ".mapcontainer" ).contextmenu((e)=> {
        e.preventDefault();
    });

    //Set line-height of rowLeters so they are vertically alligned to the middle:
    var rowHeight = $(".rowLetter").css("height");
    $(".rowLetter").css({"line-height":rowHeight});
});


import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
//import  $ from 'jquery';
//import $ = require("jquery");
import * as $ from 'jquery';

import { DnDMapService } from '../dn-dmap.service'
import { MapShareService } from '../map-share.service';
import { DnDMap } from '../domain/dn-dmap'
import { Square } from '../domain/square'
import { Player } from '../domain/player'

import { SquareComponent } from '../square/square.component';
import { SquareDetailComponent } from '../square-detail/square-detail.component';

/*
jquare examples
$('#setParButton').css({bottom: "300px", right: '-500px'});
$('#setParButton').animate({bottom: "-15px", right: '25px'}, 1000);
$('#setParButton').click(function() { do things}
$( "#row3" ).mouseover(function() {}

*/
@Component({
    selector: 'app-map-detail',
    templateUrl: './map-detail.component.html',
    styleUrls: ['./map-detail.component.css'],
    providers: [DnDMapService]
})

export class MapDetailComponent implements OnInit {
    mapForm = new FormGroup({
        heightwidth: new FormControl(),
        yards: new FormControl(),
        imageUrl: new FormControl(),
        moveCutCheck: new FormControl(),
        moveCutRange: new FormControl(),
        showGridCheck: new FormControl()
    });
    createPlayerForm = new FormGroup({
      playerName: new FormControl(),
      playerColor: new FormControl(),
      playerInitiative: new FormControl(),
      playerMovement: new FormControl(),
      playerAttacks: new FormControl(),
      playerSpells: new FormControl()
    });

    createItemForm = new FormGroup({
      itemName: new FormControl(),
      itemColor: new FormControl(),
      itemAmount: new FormControl()
    });

    getObjectForm = new FormGroup({
        playerMovement: new FormControl(),
        objectAmount: new FormControl()
    });
    addZonePlayerForm = new FormGroup({
        zoneRadius: new FormControl(),
        zoneDuration: new FormControl(),
        zoneLabel: new FormControl()
    });
    addZoneTileForm = new FormGroup({
        zoneRadius: new FormControl(),
        zoneDuration: new FormControl(),
        tileZoneColor: new FormControl(),
        zoneLabel: new FormControl()
    });
    colorTileForm = new FormGroup({
        selectAll: new FormControl(),
        tileColor: new FormControl(),
        obstructTile: new FormControl()
    });
    radius:number;
    saveForm = new FormGroup({
        mapName: new FormControl()
    });
    imageForm:FormGroup;

    dndMap: DnDMap;
    mapBackground = {};
    legendSquare = {};
    squareScale: string = '10%';
    squareSize:number = 5;
    heightWidth:number = 10;
    columnArray:number[] = new Array();
    rowArray:number[] = new Array();
    rowArrayLetters:string[] = new Array();
    mapsLoaded=false;
    allLoadedMapsResult;
    allLoadedMapIds:number[];
    allLoadedMapNames:string[];
    selectedLoadMap:number;
    selectedLoadMapname:string;
    mapExists:boolean=false;
    charsLoaded:boolean=false;
    allLoadedCharacters:Player[];
    selectedLoadCharacter:Player;
    resultCounter:number=0;
    obstructionMode:boolean=false;
    movementMode:boolean=false;
    freeMove:boolean=false;
    disengageMode:boolean=false;
    chargeMode:boolean=false;
    rangeSquares:Square[] = new Array();
    rangeCutOffSquares:Square[] = new Array();
    selectedPlayer:Player=null;
    squareBorderStyle = {};
    mapFeet:number;
    squareFeet:number;
    showGrid:boolean=true;
    multiSelect:boolean=false;
    selecting:boolean=false;
    deselecting:boolean=false;
    selectedSquares:Square[] = new Array();
    selectedSquare:Square;
    selectedFile: File;
    allCharacters:Player[] = new Array();
    setStyles:boolean = false;
    iconUrl;
    fileName;
    fileType;
    fileValue;
    cutOffMechanic:boolean=false;
    cutOffNumber:number;
    playerIdCreator: number = 1;
    playerIdGenerator:number=0;
    zoneIdCreator: number = 1;
    zoneIdGenerator:number=0;

    constructor(private dndMapService: DnDMapService, private mapShareService: MapShareService, private fb: FormBuilder) {
        this.createImageForm();
    }

    ngOnInit() {
        this.loadMap();
        this.mapForm.get('heightwidth').setValue(10);
        this.mapForm.get('yards').setValue(5);
        this.mapForm.get('moveCutCheck').setValue(false);
        this.mapForm.get('moveCutRange').setValue(50);
        this.mapForm.get('showGridCheck').setValue(true);
        this.dndMap = new DnDMap(0, this.heightWidth, this.squareSize); //id zero cannot exist in databse, so it will generate a new unique id)

        this.createPlayerForm.get('playerColor').setValue("#ff0000");
        this.createPlayerForm.get('playerInitiative').setValue(15);
        this.createPlayerForm.get('playerMovement').setValue(15);
        this.createPlayerForm.get('playerAttacks').setValue(1);
        this.createPlayerForm.get('playerSpells').setValue(1);

        this.addZonePlayerForm.get('zoneRadius').setValue(0);
        this.addZonePlayerForm.get('zoneDuration').setValue(1);
        this.addZoneTileForm.get('zoneRadius').setValue(10);
        this.addZoneTileForm.get('zoneDuration').setValue(1);
        this.addZoneTileForm.get('tileZoneColor').setValue("#ffa100");

        this.colorTileForm.get('tileColor').setValue("#000000");

        this.setRows();
        this.calculateMapFeet();
        this.setSizes();

    }

    setSizes(){
        // set three column widths:
        var contentWidth = $("#allContent").css('width');
        var mapHeightPX = $(".mapcontainer").css('height');
        var mapHeight = +mapHeightPX.split("px")[0];
        var mapInnerHeight = $(".mapcontainer").innerHeight();
        var columnWidth = (+contentWidth.split("px")[0]-+mapHeightPX.split("px")[0])/2;
        columnWidth -= 12;
        var columnWidthFirst = columnWidth-35;
        $(".mapcontainer").css({width: mapHeightPX});
        $("#firstColumn").css({width: columnWidthFirst});
        $("#secondColumn").css({width: columnWidth});

        var mapOffset = $(".mapcontainer").offset();
        var mapPos = $(".mapcontainer").position();

        // set rowletters and colnumbers size and position:
        $("#rowLetters").css({
            height:mapInnerHeight,
            left: mapPos.left
        });
        $("#columnNumbers").css({
            width:mapInnerHeight,
            left: mapPos.left
        });

        // set rowLetters in correct position:
        var rowHeight = $(".rowLetter").css("height");
         $(".rowLetter").css({"line-height":rowHeight});

        // set setup box width:
        $("#mapSetup").css({width: columnWidth+40});

        //set infobox width
        $("#infoBox").css({"width":(mapHeight-40)});

        //set legend size and position:
        $("#legend").css({
            width: mapHeightPX,
            top: mapHeight,
            left: mapPos.left
        });

    }
    toggleSettings(){
        $("#mapSetup").toggle( 500 );
    }

    hideSettings(){
        if ($("#mapSetup").css("display")!='none'){
            $("#mapSetup").toggle( 500 );
        }
    }
    public uploadImage() {
        var imageUrl = this.mapForm.get('imageUrl').value;
        this.dndMap.setImage(imageUrl);
        this.mapBackground = {
            'background-image': 'url(' + imageUrl + ')'
        };
    }
    setPic(img){
        this.mapForm.get('imageUrl').setValue(img);
    }

    public setMapHeightWidth() {
        this.heightWidth = +this.mapForm.get('heightwidth').value;
        if (this.heightWidth > 25) {
            this.heightWidth = 25;
            // alert("Map gridsize can't be bigger than 25x25. Therefore gridsize is set to 25x25.");
        }

        this.dndMap = new DnDMap(0, this.heightWidth, this.squareSize); //id zero cannot exist in databse, so it will generate a new unique id)
        var imageUrl = this.mapForm.get('imageUrl').value;
        this.dndMap.setImage(imageUrl);

        this.setRows();
        this.calculateMapFeet();
    }
    setSquareSize(){
        this.squareSize = +this.mapForm.get('yards').value;
        this.mapForm.get('yards').setValue(this.squareSize);
         var squares = this.dndMap.squares;
        for (var i = 0 ; i < squares.length ; i++){
            squares[i].squareSize = this.squareSize;
        }
        this.calculateMapFeet();
        this.mapShareService.setTileZones();
        this.mapShareService.setPlayerZones();
    }

    private calculateMapFeet(){
        this.mapFeet = +(this.dndMap.squares[0].squareSize*this.heightWidth*3).toFixed(1);
        this.squareFeet = +(this.dndMap.squares[0].squareSize*3).toFixed(1);
        this.legendSquare['width'] = this.dndMap.squares[0].squareHeightWidth;
    }

    clickCutOffInfo(){
        var message = "When checked you will use the Cut-Off Mechanic as oposed " +
        "to the Action Point Mechanic <br><br>" +
        "<b>Action Point Mechanic:</b><br>" +
        "Each character starts with 100 action points each turn. Each combat action (move, attack, cast spell) cost action points. The remainder of action points determine how much of each combat action can still be performed. Example: a character can perform 3 attacks/turn and move 15 yards/turn. When the character attacks once (33%) the character has 10 yards movement left (67%).<br><br>" +
        "<b>Cut-Off Mechanic:</b><br>" +
        "Some Game Masters like to give their players some movement without losing attacks or spells. Let's say you set the cut-off slider to 40%. It means any character can move up to 40% of its movement amount without losing attacks or spells that turn. However, when spending more than 40% of its movement amount, the character loses all its attacks and spells for that round. More concrete, in cut-off mode a character can do one of the three options below:<br><ol>" +
        "<li> Start the turn with performing all or a part of the attacks/spells and then move up to 40% of the movement amount.<br>" +
        "<li> Start the turn with moving up to 40% of the movement amount and then perform all or a part of the attacks/spells.<br>" +
        "<li> Start the turn with moving more than 40% of the movement amount and lose all Attacks/spells this turn.</ol>";

        this.showInfoBox(message,"black");
    }

    setCutOffRange(){
        this.dndMap.cutOffMechanic = this.mapForm.get('moveCutCheck').value;
        this.dndMap.cutOffNumber = +this.mapForm.get('moveCutRange').value/100;
        this.cutOffMechanic = this.dndMap.cutOffMechanic;
        this.cutOffNumber = this.dndMap.cutOffNumber;
    }

    public setMultiSelect(){
        if (this.multiSelect){
            this.multiSelect = false;
            $("#multiSelect").css({"box-shadow":"none"})
        }
        else {
            this.multiSelect = true;
            $("#multiSelect").css({"box-shadow":"0 0 4px 2px #2A74F2"})
        }
        this.selectedSquares = new Array();
    }

    public hideGrid() {
        this.showGrid = this.mapForm.get('showGridCheck').value;
        if(this.showGrid){
            this.squareBorderStyle= 'dotted 1px rgb(162, 162, 162, 0.7)';
        }
        else {
            this.squareBorderStyle = 'dotted 1px rgb(162, 162, 162, 0)';
        }
    }
    toggleVisibility(){
        // tgogle the squares hidden field:
        var madeVisible = "";
        var madeInvisible = "";
        for (var i = 0 ; i < this.selectedSquares.length ; i++){
            if (this.selectedSquares[i].hidden){
                this.selectedSquares[i].hidden=false;
                if (madeVisible!=""){
                    madeVisible+= ", ";
                }
                madeVisible+=this.selectedSquares[i].mapCoordinate;
            }
            else {
                this.selectedSquares[i].hidden=true;
                if (madeInvisible!=""){
                    madeInvisible+= ", ";
                }
                madeInvisible+=this.selectedSquares[i].mapCoordinate;
            }
        }

        // update zone sizes
        this.mapShareService.setPlayerZones();
        this.mapShareService.setTileZones();

        // show a message:
        var message="";
        if (madeInvisible!=""){
            message+= "These tiles were made invisible. <B>Write these down</b>:<br>" + madeInvisible;
        }
        if (madeVisible!=""){
            if (madeInvisible!=""){
                message+= "<br>";
            }
            message+= "These tiles were made visible:<br>" + madeVisible;
        }
        this.showInfoBox(message,"black");
    }


    // public toggleFullScreen() {
    //     $('body').fullscreen();
    //     return false;
    // }

    clickPlayer(player: Player) {
        this.deselectAll();
        if (player!=null){
            player.isSelected = true;
            player.setActiveColor();
        }
        this.selectedPlayer = player;
        if (player!=null){
            var playerSquare = this.getPlayerSquare(this.selectedPlayer);
            this.mapShareService.setSquare(playerSquare); //update active square in squareDetail via mapShareService
            this.showPlayerDot();
        }
        if ((<KeyboardEvent>window.event).ctrlKey || (<KeyboardEvent>window.event).metaKey){
            this.selectedPlayer.resetAllStats();
        }
    }

    deselectAll(){
        this.resetAllDistances();
        this.deselectAllCharacters();
        this.setAllActiveColors();
        this.selectedSquares = new Array();
        this.selectedPlayer=null;
        this.movementMode = false;
        this.freeMove = false;
        this.chargeMode = false;
        this.rangeSquares = new Array();
        this.rangeCutOffSquares = new Array();
    }
    resetAllDistances(){
        for (var i=0 ; i<this.dndMap.squares.length ; i++){
            this.dndMap.squares[i].currentDistance=9999;
        }
    }
    deselectAllCharacters(){
        for (var i=0 ; i<this.allCharacters.length;i++){
            this.allCharacters[i].isSelected=false;
        }
    }
    setAllActiveColors(){
        for (var i=0 ; i<this.allCharacters.length;i++){
            this.allCharacters[i].setActiveColor();
        }
    }
    getPlayerSquare(player:Player){
        var playerSquare:Square=null;
        for (var i = 0 ; i < this.dndMap.squares.length ; i++){
            if (this.dndMap.squares[i].mapSquareId == player.mapSquareId){
                playerSquare = this.dndMap.squares[i];
            }
        }
        return playerSquare;
    }
    showRange(player:Player){
        if (this.freeMove){
            this.rangeSquares = this.getMoveRangeFree(player, this.dndMap.squares);
        }
        else{
            this.rangeSquares = this.getMoveRange(player, this.dndMap.squares);
            if (this.dndMap.cutOffMechanic){
                this.rangeCutOffSquares = this.getCutOffRange();
            }
        }
        this.setSquareTextSize();
    }
    showDisengageRange(player:Player){
        this.rangeSquares = this.getDisengageRange(player, this.dndMap.squares);
        this.setSquareTextSize();
    }
    showChargeRange(player:Player){
        this.rangeSquares = this.getChargeRange(player, this.dndMap.squares);
        this.setSquareTextSize();
    }

    getMoveRange(player:Player, allSquares:Square[]){
        // calculate relativeMoveSpeed based on tile width
        var relativeMoveSpeed = +(player.movementLeft/this.squareSize).toFixed(0);

        var moveRange = new Array();

        //get row and column of players current position coordinates:
        var rowNumber = player.squareMapCoordinate.split(":")[0].charCodeAt(0);
        var column = +player.squareMapCoordinate.split(":")[1];

        // calculate distance of elligable tiles:
        for (var i = 0 ; i < allSquares.length ; i++){
            var targetRowNumber = allSquares[i].mapCoordinate.split(":")[0].charCodeAt(0);
            var targetColumn = +allSquares[i].mapCoordinate.split(":")[1];

            var rowDif = this.getDifference(rowNumber, targetRowNumber);
            var colDif = this.getDifference(column, targetColumn);
            var distance = 0;

            // make selection of tiles to do calculations on smaller:
            if (rowDif<=relativeMoveSpeed && colDif<=relativeMoveSpeed){

                if (rowDif == 0){
                    distance = colDif*this.squareSize
                }
                if (colDif == 0 && rowDif!=0){
                    distance = rowDif*this.squareSize
                }

                // when diagonal movement calc distance based on a^2+b^2=c^2
                // just a diagonal line:
                if (colDif == rowDif && colDif !=0){
                    var squaredTileSize = Math.pow(this.squareSize,2);
                    distance = colDif * Math.sqrt(squaredTileSize+squaredTileSize);
                }

                // combination of diagonal and vertical/horizontal line
                if (colDif!=rowDif && colDif>0 && rowDif>0){
                    var minimum = Math.min(colDif,rowDif);
                    var maximum = Math.max(colDif,rowDif);
                    var squaredTileSize = Math.pow(this.squareSize,2);
                    var diagonal = minimum * Math.sqrt(squaredTileSize+squaredTileSize);
                    var straight = (maximum-minimum)*this.squareSize;
                    distance=diagonal+straight;
                }

                // put in range tiles in the moveRange variable to return:
                if (distance <= player.movementLeft){
                    //set the distance of the square:
                    allSquares[i].currentDistance = +distance.toFixed(1);
                    if (!allSquares[i].obstructed && !allSquares[i].fogged){
                        moveRange.push(allSquares[i]);
                    }
                }
            }
        }

        return moveRange;
    }
    getDisengageRange(player:Player, allSquares:Square[]){

        var moveRange = new Array();

        //get row and column of players current position coordinates:
        var rowNumber = player.squareMapCoordinate.split(":")[0].charCodeAt(0);
        var column = +player.squareMapCoordinate.split(":")[1];

        // calculate distance of elligable tiles:
        for (var i = 0 ; i < allSquares.length ; i++){
            var targetRowNumber = allSquares[i].mapCoordinate.split(":")[0].charCodeAt(0);
            var targetColumn = +allSquares[i].mapCoordinate.split(":")[1];

            var rowDif = this.getDifference(rowNumber, targetRowNumber);
            var colDif = this.getDifference(column, targetColumn);
            var distance = 0;

            // make selection of tiles to do calculations on smaller:
            if (rowDif<=1 && colDif<=1){
                if (rowDif == 0){
                    distance = colDif*this.squareSize
                }
                if (colDif == 0 && rowDif!=0){
                    distance = rowDif*this.squareSize
                }

                // when diagonal movement calc distance based on a^2+b^2=c^2
                // just a diagonal line:
                if (colDif == rowDif && colDif !=0){
                    var squaredTileSize = Math.pow(this.squareSize,2);
                    distance = colDif * Math.sqrt(squaredTileSize+squaredTileSize);
                }

                // combination of diagonal and vertical/horizontal line
                if (colDif!=rowDif && colDif>0 && rowDif>0){
                    var minimum = Math.min(colDif,rowDif);
                    var maximum = Math.max(colDif,rowDif);
                    var squaredTileSize = Math.pow(this.squareSize,2);
                    var diagonal = minimum * Math.sqrt(squaredTileSize+squaredTileSize);
                    var straight = (maximum-minimum)*this.squareSize;
                    distance=diagonal+straight;
                }

                allSquares[i].currentDistance = +distance.toFixed(1);

                // put in range tiles in the moveRange variable to return:
                if (!allSquares[i].obstructed && !allSquares[i].fogged){
                    moveRange.push(allSquares[i]);
                }
            }
        }
        return moveRange;
    }
    getCutOffRange(){
        var cutOffSquares = new Array();
        var cutOffRange = this.selectedPlayer.movementAmount*this.dndMap.cutOffNumber;
        if (this.selectedPlayer.movementLeft != this.selectedPlayer.movementAmount && this.selectedPlayer.movementLeft >= cutOffRange){
            var alreadyMoved = this.selectedPlayer.movementAmount - this.selectedPlayer.movementLeft;
            cutOffRange -= alreadyMoved;
        }
        else if (this.selectedPlayer.movementLeft != this.selectedPlayer.movementAmount && this.selectedPlayer.movementLeft < cutOffRange){
            cutOffRange = 0;
        }
        for (var i = 0 ; i < this.rangeSquares.length ; i++){
            if (this.rangeSquares[i].currentDistance <= cutOffRange && this.selectedPlayer.movementLeft >= this.selectedPlayer.movementAmount*this.dndMap.cutOffNumber){
                if (!this.rangeSquares[i].obstructed && !this.rangeSquares[i].fogged){
                    cutOffSquares.push(this.rangeSquares[i]);
                }
            }
        }
        return cutOffSquares;
    }
    getMoveRangeFree(player:Player, allSquares:Square[]){
        var moveRange = new Array();

        //get row and column of players current position coordinates:
        var rowNumber = player.squareMapCoordinate.split(":")[0].charCodeAt(0);
        var column = +player.squareMapCoordinate.split(":")[1];

        // calculate distance of elligable tiles:
        for (var i = 0 ; i < allSquares.length ; i++){
            var targetRowNumber = allSquares[i].mapCoordinate.split(":")[0].charCodeAt(0);
            var targetColumn = +allSquares[i].mapCoordinate.split(":")[1];

            var rowDif = this.getDifference(rowNumber, targetRowNumber);
            var colDif = this.getDifference(column, targetColumn);
            var distance = 0;

            // make selection of tiles to do calculations on smaller:
            if (rowDif == 0){
                distance = colDif*this.squareSize
            }
            if (colDif == 0 && rowDif!=0){
                distance = rowDif*this.squareSize
            }

            // when diagonal movement calc distance based on a^2+b^2=c^2
            // just a diagonal line:
            if (colDif == rowDif && colDif !=0){
                var squaredTileSize = Math.pow(this.squareSize,2);
                distance = colDif * Math.sqrt(squaredTileSize+squaredTileSize);
            }

            // combination of diagonal and vertical/horizontal line
            if (colDif!=rowDif && colDif>0 && rowDif>0){
                var minimum = Math.min(colDif,rowDif);
                var maximum = Math.max(colDif,rowDif);
                var squaredTileSize = Math.pow(this.squareSize,2);
                var diagonal = minimum * Math.sqrt(squaredTileSize+squaredTileSize);
                var straight = (maximum-minimum)*this.squareSize;
                distance=diagonal+straight;
            }

                allSquares[i].currentDistance = +distance.toFixed(1);
                moveRange.push(allSquares[i]);
        }
        return moveRange;
    }
    getChargeRange(player:Player, allSquares:Square[]){
        // calculate relativeMoveSpeed based on tile width
        var relativeMoveSpeed = +((player.movementAmount*1.5)/this.squareSize).toFixed(0);

        var moveRange = new Array();

        //get row and column of players current position coordinates:
        var rowNumber = player.squareMapCoordinate.split(":")[0].charCodeAt(0);
        var column = +player.squareMapCoordinate.split(":")[1];

        // calculate distance of elligable tiles:
        for (var i = 0 ; i < allSquares.length ; i++){
            var targetRowNumber = allSquares[i].mapCoordinate.split(":")[0].charCodeAt(0);
            var targetColumn = +allSquares[i].mapCoordinate.split(":")[1];

            var rowDif = this.getDifference(rowNumber, targetRowNumber);
            var colDif = this.getDifference(column, targetColumn);
            var distance = 0;

            // make selection of tiles to do calculations on smaller:
            if (rowDif<=relativeMoveSpeed && colDif<=relativeMoveSpeed){

                if (rowDif == 0){
                    distance = colDif*this.squareSize
                }
                if (colDif == 0 && rowDif!=0){
                    distance = rowDif*this.squareSize
                }

                // when diagonal movement calc distance based on a^2+b^2=c^2
                // just a diagonal line:
                if (colDif == rowDif && colDif !=0){
                    var squaredTileSize = Math.pow(this.squareSize,2);
                    distance = colDif * Math.sqrt(squaredTileSize+squaredTileSize);
                }

                // combination of diagonal and vertical/horizontal line
                if (colDif!=rowDif && colDif>0 && rowDif>0){
                    var minimum = Math.min(colDif,rowDif);
                    var maximum = Math.max(colDif,rowDif);
                    var squaredTileSize = Math.pow(this.squareSize,2);
                    var diagonal = minimum * Math.sqrt(squaredTileSize+squaredTileSize);
                    var straight = (maximum-minimum)*this.squareSize;
                    distance=diagonal+straight;
                }

                // put in range tiles in the moveRange variable to return:
                if (distance <= (player.movementAmount*1.5)){
                    //set the distance of the square:
                    allSquares[i].currentDistance = +distance.toFixed(1);
                    if (!allSquares[i].obstructed && !allSquares[i].fogged){
                        moveRange.push(allSquares[i]);
                    }
                }
            }
        }

        return moveRange;
    }
    getDifference(num1, num2){
    return (num1 > num2)? num1-num2 : num2-num1
  }
    showPlayerDot(){
        $("#playerDot"+this.selectedPlayer.id).
        fadeOut(400).fadeIn(400).
        fadeOut(400).fadeIn(400);
    }
    setSquareTextSize(){
        $(".squareTexts").css({"font-size":"1vw"});
        if (this.heightWidth > 16) {
            $(".squareTexts").css({"font-size":"0.9vw"});
            if (this.heightWidth > 18) {
                $(".squareTexts").css({"font-size":"0.8vw"});
                if (this.heightWidth > 20) {
                    $(".squareTexts").css({"font-size":"0.7vw"});
                    if (this.heightWidth > 22) {
                        $(".squareTexts").css({"font-size":"0.6vw"});
                    }
                }
            }
        }
    }
    showMessage(message:string, color:string, duration:number){

        var mapHeightPX = $(".mapcontainer").css('height');
        var mapHeight = +mapHeightPX.split("px")[0];
        var mapOffset = $(".mapcontainer").offset();
        var mapPos = $(".mapcontainer").position();

        $('#infoBox').html(message);
        var infoBoxHeight = +$("#infoBox").css('height').split("px")[0];
        var infoBoxWidth = +$("#infoBox").css('width').split("px")[0];
        $("#infoBox").css({
            "top":mapOffset.top+((mapHeight/2)-(infoBoxHeight/2)),
            "left":mapOffset.left+((mapHeight/2)-(infoBoxWidth/2)),
            "color":color
        });
        $("#hiddenClose").css({
            "top":mapOffset.top+((mapHeight/2)-(infoBoxHeight/2)),
            "left":mapOffset.left+((mapHeight/2)+(infoBoxWidth/2))-20
        });

        $('#infoBox').fadeIn(500).delay(duration).fadeOut(500);
        $('#hiddenClose').fadeIn(500).delay(duration).fadeOut(500);
    }
    showInfoBox(message:string, color:string){
        var mapHeightPX = $(".mapcontainer").css('height');
        var mapHeight = +mapHeightPX.split("px")[0];
        var mapOffset = $(".mapcontainer").offset();
        var mapPos = $(".mapcontainer").position();

        $('#infoBox').html(message);
        var infoBoxHeight = +$("#infoBox").css('height').split("px")[0];
        var infoBoxWidth = +$("#infoBox").css('width').split("px")[0];
        $("#infoBox").css({
            "top":mapOffset.top+((mapHeight/2)-(infoBoxHeight/2)),
            "left":mapOffset.left+((mapHeight/2)-(infoBoxWidth/2)),
            "color":color
        });
        $("#hiddenClose").css({
            "top":mapOffset.top+((mapHeight/2)-(infoBoxHeight/2)),
            "left":mapOffset.left+((mapHeight/2)+(infoBoxWidth/2))-20
        });
        $('#infoBox').fadeIn(500);
        $('#hiddenClose').fadeIn(500);
    }
    hideInfoBox(){
        $('#infoBox').fadeOut(300);
        $('#hiddenClose').fadeOut(300);
    }
    attack() {
        this.rangeSquares = new Array();
        this.resetAllDistances();
        this.movementMode = false;
        this.chargeMode = false;

        if(this.selectedPlayer.isSelected ) {
            if(this.selectedPlayer.attacksLeft!=0){
                if (this.dndMap.cutOffMechanic){
                    this.selectedPlayer.attackCutOff(this.dndMap.cutOffNumber);
                }
                else{
                    this.selectedPlayer.attack()
                }

                this.showMessage(this.selectedPlayer.name + " attacks!", "black", 500);

            }
            else {
                this.showMessage(this.selectedPlayer.name + " can't attack.", "red", 500);
            }
        }

    }
    cast() {
        this.rangeSquares = new Array();
        this.resetAllDistances();
        this.movementMode = false;
        this.chargeMode = false;

        if(this.selectedPlayer.isSelected) {
            if(this.selectedPlayer.spellsLeft!=0){
                if (this.dndMap.cutOffMechanic){
                    this.selectedPlayer.castCutOff(this.dndMap.cutOffNumber);
                }
                else{
                    this.selectedPlayer.cast()
                }

                this.showMessage(this.selectedPlayer.name + " casts a spell!", "black", 500);
            }
            else {
                this.showMessage(this.selectedPlayer.name + " can't cast.", "red", 500);
            }
        }
    }
    moveCharacter() {
        if(this.selectedPlayer.isSelected) {
            this.resetAllDistances();
            this.movementMode = true;
            this.chargeMode = false;
            if ((<KeyboardEvent>window.event).ctrlKey || (<KeyboardEvent>window.event).metaKey){
                this.freeMove=true
            }
            this.showRange(this.selectedPlayer);
            this.selectedSquare = this.getPlayerSquare(this.selectedPlayer);
        }
    }

    disengage() {
        if(this.selectedPlayer.isSelected) {
            if (this.selectedPlayer.movementLeft >= this.selectedPlayer.movementAmount*this.cutOffNumber){
                this.resetAllDistances();
                this.movementMode = true;
                this.disengageMode = true;
                this.showDisengageRange(this.selectedPlayer);
                this.selectedSquare = this.getPlayerSquare(this.selectedPlayer);
            }
            else{
                this.showMessage(this.selectedPlayer.name + " needs half movement amount to disengage.", "red", 1000);
            }
        }
    }

    charge() {
        if(this.selectedPlayer.isSelected) {
            if (this.selectedPlayer.movementLeft == this.selectedPlayer.movementAmount){
                this.resetAllDistances();
                this.movementMode = true;
                this.chargeMode = true;
                this.showChargeRange(this.selectedPlayer);
                this.selectedSquare = this.getPlayerSquare(this.selectedPlayer);
            }
            else{
                this.showMessage(this.selectedPlayer.name + " needs full movement amount to charge.", "red", 1000);
            }
        }
    }
    consume(){
        if(this.selectedPlayer.isSelected) {
            if (this.selectedPlayer.movementLeft >= this.selectedPlayer.movementAmount*this.cutOffNumber){
                this.resetAllDistances();
                this.selectedSquare = this.getPlayerSquare(this.selectedPlayer);
                this.selectedPlayer.halfRoundAction(this.cutOffNumber);
                this.showMessage(this.selectedPlayer.name + " consumes something.", "black", 1000);
            }
            else{
                this.showMessage(this.selectedPlayer.name + " does not have half a round left to consume something.", "red", 1000);
            }
        }
    }
    equip(){
        if(this.selectedPlayer.isSelected) {
            if (this.selectedPlayer.movementLeft >= this.selectedPlayer.movementAmount*this.cutOffNumber){
                this.resetAllDistances();
                this.selectedSquare = this.getPlayerSquare(this.selectedPlayer);
                this.selectedPlayer.halfRoundAction(this.cutOffNumber);
                this.showMessage(this.selectedPlayer.name + " (un)equips something.", "black", 1000);
            }
            else{
                this.showMessage(this.selectedPlayer.name + " does not have half a round left to (un)equip something.", "red", 1000);
            }
        }
    }
    fullRoundAction(){
        console.log("cutOffNumber " + this.cutOffNumber);
        if(this.selectedPlayer.isSelected) {
            if (this.selectedPlayer.movementLeft == this.selectedPlayer.movementAmount &&
                this.selectedPlayer.attacksLeft == this.selectedPlayer.attacksPerRound &&
                this.selectedPlayer.spellsLeft == this.selectedPlayer.spellsPerRound &&
                this.selectedPlayer.actionPoints == 100){ // char has not done anything yet
                this.resetAllDistances();
                this.selectedSquare = this.getPlayerSquare(this.selectedPlayer);
                this.selectedPlayer.useFullRound();
                this.showMessage(this.selectedPlayer.name + " performs a full round action.", "black", 1000);
            }
            else{
                this.showMessage(this.selectedPlayer.name + " does not have a full round left to perform a full round action.", "red", 1000);
            }
        }
    }
    halfRoundAttack(){
        if(this.selectedPlayer.isSelected) {
            if (this.selectedPlayer.actions[0] != "attack" &&
            this.selectedPlayer.movementLeft >= this.selectedPlayer.movementAmount*this.cutOffNumber){
                this.resetAllDistances();
                this.selectedSquare = this.getPlayerSquare(this.selectedPlayer);
                this.selectedPlayer.halfRoundAttack(this.cutOffNumber);
                this.showMessage(this.selectedPlayer.name + " performs a half round attack.", "black", 1000);
            }
            else{
                this.showMessage(this.selectedPlayer.name + " does not have half a round or full attacks left to perform a half round attack", "red", 1000);
            }
        }
    }
    addZonePlayer(){
        this.rangeSquares = new Array();
        this.resetAllDistances();
        this.movementMode = false;
        this.chargeMode = false;
        if(this.selectedPlayer.isSelected) {
            var label = this.addZonePlayerForm.get('zoneLabel').value;
            var radius = this.addZonePlayerForm.get('zoneRadius').value;
            var duration = this.addZonePlayerForm.get('zoneDuration').value;
            var zoneObject:any ={};

            if (duration==0){
                zoneObject ={
                    id: this.zoneIdGenerator--,
                    label:label,
                    radius:radius,
                    duration:-1
                };
            }
            else {
                zoneObject ={
                    id: this.zoneIdGenerator--,
                    label:label,
                    radius:radius,
                    duration:duration
                };
            }
            this.selectedPlayer.zones.push(zoneObject);

            this.mapShareService.setPlayerZones(); // sets the zone sizes in the correct position
        }
    }

    setCharacterValues(){
        this.createPlayerForm.get('playerName').setValue(this.selectedPlayer.name);
        this.createPlayerForm.get('playerColor').setValue(this.selectedPlayer.color);
        this.createPlayerForm.get('playerInitiative').setValue(this.selectedPlayer.initiative);
        this.createPlayerForm.get('playerMovement').setValue(this.selectedPlayer.movementAmount);
        this.createPlayerForm.get('playerAttacks').setValue(this.selectedPlayer.attacksPerRound);
        this.createPlayerForm.get('playerSpells').setValue(this.selectedPlayer.spellsPerRound);
    }
    editCharacter(){
        this.rangeSquares = new Array();
        this.resetAllDistances();
        this.movementMode = false;
        this.chargeMode = false;

        this.selectedPlayer.name = this.createPlayerForm.get('playerName').value;
        this.selectedPlayer.color = this.createPlayerForm.get('playerColor').value;
        this.selectedPlayer.initiative = this.createPlayerForm.get('playerInitiative').value;
        this.selectedPlayer.actionPoints = 100;
        this.selectedPlayer.movementAmount = this.createPlayerForm.get('playerMovement').value;
        this.selectedPlayer.movementLeft = this.createPlayerForm.get('playerMovement').value;
        this.selectedPlayer.attacksPerRound = this.createPlayerForm.get('playerAttacks').value;
        this.selectedPlayer.attacksLeft = this.createPlayerForm.get('playerAttacks').value;
        this.selectedPlayer.spellsPerRound = this.createPlayerForm.get('playerSpells').value;
        this.selectedPlayer.spellsLeft = this.createPlayerForm.get('playerSpells').value;
        this.selectedPlayer.setActionPointCosts();
        this.orderCharacters();

    }
    deleteObject() {
        this.rangeSquares = new Array();
        this.resetAllDistances();
        this.movementMode = false;
        this.chargeMode = false;

        if(this.selectedPlayer.isSelected) {
            this.selectedSquare = this.getPlayerSquare(this.selectedPlayer);
            var index = this.allCharacters.indexOf(this.selectedPlayer);
            this.allCharacters.splice(index, 1);
            this.selectedSquare.removePhysical(this.selectedPlayer.id);
        }
    }

    setPlayerIconUrl(player:Player){
      //   var reader = new FileReader();
      //   reader.onload = ()=>{
      //       player.playerIconUrl = reader.result;
      //   };
      //   reader.readAsDataURL(player.playerIcon);

      player.playerIconUrl = this.iconUrl;
      //console.log("players iconUrl set to: " + player.playerIconUrl);
    }

    createImageForm() {
        this.imageForm = this.fb.group({
          image: null
        });
      }

    // TODO try sending it as FormData: https://nehalist.io/uploading-files-in-angular2/
    onFileChanged(event) {
        // This grabs the file contents when the file changes
        this.selectedFile = event.target.files[0];

        // Instantiate FileReader
        var reader = new FileReader();
        reader.onload = ()=> {
            this.iconUrl = reader.result;
            // Update the output to include the <img> tag with the data URL as the source
            $("#showPic").html("<img width='100' src='"+this.iconUrl+"' />");
            this.fileName = this.selectedFile.name;
            this.fileType = this.selectedFile.type;
            this.fileValue = reader.result.split(',')[1];
            console.log(this.fileName);
            console.log(this.fileType);
            //console.log(this.fileValue);
        };
        // Produce a data URL (base64 encoded string of the data in the file)
        // We are retrieving the first file from the FileList object
        reader.readAsDataURL(this.selectedFile);

        //might only need the following:
        if(event.target.files.length > 0) {
       let file = event.target.files[0];
       this.imageForm.get('image').setValue(file);
     }
    }

    private prepareSave(): any {
        let input = new FormData();
        input.append('image', this.imageForm.get('image').value);
        return input;
    }

    fogTiles(){
        var fogged = true;
        if (this.selectedSquares[0].fogged) {
            // make all squares transparent
            fogged = false;
        }
        if ((<KeyboardEvent>window.event).ctrlKey || (<KeyboardEvent>window.event).metaKey){
            this.selectedSquares = this.dndMap.squares;
        }
        for (var i = 0 ; i < this.selectedSquares.length ; i++){
            this.selectedSquares[i].fogged = fogged;
        }

        this.selectedSquares = new Array();

        // make all squares set their styles:
        this.setSquareStyles();
        this.clearAllFields();
    }
    obstructSelection(){
        for (var i = 0 ; i < this.selectedSquares.length ; i++){
            if (this.selectedSquares[i].obstructed ==false){
                this.selectedSquares[i].obstructed = true;
            }
            else{
                this.selectedSquares[i].obstructed = false;
            }
        }
        this.selectedSquares = new Array();

        // make all squares set their styles:
        this.setSquareStyles();
    }

    addPlayer(){
        const name = this.createPlayerForm.get('playerName').value;
        const color = this.createPlayerForm.get('playerColor').value;
        const initiative = +this.createPlayerForm.get('playerInitiative').value;
        const movement = +this.createPlayerForm.get('playerMovement').value;
        const attacks = +this.createPlayerForm.get('playerAttacks').value;
        const spells = +this.createPlayerForm.get('playerSpells').value;
        const imageFormModel = this.prepareSave();
        if (this.selectedSquares.length>1){
            for (var i = 0 ; i < this.selectedSquares.length ; i++){
                var player:Player = new Player(this.playerIdGenerator--, this.playerIdCreator++, name+" "+i, 100, movement, initiative, attacks, spells, "physical", color, this.selectedSquares[i].mapSquareId, this.selectedSquares[i].mapHeightWidth, this.selectedSquares[i].mapCoordinate, this.selectedFile, this.selectedSquares[i].mapId);
                if (player.playerIcon!=null){
                    this.setPlayerIconUrl(player);
                }
                this.selectedSquares[i].addPhysical(player);
                this.playerAdded(player);
            }
            this.selectedSquares = new Array();
            this.setSquareStyles();
        }
        else{
            var player:Player = new Player(this.playerIdGenerator--, this.playerIdCreator++, name, 100, movement, initiative, attacks, spells, "physical", color, this.selectedSquares[0].mapSquareId, this.selectedSquares[0].mapHeightWidth, this.selectedSquares[0].mapCoordinate, this.selectedFile, this.selectedSquares[0].mapId);
            if (player.playerIcon!=null){
                this.setPlayerIconUrl(player);
            }
            this.selectedSquares[0].addPhysical(player);
            this.playerAdded(player);
        }

        this.clearAllFields();
    }

    loadAllCharacters(){
        this.allLoadedCharacters = new Array();
        this.dndMapService.findAllPlayers().subscribe(allPlayers => {
            for (var i = 0 ; i < allPlayers.length ; i++){
                this.allLoadedCharacters.push(allPlayers[i]);

                // remove chars from the list that are already in the map:
                for (var j = 0 ; j < this.allCharacters.length ; j++){
                    if (this.allCharacters[j].id == allPlayers[i]["id"]){
                        var index = this.allLoadedCharacters.indexOf(allPlayers[i]);
                        this.allLoadedCharacters.splice(index, 1);
                    }
                }

                //in the last iteration:
                if (i==allPlayers.length-1){
                    this.charsLoaded=true;
                }
            }
        });
    }

    selectCharacter(char){
        // create a player for each retreived player
        var newChar = new Player(
            char["id"],
            char["playerSquareId"],
            char["name"],
            char["actionPoints"],
            char["movementAmount"],
            char["initiative"],
            char["attacksPerRound"],
            char["spellsPerRound"],
            char["type"],
            char["color"],
            char["mapSquareId"],
            char["mapHeightWidth"],
            char["squareMapCoordinate"],
            char["playerIcon"],
            char["mapId"]
        )
        newChar.realSquareId = char["realSquareId"];
        newChar.isSelected = char["isSelected"];
        newChar.movementLeft = char["movementLeft"];
        newChar.attacksLeft = char["attacksLeft"];
        newChar.spellsLeft = char["spellsLeft"];

        // decimals devided by 100, because they get saved in database as integers*100
        newChar.movementAmount = newChar.movementAmount/100;
        newChar.movementLeft = newChar.movementLeft/100;
        newChar.actionPoints = newChar.actionPoints/100;
        newChar.setActionPointCosts();

        // newChar.playerIconUrl = allPlayers[i]["playerIconUrl"];

        //console.log("players iconUrl is: " + newChar.playerIconUrl);
        //
        this.selectedLoadCharacter = newChar;
        this.getCharZoneById(this.selectedLoadCharacter.id);
    }

    getCharZoneById(id:number){
        this.dndMapService.getAllCharZonesById(id).subscribe(allZones => {
            // create a zone for each retreived zone
            for (var i = 0 ; i < allZones.length ; i++){
                var newZone = {
                    id: allZones[i]["id"],
                    realCharId: allZones[i]["realCharId"],
                    mapId: allZones[i]["mapId"],
                    label:allZones[i]["label"],
                    radius:allZones[i]["radius"],
                    duration:allZones[i]["duration"]
                };

                this.selectedLoadCharacter.zones.push(newZone);
            }
        });
    }

    addExistingCharacter(){
        this.selectedSquares[0].addPhysical(this.selectedLoadCharacter);
        this.playerAdded(this.selectedLoadCharacter);
        this.mapShareService.setPlayerZones();
        this.selectedLoadCharacter=null;
        this.allLoadedCharacters=new Array();
    }
    clearAllFields(){
        this.createPlayerForm.get('playerName').setValue("");
        this.createPlayerForm.get('playerInitiative').setValue(15);
        this.createPlayerForm.get('playerMovement').setValue(15);
        this.createPlayerForm.get('playerAttacks').setValue(1);
        this.createPlayerForm.get('playerSpells').setValue(1);

        this.createItemForm.get('itemName').setValue("");
        this.createItemForm.get('itemAmount').setValue(1);

        this.addZonePlayerForm.get('zoneRadius').setValue(0);
        this.addZonePlayerForm.get('zoneDuration').setValue(1);
        this.addZoneTileForm.get('zoneRadius').setValue(10);
        this.addZoneTileForm.get('zoneDuration').setValue(1);
        this.addZoneTileForm.get('tileZoneColor').setValue("#ffa100");

        this.colorTileForm.get('selectAll').setValue(false);
        this.colorTileForm.get('tileColor').setValue("#000000");
        this.colorTileForm.get('obstructTile').setValue(false);

    }
    nextTurn() {
        for (var i = 0 ; i < this.allCharacters.length ; i++){
            this.allCharacters[i].resetAllStats();
            this.allCharacters[i].reduceDurations();
        }
        for (var i = 0 ; i < this.dndMap.squares.length ; i++){
            this.dndMap.squares[i].reduceDurations();
        }
        this.showMessage("New Turn!", "black", 500);
    }

    addZoneTile(){
        var label = this.addZoneTileForm.get('zoneLabel').value;
        var radius = this.addZoneTileForm.get('zoneRadius').value;
        var duration = this.addZoneTileForm.get('zoneDuration').value;
        var color = this.addZoneTileForm.get('tileZoneColor').value;

        var zoneObject:any ={};

        if (duration==0){
            zoneObject ={
                id: this.zoneIdGenerator--,
                label:label,
                radius:radius,
                color: color,
                duration:-1
            };
        }
        else {
            zoneObject ={
                id: this.zoneIdGenerator--,
                label:label,
                radius:radius,
                color: color,
                duration:duration
            };
        }

        for (var i = 0 ; i < this.selectedSquares.length ; i++){
            this.selectedSquares[i].zones.push(zoneObject);
        }

        this.mapShareService.setTileZones(); // sets the zone sizes in the correct position
    }

    public receiveMoveMode($event){
        this.movementMode = $event;
    }
    public receiveFreeMove($event){
        this.freeMove = $event;
    }
    public receiveDisengageMode($event){
        this.disengageMode = $event;
    }
    public receiveChargeMode($event){
        this.chargeMode = $event;
    }
    public receiveRangeSquares($event){
        this.rangeSquares = $event;
        this.rangeCutOffSquares = new Array();
    }

    public playerAdded(player){
        this.allCharacters.push(player);
        this.orderCharacters();
    }
    orderCharacters(){
        this.allCharacters.sort(function(a, b) {
            return b.initiative - a.initiative || b.movementAmount - a.movementAmount;
        });
    }
    public receiveSelectedPlayer(player){
            this.clickPlayer(player);
    }
    public receiveSelectedSquares($event){
        this.selectedSquares = this.removeDuplicates($event);
    }

    private removeDuplicates(arr){
        let unique_array = arr.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });
        return unique_array;
    }
    public receiveSetStyles($event){
        this.setStyles = $event;
    }
    private setSquareStyles(){
        if (this.setStyles){
            this.setStyles=false;
        }
        else{
            this.setStyles=true;
        }
    }
    public receiveDeselecting($event){
        this.deselecting = $event;
    }

    public receiveSelecting($event){
        this.selecting = $event;
    }

    resetSelectedSquares(){
        if (!this.multiSelect){
            this.selectedSquares = new Array();
        }
    }


    private setRows(){
        this.rowArray = new Array();
        this.columnArray = new Array();
        for (var i = 0 ; i< this.heightWidth ; i++){
            this.rowArray.push(i+1);
            this.rowArrayLetters.push(this.setRowIndexLetter(i+1));
            this.columnArray.push(i+1);
        }

        var rowHeight = $(".rowLetter").css("height");
        $(".rowLetter").css({"line-height":rowHeight});
    }

    selectSaveMapInput(name){
        this.dndMap.id = 0;
        this.dndMap.name = this.saveForm.get('mapName').value;
        this.dndMap.name = name;
        this.mapExists=false;

        // check if name already exists and if so, overwrite that map instead of creating a new one. The alert will warn the user.
        for (var i = 0 ; i < this.allLoadedMapNames.length ; i++){
            var existingId = +this.allLoadedMapNames[i].split(": ")[0];
            var existingName = this.allLoadedMapNames[i].split(": ")[1];
            if (this.dndMap.name === existingName){
                this.dndMap.id = existingId;
                this.mapExists=true;
            }
        }
    }

    selectSaveMapClick(idname){
        this.dndMap.id = +idname.split(": ")[0];
        this.dndMap.name = idname.split(": ")[1];
        this.saveForm.get('mapName').setValue(this.dndMap.name);

        // check if name already exists and if so, overwrite that map instead of creating a new one. The alert will warn the user.
        for (var i = 0 ; i < this.allLoadedMapNames.length ; i++){
            var existingId = +this.allLoadedMapNames[i].split(": ")[0];
            var existingName = this.allLoadedMapNames[i].split(": ")[1];
            if (this.dndMap.name === existingName){
                this.dndMap.id = existingId;
                this.mapExists=true;
            }
        }

    }
    public saveMap() {
        // var date = new Date().toLocaleDateString();
        // var time = new Date().toLocaleTimeString();
        this.showInfoBox("Saving...", "black");

        this.saveMapWithSquares();
    }

    private saveMapWithSquares(){
        this.resultCounter=0;
        //Save the map
        this.dndMapService.saveMap(this.dndMap).subscribe((mapId: number) => {
            this.dndMap.id = mapId;
            var mapSquares = this.dndMap.squares;

            // give all squares the right mapId
            for (var h = 0 ; h<mapSquares.length ; h++){
                mapSquares[h].mapId = mapId;
            }
            // save all the squares at once
            this.dndMapService.saveSquares(mapSquares).subscribe((result:number[]) => {
                // get a list objects back. These objects contain a squares real database id and the squares mapSquareId. Use the mapSquareId to find the right squre and give it it's real database id (so it can be overwritten)
                for (var i = 0 ; i<result.length ; i++){
                    this.resultCounter++;
                    for (var j = 0 ; j<mapSquares.length ; j++){
                        if (mapSquares[j].mapSquareId == result[i]["mapSquareId"]){
                            mapSquares[j].id = result[i]["id"];
                            if (this.resultCounter == this.dndMap.squares.length){ //save players only when all squares have gotten their database Id
                                this.saveZonesOnSquares();
                                this.savePlayersOnSquares();
                                console.log("done saving everything");
                                this.showMessage("Saving... Succes!", "black", 1000);
                            }
                        }
                    }
                }
            });
        }); //saveMap end
    }

    private saveZonesOnSquares(){

        var mapSquares = this.dndMap.squares;
        var zones = new Array();
        // get all the tileZones in the map:
        for (var i = 0 ; i<mapSquares.length ; i++){
            var square = mapSquares[i];
            if (square.zones.length!=0){
                for (var h = 0 ; h<square.zones.length ; h++){
                    //give zone the square database Id and database mapId so they can be retrieved on the right square when loading:
                    square.zones[h].realSquareId = square.id;
                    square.zones[h].mapId = square.mapId;
                    zones.push(square.zones[h]);
                }
            }
        }
        if (zones.length!=0){
            // save all zones at once:
            this.dndMapService.saveTileZones(zones).subscribe((zoneResult:number[]) => {
                // give each zone its real database id:
                for (var j = 0 ; j<zones.length ; j++){
                    for (var k = 0 ; k<zones.length ; k++){
                        if (zones[j].realSquareId == zoneResult[k]["realSquareCharId"]){
                            zones[j].id = zoneResult[k]["id"];
                        }
                    }
                }
            });
        }
    }

    private savePlayersOnSquares(){

        var mapSquares = this.dndMap.squares;
        var players = new Array();
        // get all the players in the map:
        for (var i = 0 ; i<mapSquares.length ; i++){
            var square = mapSquares[i];
            if (square.players.length!=0){
                for (var h = 0 ; h<square.players.length ; h++){
                    //give player the square database Id and database mapId so they can be retrieved on the right square when loading:
                    square.players[h].realSquareId = square.id;
                    square.players[h].mapId = square.mapId;

                    // decimls times 100, because they get saved in database as integers
                    square.players[h].movementAmount = square.players[h].movementAmount*100;
                    square.players[h].movementLeft = square.players[h].movementLeft*100;
                    square.players[h].actionPoints = square.players[h].actionPoints*100;
                    players.push(square.players[h]);
                }
            }
        }
        if (players.length!=0){
            this.resultCounter=0;
            // save all players at once:
            this.dndMapService.savePlayers(players).subscribe((playerResult:number[]) => {
                // give each player its real database id:
                for (var j = 0 ; j<players.length ; j++){
                    this.resultCounter++;
                    for (var k = 0 ; k<players.length ; k++){
                        if (players[j].playerSquareId == playerResult[k]["playerSquareId"]){
                            players[j].id = playerResult[k]["id"];
                            if (this.resultCounter == players.length){ //save zones only when all players have gotten their database Id
                                this.saveZonesOnPlayers();

                                for (var h = 0 ; h<players.length ; h++){
                                    // set back decimals that were multiplied by 100 to store in db.:
                                    players[h].movementAmount = players[h].movementAmount/100;
                                    players[h].movementLeft = players[h].movementLeft/100;
                                    players[h].actionPoints = players[h].actionPoints/100;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    private saveZonesOnPlayers(){

        var allCharacters = this.allCharacters;
        var zones = new Array();
        // get all the playerZones in the map:
        for (var i = 0 ; i<allCharacters.length ; i++){
            var char = allCharacters[i];
            if (char.zones.length!=0){
                for (var h = 0 ; h<char.zones.length ; h++){
                    //give zone the player database Id and database mapId so they can be retrieved on the right player when loading:
                    char.zones[h].realCharId = char.id;
                    char.zones[h].mapId = char.mapId;
                    zones.push(char.zones[h]);
                }
            }
        }

        if (zones.length!=0){
            // save all zones at once:
            this.dndMapService.saveCharZones(zones).subscribe((zoneResult:number[]) => {
                // give each zone its real database id:
                for (var j = 0 ; j<zones.length ; j++){
                    for (var k = 0 ; k<zones.length ; k++){
                        if (zones[j].realCharId == zoneResult[k]["realSquareCharId"]){
                            zones[j].id = zoneResult[k]["id"];
                        }
                    }
                }
            });
        }
    }


    deleteMap(){

        this.dndMapService.deleteMapById(this.selectedLoadMap).subscribe((mapName:string) => {
            console.log("Map " + mapName["name"] + " was permanently removed from the database.");
            this.loadMap();
        });
    }
    loadMap(){
        this.saveForm.get('mapName').setValue("");
        this.mapExists=false;
        this.allLoadedMapIds = new Array();
        this.allLoadedMapNames = new Array();
        this.dndMapService.findAllMaps().subscribe(allMaps => {
            this.allLoadedMapsResult = allMaps;
            for (var i=0 ; i< allMaps.length ; i++){
                this.allLoadedMapIds.push(allMaps[i]["id"]);
                this.allLoadedMapNames.push(allMaps[i]["id"] + ": " + allMaps[i]["name"]);
            }
            this.mapsLoaded=true;

        });
    }
    selectLoadMap(idname:string){
        var id = +idname.split(": ")[0];
        this.selectedLoadMap = id;
        this.selectedLoadMapname = idname.split(": ")[1];
    }

    loadSelectedMap(){
        this.showInfoBox("Loading...", "black");
        for (var i=0 ; i< this.allLoadedMapsResult.length ; i++){
            if (this.selectedLoadMap == this.allLoadedMapsResult[i]["id"]){
                this.heightWidth = this.allLoadedMapsResult[i]["heightWidth"];
                var image = this.allLoadedMapsResult[i]["imageUrl"];
                var name = this.allLoadedMapsResult[i]["name"];
                var cutOffMechanic = this.allLoadedMapsResult[i]["cutOffMechanic"];
                var cutOffNumber = this.allLoadedMapsResult[i]["cutOffNumber"];

                this.dndMap = new DnDMap(this.selectedLoadMap,this.heightWidth, 5);
                this.dndMap.name = name;
                this.dndMap.cutOffMechanic = cutOffMechanic
                this.dndMap.cutOffNumber = cutOffNumber
                this.cutOffMechanic = cutOffMechanic
                this.cutOffNumber = cutOffNumber
                this.mapForm.get('heightwidth').setValue(this.heightWidth);
                this.mapForm.get('moveCutCheck').setValue(cutOffMechanic);
                this.mapForm.get('moveCutRange').setValue(cutOffNumber*100);
                this.mapForm.get('yards').setValue(5);
                this.mapForm.get('imageUrl').setValue(image);
                this.uploadImage();
                //squaresize moet in dndMap opgeslagen
            }
        }

        this.getMapSquares();
    }

    getMapSquares(){
        this.dndMapService.getMapSquares(this.selectedLoadMap).subscribe(mapSquares => {
            var allMapSquares: Square[] = new Array();
            for (var i = 0 ; i < mapSquares.length ; i++){
                var theSquare = new Square(
                    mapSquares[i]["id"],
                    mapSquares[i]["mapSquareId"],
                    mapSquares[i]["squareSize"],
                    mapSquares[i]["squareHeightWidth"],
                    mapSquares[i]["mapHeightWidth"]
                )
                theSquare.players=new Array();
                theSquare.inRange= false;
                theSquare.mapId= mapSquares[i]["mapId"];
                theSquare.mapCoordinate= mapSquares[i]["mapCoordinate"];
                theSquare.numberofPlayers= mapSquares[i]["numberofPlayers"];
                theSquare.obstructed= mapSquares[i]["obstructed"];
                theSquare.hidden= mapSquares[i]["hidden"];
                theSquare.fogged= mapSquares[i]["fogged"];

                allMapSquares.push(theSquare);
            }

            allMapSquares = allMapSquares.sort((a, b) => a.mapSquareId < b.mapSquareId ? -1 : a.mapSquareId > b.mapSquareId ? 1 : 0);

            this.dndMap.squares = allMapSquares;
            this.mapForm.get('yards').setValue(this.dndMap.squares[0].squareSize);
            this.setSquareSize();
            this.setRows();
            this.setSquareStyles();

            this.getTileZones();
            this.getPlayers();

            /*for (var i = 0 ; i < this.dndMap.squares.length ; i++){
                if(this.dndMap.squares[i].numberofPlayers>0){
                    //TODO forloop to go through all players
                    var sqId = this.dndMap.squares[i].id;
                    this.findPlayerByRealSquareId(sqId);
                }
            }*/
            this.showMessage("Loading... Succes!", "black", 1000);
        });
    }

    getTileZones(){
        this.dndMapService.getAllSquareZones(this.selectedLoadMap).subscribe(allZones => {
            // create a zone for each retreived zone
            for (var i = 0 ; i < allZones.length ; i++){
                var newZone = {
                    id: allZones[i]["id"],
                    realSquareId: allZones[i]["realSquareId"],
                    mapId: allZones[i]["mapId"],
                    label:allZones[i]["label"],
                    color:allZones[i]["color"],
                    radius:allZones[i]["radius"],
                    duration:allZones[i]["duration"]
                };

                // get the right square, put the zone in that square's zones-list
                var allSquares = this.dndMap.squares;
                for (var j = 0 ; j < allSquares.length ; j++){
                    if (newZone.realSquareId == allSquares[j].id){
                        allSquares[j].zones.push(newZone);
                        this.mapShareService.setTileZones();
                    }
                }
            }
        });
    }

    getPlayers(){
        this.allCharacters = new Array();
        this.dndMapService.getAllPlayers(this.selectedLoadMap).subscribe(allPlayers => {
            // create a player for each retreived player
            for (var i = 0 ; i < allPlayers.length ; i++){
                var newPlayer = new Player(
                    allPlayers[i]["id"],
                    allPlayers[i]["playerSquareId"],
                    allPlayers[i]["name"],
                    allPlayers[i]["actionPoints"],
                    allPlayers[i]["movementAmount"],
                    allPlayers[i]["initiative"],
                    allPlayers[i]["attacksPerRound"],
                    allPlayers[i]["spellsPerRound"],
                    allPlayers[i]["type"],
                    allPlayers[i]["color"],
                    allPlayers[i]["mapSquareId"],
                    allPlayers[i]["mapHeightWidth"],
                    allPlayers[i]["squareMapCoordinate"],
                    allPlayers[i]["playerIcon"],
                    allPlayers[i]["mapId"]
                )
                newPlayer.realSquareId = allPlayers[i]["realSquareId"];
                newPlayer.isSelected = allPlayers[i]["isSelected"];
                newPlayer.movementLeft = allPlayers[i]["movementLeft"];
                newPlayer.attacksLeft = allPlayers[i]["attacksLeft"];
                newPlayer.spellsLeft = allPlayers[i]["spellsLeft"];

                // decimals devided by 100, because they get saved in database as integers*100
                newPlayer.movementAmount = newPlayer.movementAmount/100;
                newPlayer.movementLeft = newPlayer.movementLeft/100;
                newPlayer.actionPoints = newPlayer.actionPoints/100;
                newPlayer.setActionPointCosts();

                // newPlayer.playerIconUrl = allPlayers[i]["playerIconUrl"];

                //console.log("players iconUrl is: " + newPlayer.playerIconUrl);

                // get the right square, put the player in that square's players-list
                var allSquares = this.dndMap.squares;
                for (var j = 0 ; j < allSquares.length ; j++){
                    if (newPlayer.squareMapCoordinate == allSquares[j].mapCoordinate){
                        allSquares[j].addPhysical(newPlayer);
                    }
                }
                this.allCharacters.push(newPlayer);
            }
            this.rangeSquares = new Array();
            this.rangeCutOffSquares = new Array();
            this.orderCharacters();
            this.getCharZones();
        });
    }


    getCharZones(){
        this.dndMapService.getAllCharZones(this.selectedLoadMap).subscribe(allZones => {
            // create a zone for each retreived zone
            for (var i = 0 ; i < allZones.length ; i++){
                var newZone = {
                    id: allZones[i]["id"],
                    realCharId: allZones[i]["realCharId"],
                    mapId: allZones[i]["mapId"],
                    label:allZones[i]["label"],
                    radius:allZones[i]["radius"],
                    duration:allZones[i]["duration"]
                };

                // get the right player, put the zone in that player's zones-list
                var allCharacters = this.allCharacters;
                for (var j = 0 ; j < allCharacters.length ; j++){
                    if (newZone.realCharId == allCharacters[j].id){
                        allCharacters[j].zones.push(newZone);
                        this.mapShareService.setPlayerZones();
                    }
                }
            }
        });
    }

    findPlayerByRealSquareId(sqId:number){
        this.dndMapService.findPlayerByRealSquareId(sqId).subscribe(resultPlayer => {
            var player:Player = new Player(
                resultPlayer["id"],
                resultPlayer["playerSquareId"],
                resultPlayer["name"],
                resultPlayer["actionPoints"],
                resultPlayer["movementAmount"],
                resultPlayer["initiative"],
                resultPlayer["attacksPerRound"],
                resultPlayer["spellsPerRound"],
                resultPlayer["type"],
                resultPlayer["color"],
                resultPlayer["mapSquareId"],
                resultPlayer["mapHeightWidth"],
                resultPlayer["squareMapCoordinate"],
                resultPlayer["playerIcon"],
                resultPlayer["mapId"]
            );
            player.realSquareId = resultPlayer["realSquareId"];
            player.isSelected = resultPlayer["isSelected"];

            var mapSquares = this.dndMap.squares;
            for (var i = 0 ; i<mapSquares.length ; i++){
                if (mapSquares[i].id == player.realSquareId){
                    mapSquares[i].addPhysical(player);
                    this.rangeSquares = new Array();
                    this.rangeCutOffSquares = new Array();
                }
            }


        });

    }

    private setRowIndexLetter(nr:number){
        switch(nr) {
            case 1: {
                return "A";
            }
            case 2: {
                return "B";
            }
            case 3: {
                return "C";
            }
            case 4: {
                return "D";
            }
            case 5: {
                return "E";
            }
            case 6: {
                return "F";
            }
            case 7: {
                return "G";
            }
            case 8: {
                return "H";
            }
            case 9: {
                return "I";
            }
            case 10: {
                return "J";
            }
            case 11: {
                return "K";
            }
            case 12: {
                return "L";
            }
            case 13: {
                return "M";
            }
            case 14: {
                return "N";
            }
            case 15: {
                return "O";
            }
            case 16: {
                return "P";
            }
            case 17: {
                return "Q";
            }
            case 18: {
                return "R";
            }
            case 19: {
                return "S";
            }
            case 20: {
                return "T";
            }
            case 21: {
                return "U";
            }
            case 22: {
                return "V";
            }
            case 23: {
                return "W";
            }
            case 24: {
                return "X";
            }
            case 25: {
                return "Y";
            }
        }
    }
}
