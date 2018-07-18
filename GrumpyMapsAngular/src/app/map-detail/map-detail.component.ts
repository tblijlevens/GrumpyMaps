$(document).ready(function() {
    $("#mapSetup").toggle( 1000 );

    // responsive sizing on resizing the window (e.g. fullscreen)
    $(window).on('resize', function(){
        var mapHeight = $(".mapcontainer").css('height');
        $(".mapcontainer").css({width: mapHeight});
    });

    //make right mouse click in map not popup the contextmenu
    $( ".mapcontainer" ).contextmenu(function(e) {
        e.preventDefault();
    });
});


import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    selectedPlayer:Player;
    squareBorderStyle = {};
    rowStyles = {};
    mapYards:number;
    squareYards:number;
    multiSelect:boolean=false;
    selecting:boolean=false;
    deselecting:boolean=false;
    selectedSquares:Square[] = new Array();
    selectedSquare:Square;
    selectedFile: File;
    allCharacters:Player[] = new Array();
    setStyles:boolean = false;

    constructor(private dndMapService: DnDMapService, private mapShareService: MapShareService) { }

    ngOnInit() {
        this.loadMap();
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
        var squareSize = +this.mapForm.get('feet').value;
        this.dndMap = new DnDMap(0, this.heightWidth, squareSize); //id zero cannot exist in databse, so it will generate a new unique id)
        var imageUrl = this.mapForm.get('imageUrl').value;
        this.dndMap.setImage(imageUrl);

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
        this.selectedSquares = new Array();
    }


    // public toggleFullScreen() {
    //     $('body').fullscreen();
    //     return false;
    // }

    clickPlayer(player: Player) {
        this.deselectAllCharacters();
        this.setAllActiveColors();
        player.isSelected = true;
        player.setActiveColor();
        this.selectedPlayer = player;
        this.setSelectedSquare();
        this.showRange(player);
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
    setSelectedSquare(){
        var squareId = this.selectedPlayer.squareMapCoordinate;
        var allSquares = this.dndMap.squares;
        for (var i = 0 ; i<allSquares.length ; i++){
            if (allSquares[i].mapCoordinate == squareId){
                this.selectedSquare = allSquares[i];
                this.mapShareService.setSquare(this.selectedSquare);
            }
        }
    }
    showRange(player:Player){
        this.receiveRangeSquares(player.getMoveRange());
    }

    moveCharacter() {
        if(this.selectedPlayer.isSelected) {
            this.movementMode = true;
            this.selectedSquare.removePhysical(this.selectedPlayer.id);
        }
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
        if (this.selectedPlayer!=null){
            playerToMoveColumn = +this.selectedPlayer.squareMapCoordinate.split(":")[1];
        }
        for (var i = 0 ; i<allSquares.length ; i++){
            allSquares[i].inRange = false; //first set everything out of range

            for (var j = 0 ; j<allRangeSquares.length ; j++){
                if (allSquares[i].mapSquareId == allRangeSquares[j]){
                    var currentSquareColumn = +allSquares[i].mapCoordinate.split(":")[1];

                    if (!allSquares[i].obstructed && (playerToMoveColumn-currentSquareColumn<=this.selectedPlayer.movementAmount && playerToMoveColumn-currentSquareColumn>=-this.selectedPlayer.movementAmount)){ //only add squares if not obstructed AND column number is within movementrange
                        allSquares[i].inRange = true;
                        selectedSquares.push(allSquares[i]);
                    }
                }
            }
        }
        this.rangeSquares = selectedSquares;
    }

    public receivePlayerToMove($event){
        this.selectedPlayer = $event;
    }
    public playerAdded($event){
        this.allCharacters.push($event);
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
        $('#saving').html("Saving...");
        $('#saving').fadeIn(500);

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
                                this.savePlayersOnSquares();
                                console.log("done saving everything");
                                $('#saving').html("Saving... Succes!").delay( 500 ).fadeOut(2000);
                            }
                        }
                    }
                }
            });
        }); //saveMap end
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
                    players.push(square.players[h]);
                }
            }
        }
        if (players.length!=0){
            // save all players at once:
            this.dndMapService.savePlayers(players).subscribe((playerResult:number[]) => {
                // give each player its real database id:
                for (var j = 0 ; j<players.length ; j++){
                    console.log(playerResult[j]["playerSquareId"] + " got id: " + playerResult[j]["id"]);
                    for (var k = 0 ; k<players.length ; k++){
                        if (players[j].playerSquareId == playerResult[k]["playerSquareId"]){
                            players[j].id = playerResult[k]["id"];
                        }
                    }
                }
            });
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
        $('#saving').html("Loading...");
        $('#saving').fadeIn(500);
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

            this.getPlayers();

            /*for (var i = 0 ; i < this.dndMap.squares.length ; i++){
                if(this.dndMap.squares[i].numberofPlayers>0){
                    //TODO forloop to go through all players
                    var sqId = this.dndMap.squares[i].id;
                    this.findPlayerByRealSquareId(sqId);
                }
            }*/
            $('#saving').html("Loading... Succes!").delay( 500 ).fadeOut(2000);
        });
    }

    getPlayers(){
        this.dndMapService.getAllPlayers(this.selectedLoadMap).subscribe(allPlayers => {
            // create a player for each retreived player
            for (var i = 0 ; i < allPlayers.length ; i++){
                var newPlayer = new Player(
                    allPlayers[i]["id"],
                    allPlayers[i]["playerSquareId"],
                    allPlayers[i]["name"],
                    allPlayers[i]["actionPoints"],
                    allPlayers[i]["movementAmount"],
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
                }
            }


        });

    }
}
