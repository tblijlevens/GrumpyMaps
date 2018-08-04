$(document).ready(function() {
    $("#mapSetup").toggle( 1000 );

    // responsive sizing on resizing the window (e.g. fullscreen)
    $(window).on('resize', function(){
        // set three column widths:
        var contentWidth = $("#allContent").css('width');
        var mapHeightPX = $(".mapcontainer").css('height');
        var columnWidth = (+contentWidth.split("px")[0]-+mapHeightPX.split("px")[0])/2;
        columnWidth -= 12;
        var columnWidthFirst = columnWidth-35;
        $(".mapcontainer").css({width: mapHeightPX});
        $("#firstColumn").css({width: columnWidthFirst});
        $("#secondColumn").css({width: columnWidth});

        // set setup box width:
        $("#mapSetup").css({width: columnWidth+40});

        // set rowLetters in correct position:
        var rowHeight = $(".rowLetter").css("height");
        $(".rowLetter").css({"line-height":rowHeight});

        // set infoBox to right position
        var mapPos = $(".mapcontainer").offset();
        var mapHeight = +mapHeightPX.split("px")[0];
        var infoBoxHeight = +$("#infoBox").css('height').split("px")[0];
        var infoBoxWidth = +$("#infoBox").css('width').split("px")[0];
        $("#infoBox").css({
            "top":mapPos.top+((mapHeight/2)-(infoBoxHeight/2)),
            "left":mapPos.left+((mapHeight/2)-(infoBoxWidth/2))
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
        imageUrl: new FormControl()
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
        zoneLabel: new FormControl()
    });
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
    rowArray:number[] = new Array();
    rowArrayLetters:string[] = new Array();
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
    playerIdCreator: number = 1;
    playerIdGenerator:number=0;

    constructor(private dndMapService: DnDMapService, private mapShareService: MapShareService, private fb: FormBuilder) {
        this.createImageForm();
    }

    ngOnInit() {
        this.loadMap();
        this.mapForm.get('heightwidth').setValue(10);
        this.mapForm.get('yards').setValue(5);
        this.dndMap = new DnDMap(0, this.heightWidth, this.squareSize); //id zero cannot exist in databse, so it will generate a new unique id)

        this.createPlayerForm.get('playerColor').setValue("#ff0000");
        this.createPlayerForm.get('playerInitiative').setValue(15);
        this.createPlayerForm.get('playerMovement').setValue(15);
        this.createPlayerForm.get('playerAttacks').setValue(1);
        this.createPlayerForm.get('playerSpells').setValue(1);

        this.addZonePlayerForm.get('zoneRadius').setValue(10);
        this.addZonePlayerForm.get('zoneDuration').setValue(1);
        this.addZoneTileForm.get('zoneRadius').setValue(10);
        this.addZoneTileForm.get('zoneDuration').setValue(1);

        this.setRows();
        this.calculateMapFeet();
        this.setSizes();

    }

    setSizes(){
        // set three column widths:
        var contentWidth = $("#allContent").css('width');
        var mapHeightPX = $(".mapcontainer").css('height');
        var columnWidth = (+contentWidth.split("px")[0]-+mapHeightPX.split("px")[0])/2;
        columnWidth -= 12;
        var columnWidthFirst = columnWidth-35;
        $(".mapcontainer").css({width: mapHeightPX});
        $("#firstColumn").css({width: columnWidthFirst});
        $("#secondColumn").css({width: columnWidth});

        // set setup box width:
        $("#mapSetup").css({width: columnWidth+40});

        // set rowLetters in correct position:
        var rowHeight = $(".rowLetter").css("height");
        $(".rowLetter").css({"line-height":rowHeight});

        // set infoBox to right position
        var mapPos = $(".mapcontainer").offset();
        var mapHeight = +mapHeightPX.split("px")[0];
        var infoBoxHeight = +$("#infoBox").css('height').split("px")[0];
        var infoBoxWidth = +$("#infoBox").css('width').split("px")[0];
        $("#infoBox").css({
            "top":mapPos.top+((mapHeight/2)-(infoBoxHeight/2)),
            "left":mapPos.left+((mapHeight/2)-(infoBoxWidth/2))
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
         var squares = this.dndMap.squares;
        for (var i = 0 ; i < squares.length ; i++){
            squares[i].squareSize = this.squareSize;
        }
        this.calculateMapFeet();

    }

    private calculateMapFeet(){
        this.mapFeet = +(this.dndMap.squares[0].squareSize*this.heightWidth*3).toFixed(1);
        this.squareFeet = +(this.dndMap.squares[0].squareSize*3).toFixed(1);
        this.legendSquare['width'] = this.dndMap.squares[0].squareHeightWidth;
    }

    public hideGrid() {
        // var gridToggle = this.mapForm.get('gridToggle').value;
        if(this.showGrid){
            this.showGrid=false;
            this.squareBorderStyle= 'dotted 1px rgb(162, 162, 162, 0)';
            $("#showGrid").css({"box-shadow":"none"})
        }
        else {
            this.showGrid=true;
            this.squareBorderStyle = 'dotted 1px rgb(162, 162, 162, 0.7)';
            $("#showGrid").css({"box-shadow":"0 0 4px 2px #2A74F2"});
        }
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
        this.mapShareService.setTileZones();
    }
    mouseOverMultiSelect(){
        $('#infoBox').css({"color":"black"})
        $('#infoBox').html("Perform an action on multiple tiles at once." );
        $('#infoBox').show();

    }
    mouseOutMultiSelect(){
        $('#infoBox').hide();
    }


    // public toggleFullScreen() {
    //     $('body').fullscreen();
    //     return false;
    // }

    clickPlayer(player: Player) {
        this.resetAllDistances();
        this.deselectAllCharacters();
        this.setAllActiveColors();
        player.isSelected = true;
        player.setActiveColor();
        this.selectedPlayer = player;
        var playerSquare = this.getPlayerSquare();
        this.mapShareService.setSquare(playerSquare); //update active square in squareDetail via mapShareService

        this.selectedSquares = new Array();
        this.showRange(player);

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
    getPlayerSquare(){
        var playerSquare:Square=null;
        for (var i = 0 ; i < this.dndMap.squares.length ; i++){
            if (this.dndMap.squares[i].mapSquareId == this.selectedPlayer.mapSquareId){
                playerSquare = this.dndMap.squares[i];
            }
        }
        return playerSquare;
    }
    showRange(player:Player){
        this.rangeSquares = player.getMoveRange(this.squareSize, this.dndMap.squares);
        this.setSquareTextSize();
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
    attack() {
        if(this.selectedPlayer.isSelected ) {
            if(this.selectedPlayer.attacksLeft!=0){
                this.selectedPlayer.attack()
                $('#infoBox').css({"color":"black"})
                $('#infoBox').html(this.selectedPlayer.name + " attacks!");
                $('#infoBox').fadeIn(500).delay(500).fadeOut(500);

            }
            else {
                $('#infoBox').css({"color":"red"})
                $('#infoBox').html(this.selectedPlayer.name + " can't attack.");
                $('#infoBox').fadeIn(500).delay(500).fadeOut(500);
            }
        }

    }
    cast() {
        if(this.selectedPlayer.isSelected) {
            if(this.selectedPlayer.spellsLeft!=0){
                this.selectedPlayer.cast()
                $('#infoBox').css({"color":"black"})
                $('#infoBox').html(this.selectedPlayer.name + " casts a spell!");
                $('#infoBox').fadeIn(500).delay(500).fadeOut(500);
            }
            else {
                $('#infoBox').css({"color":"red"})
                $('#infoBox').html(this.selectedPlayer.name + " can't cast.");
                $('#infoBox').fadeIn(500).delay(500).fadeOut(500);
            }
        }
    }
    moveCharacter() {
        if(this.selectedPlayer.isSelected) {
            this.movementMode = true;
            this.selectedSquare = this.getPlayerSquare();
            this.selectedSquare.removePhysical(this.selectedPlayer.id);

        }
    }
    addStasis(){

    }
    addZonePlayer(){
        if(this.selectedPlayer.isSelected) {
            var label = this.addZonePlayerForm.get('zoneLabel').value;
            var radius = this.addZonePlayerForm.get('zoneRadius').value;
            var duration = this.addZonePlayerForm.get('zoneDuration').value;
            var zoneObject:any ={};

            if (duration==0){
                zoneObject ={
                    label:label,
                    radius:radius,
                    duration:-1
                };
            }
            else {
                zoneObject ={
                    label:label,
                    radius:radius,
                    duration:duration
                };
            }
            console.log(zoneObject.label);
            this.selectedPlayer.zones.push(zoneObject);

            this.mapShareService.setPlayerZones(); // sets the zone sizes in the correct position
        }
    }

    editCharacter(){

    }
    deleteObject() {
        if(this.selectedPlayer.isSelected) {
            this.selectedSquare = this.getPlayerSquare();
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
        console.log("imageFormModel: " + imageFormModel);
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

    clearAllFields(){
        this.createPlayerForm.get('playerName').setValue("");
        this.createPlayerForm.get('playerInitiative').setValue(15);
        this.createPlayerForm.get('playerMovement').setValue(15);
        this.createPlayerForm.get('playerAttacks').setValue(1);
        this.createPlayerForm.get('playerSpells').setValue(1);

        this.createItemForm.get('itemName').setValue("");
        this.createItemForm.get('itemAmount').setValue(1);

        this.addZonePlayerForm.get('zoneRadius').setValue(10);
        this.addZonePlayerForm.get('zoneDuration').setValue(1);
        this.addZoneTileForm.get('zoneRadius').setValue(10);
        this.addZoneTileForm.get('zoneDuration').setValue(1);
    }
    nextTurn() {
        for (var i = 0 ; i < this.allCharacters.length ; i++){
            this.allCharacters[i].resetAllStats();
            this.allCharacters[i].reduceDurations();
        }
        for (var i = 0 ; i < this.dndMap.squares.length ; i++){
            this.dndMap.squares[i].reduceDurations();
        }
        $('#infoBox').css({"color":"black"})
        $('#infoBox').html("New Turn!");
        $('#infoBox').fadeIn(500).delay(500).fadeOut(500);
    }

    addZoneTile(){
        var label = this.addZoneTileForm.get('zoneLabel').value;
        var radius = this.addZoneTileForm.get('zoneRadius').value;
        var duration = this.addZoneTileForm.get('zoneDuration').value;
        var zoneObject:any ={};

        if (duration==0){
            zoneObject ={
                label:label,
                radius:radius,
                duration:-1
            };
        }
        else {
            zoneObject ={
                label:label,
                radius:radius,
                duration:duration
            };
        }
        console.log(zoneObject.label);
        this.selectedSquares[0].zones.push(zoneObject);

        this.mapShareService.setTileZones(); // sets the zone sizes in the correct position
    }

    public receiveMoveMode($event){
        this.movementMode = $event;
    }
    public receiveRangeSquares($event){
        this.rangeSquares = $event;
    }

    public receivePlayerToMove($event){
        this.selectedPlayer = $event;
    }
    public playerAdded(player){
        this.allCharacters.push(player);
        this.orderCharacters();
    }
    orderCharacters(){
        this.allCharacters.sort(function(a, b) {
            return b.initiative - a.initiative;
        });
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
        for (var i = 0 ; i< this.heightWidth ; i++){
            this.rowArray.push(i+1);
            this.rowArrayLetters.push(this.setRowIndexLetter(i+1));
        }

        this.rowStyles = {
            'height': this.dndMap.squares[0].squareHeightWidth
        }

        var rowHeight = $(".rowLetter").css("height");
        $(".rowLetter").css({"line-height":rowHeight});
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
        $('#infoBox').css({"color":"black"})
        $('#infoBox').html("Saving...");
        $('#infoBox').fadeIn(500);

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
                                $('#infoBox').css({"color":"black"})

                                $('#infoBox').html("Saving... Succes!").delay( 500 ).fadeOut(2000);
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
                    console.log("playericon: " + square.players[h].playerIcon);
                }
            }
        }
        if (players.length!=0){
            // save all players at once:
            this.dndMapService.savePlayers(players).subscribe((playerResult:number[]) => {
                // give each player its real database id:
                for (var j = 0 ; j<players.length ; j++){
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
        $('#infoBox').css({"color":"black"})

        $('#infoBox').html("Loading...");
        $('#infoBox').fadeIn(500);
        for (var i=0 ; i< this.allLoadedMapsResult.length ; i++){
            if (this.selectedLoadMap == this.allLoadedMapsResult[i]["id"]){
                this.heightWidth = this.allLoadedMapsResult[i]["heightWidth"];
                var image = this.allLoadedMapsResult[i]["imageUrl"];
                var name = this.allLoadedMapsResult[i]["name"];

                this.dndMap = new DnDMap(this.selectedLoadMap,this.heightWidth, 5);
                this.dndMap.name = name;
                this.mapForm.get('heightwidth').setValue(this.heightWidth);
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

                allMapSquares.push(theSquare);
            }

            allMapSquares = allMapSquares.sort((a, b) => a.mapSquareId < b.mapSquareId ? -1 : a.mapSquareId > b.mapSquareId ? 1 : 0);

            this.dndMap.squares = allMapSquares;
            this.mapForm.get('yards').setValue(this.dndMap.squares[0].squareSize);
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
            $('#infoBox').css({"color":"black"})
            $('#infoBox').html("Loading... Succes!").delay( 500 ).fadeOut(2000);
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
            this.orderCharacters();

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
