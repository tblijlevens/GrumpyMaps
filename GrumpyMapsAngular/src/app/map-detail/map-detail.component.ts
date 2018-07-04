//with jQuery
$(document).ready(function() {
    $("#mapSetup").toggle( 1000 );
    $(window).on('resize', function(){
        var mapHeight = $(".mapcontainer").css('height');
        $(".mapcontainer").css({width: mapHeight});
    });
});


import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
//import  $ from 'jquery';
//import $ = require("jquery");
import * as $ from 'jquery';

import { DnDMapService } from '../dn-dmap.service'
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
        feet: new FormControl(),
        imageUrl: new FormControl(),
        gridToggle: new FormControl(),
        obstructToggle: new FormControl(),
        multiSelectToggle: new FormControl()
    });
    saveForm = new FormGroup({
        mapName: new FormControl()
    });

    dndMap: DnDMap;
    mapBackground = {};
    legendSquare = {};
    squareScale: string = '10%';
    heightWidth:number = 10;
    rowArray:number[] = new Array();
    mapsLoaded=false;
    allLoadedMapsResult;
    allLoadedMapIds:number[];
    allLoadedMapNames:string[];
    selectedLoadMap:number;
    selectedLoadMapidname:string;
    resultCounter:number=0;
    obstructionMode:boolean=false;
    movementMode:boolean=false; //received from squaredetail component
    rangeSquares:Square[] = new Array();
    playerToMove:Player;
    squareBorderStyle = {};
    rowStyles = {};
    mapYards:number;
    squareYards:number;
    selectedSquares:Square[] = new Array();
    multiSelect:boolean=false;
    selecting:boolean=false;
    selectedFile: File;

    constructor(private dndMapService: DnDMapService) { }

    ngOnInit() {

        this.dndMap = new DnDMap(0, this.heightWidth, 5); //id zero cannot exist in databse, so it will generate a new unique id)
        this.mapForm.get('heightwidth').setValue(10);
        this.mapForm.get('feet').setValue(5);
        this.mapForm.get('gridToggle').setValue(true);
        this.setRows();
        this.calculateMapYards();
        var mapHeight = $(".mapcontainer").css('height');
        $(".mapcontainer").css({width: mapHeight});
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
        const imageUrl = this.mapForm.get('imageUrl').value;
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
        var squareSize = +this.mapForm.get('feet').value;
        this.dndMap = new DnDMap(0, this.heightWidth, squareSize); //id zero cannot exist in databse, so it will generate a new unique id)
        this.setRows();
        this.calculateMapYards();
    }
    setSquareSize(){
        var squareSize = +this.mapForm.get('feet').value;
        if (!squareSize) {
            squareSize = 3;
            // alert("Square size wasn't set and is now defaulted to 3.");
        }
         var squares = this.dndMap.squares;
        for (var i = 0 ; i < squares.length ; i++){
            squares[i].squareSize = squareSize;
        }
        this.calculateMapYards();

    }

    private calculateMapYards(){
        this.mapYards = +(this.dndMap.squares[0].squareSize*this.heightWidth/3).toFixed(1);
        this.squareYards = +(this.dndMap.squares[0].squareSize/3).toFixed(1);
        this.legendSquare['width'] = this.dndMap.squares[0].squareHeightWidth;
    }

    public setMultiSelect(){
        this.multiSelect = this.mapForm.get('multiSelectToggle').value;
        if (this.multiSelect){
            $("#multiAction").show();
        }
        else {
            $("#multiAction").hide();
        }
    }
    multiAction(){
        for (var i = 0 ; i < this.selectedSquares.length ; i++){
            this.selectedSquares[i].obstructed = true;
        }
        this.selectedSquares = new Array();
        this.mapForm.get('multiSelectToggle').setValue(false);
        this.setMultiSelect();
    }
    public obstructSquares(){
        this.obstructionMode = this.mapForm.get('obstructToggle').value;
    }
    public receiveMoveMode($event){
        this.movementMode = $event;
    }
    public receiveRangeSquares($event){
        var allRangeSquares = $event;
        this.rangeSquares = new Array();
        var allSquares = this.dndMap.squares;
        var selectedSquares:Square[]=new Array();
        var playerToMoveColumn;
        if (this.playerToMove!=null){
            playerToMoveColumn = +this.playerToMove.squareMapCoordinate.split(":")[1];
        }
        for (var i = 0 ; i<allSquares.length ; i++){
            allSquares[i].inRange = false; //first set everything out of range

            for (var j = 0 ; j<allRangeSquares.length ; j++){
                if (allSquares[i].mapSquareId == allRangeSquares[j]){
                    var currentSquareColumn = +allSquares[i].mapCoordinate.split(":")[1];

                    if (!allSquares[i].obstructed && (playerToMoveColumn-currentSquareColumn<=this.playerToMove.movementAmount && playerToMoveColumn-currentSquareColumn>=-this.playerToMove.movementAmount)){ //only add squares if not obstructed AND column number is within movementrange
                        allSquares[i].inRange = true;
                        selectedSquares.push(allSquares[i]);
                    }
                }
            }
        }
        this.rangeSquares = selectedSquares;
    }

    public receivePlayerToMove($event){
        this.playerToMove = $event;
    }

    public receiveSelectedSquare($event){
        this.selectedSquares.push($event);
    }

    public receiveSelecting($event){
        this.selecting = $event;
    }

    resetSelectedSquares(){
        if (!this.multiSelect){
            this.selectedSquares = new Array();
        }
    }
    public hideGrid() {
        var gridToggle = this.mapForm.get('gridToggle').value;
        this.squareBorderStyle= 'dotted 1px rgb(162, 162, 162, 0)';
        if (gridToggle) {
            // grid off
            this.squareBorderStyle = 'dotted 1px rgb(162, 162, 162, 0.7)';
        }
    }

    private setRows(){
        this.rowArray = new Array();
        for (var i = 0 ; i< this.heightWidth ; i++){
            this.rowArray.push(i+1);
        }

        this.rowStyles = {
            'height': this.dndMap.squares[0].squareHeightWidth
        }
    }

    selectSaveMap(idname){
        this.dndMap.id = 0;
        this.dndMap.name = this.saveForm.get('mapName').value;
        if(idname!=0){
            this.dndMap.id = +idname.split(": ")[0];
            this.dndMap.name = idname.split(": ")[1];
            this.saveForm.get('mapName').setValue(this.dndMap.name);
        }

        // check if name already exists and if so, overwrite that map instead of creating a new one. The alert will warn the user.
        for (var i = 0 ; i < this.allLoadedMapNames.length ; i++){
            var existingId = +this.allLoadedMapNames[i].split(": ")[0];
            var existingName = this.allLoadedMapNames[i].split(": ")[1];
            if (this.dndMap.name === existingName){
                this.dndMap.id = existingId;
                alert("This will overwrite the existing map '" + this.dndMap.name + "'.");
            }
        }
    }

    public saveMap() {
        // var date = new Date().toLocaleDateString();
        // var time = new Date().toLocaleTimeString();

        $('#saving').fadeIn(500);

        this.saveMapWithSquares();
    }

    private saveMapWithSquares(){
        this.resultCounter=0;
        this.dndMapService.saveMap(this.dndMap).subscribe((mapId: number) => {
            this.dndMap.id = mapId;
            var mapSquares = this.dndMap.squares;


            for (var i = 0 ; i<mapSquares.length ; i++){
                var square = mapSquares[i];
                square.setMapId(this.dndMap.id);
                this.dndMapService.saveSquare(square).subscribe(result => {
                    this.resultCounter++;
                    for (var j = 0 ; j<mapSquares.length ; j++){
                        if (mapSquares[j].mapSquareId == result["mapSquareId"]){
                            mapSquares[j].id = result["id"];
                            if (this.resultCounter == this.dndMap.squares.length){ //save players only when all squares have gotten their database Id
                                this.savePlayersOnSquares();
                                console.log("done saving everything");
                                $('#saving').html("Saving... Succes!").delay( 500 ).fadeOut(2000);
                            }
                        }
                    }
                }); //saveSquare

            }
        }); //saveMap end
    }

    private savePlayersOnSquares(){
        //TODO var mapSquares naar let of const maken

        var mapSquares = this.dndMap.squares;
        for (var i = 0 ; i<mapSquares.length ; i++){
            var square = mapSquares[i];
            var players = square.players;
            for (var j = 0 ; j<players.length ; j++){
                var player = players[j];
                player.realSquareId = square.id; //give player square database Id so they can be retrieved on the right square when loading.
                this.dndMapService.savePlayer(player).subscribe(playerResult => {
                    var mapSquares2 = this.dndMap.squares;
                    for (var k = 0 ; k < mapSquares2.length ; k++){
                        var players2 = mapSquares2[k].players;
                        for (var l = 0 ; l<players2.length ; l++){
                            if (players2[l].playerSquareId == playerResult["playerSquareId"]){
                                players2[l].id = playerResult["id"];
                            }
                        }
                    }
                });
            }
        }
    }

    loadMap(){
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
        this.selectedLoadMapidname = idname;
    }

    loadSelectedMap(){
        for (var i=0 ; i< this.allLoadedMapsResult.length ; i++){
            if (this.selectedLoadMap == this.allLoadedMapsResult[i]["id"]){
                this.heightWidth = this.allLoadedMapsResult[i]["heightWidth"];
                var image = this.allLoadedMapsResult[i]["imageUrl"];
                var name = this.allLoadedMapsResult[i]["name"];

                this.dndMap = new DnDMap(this.selectedLoadMap,this.heightWidth, 5);
                this.dndMap.name = name;
                this.mapForm.get('heightwidth').setValue(this.heightWidth);
                this.mapForm.get('feet').setValue(5);
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

                allMapSquares.push(theSquare);
            }

            allMapSquares = allMapSquares.sort((a, b) => a.mapSquareId < b.mapSquareId ? -1 : a.mapSquareId > b.mapSquareId ? 1 : 0);

            this.dndMap.squares = allMapSquares;
            this.mapForm.get('feet').setValue(this.dndMap.squares[0].squareSize);
            this.setSquareSize();
            this.setRows();


            for (var i = 0 ; i < this.dndMap.squares.length ; i++){
                if(this.dndMap.squares[i].numberofPlayers>0){
                    //TODO forloop to go through all players
                    var sqId = this.dndMap.squares[i].id;
                    this.findPlayerByRealSquareId(sqId);
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
                resultPlayer["attacksPerRound"],
                resultPlayer["spellsPerRound"],
                resultPlayer["type"],
                resultPlayer["color"],
                resultPlayer["mapSquareId"],
                resultPlayer["mapHeightWidth"],
                resultPlayer["squareMapCoordinate"],
                resultPlayer["playerIcon"]
            );
            player.realSquareId = resultPlayer["realSquareId"];
            player.isSelected = resultPlayer["isSelected"];

            var mapSquares = this.dndMap.squares;
            for (var i = 0 ; i<mapSquares.length ; i++){
                if (mapSquares[i].id == player.realSquareId){
                    mapSquares[i].addPhysical(player);
                    this.rangeSquares = new Array();
                }
            }


        });

    }
}
