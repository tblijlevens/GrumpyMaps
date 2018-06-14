
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DnDMapService } from '../dn-dmap.service'
import { DnDMap } from '../domain/dn-dmap'
import { Square } from '../domain/square'
import { Player } from '../domain/player'

import { MapShareService } from '../map-share.service';
import { SquareComponent } from '../square/square.component';
import { SquareDetailComponent } from '../square-detail/square-detail.component';


@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css'],
  providers: [DnDMapService, MapShareService]
})

export class MapDetailComponent implements OnInit {
  mapForm = new FormGroup({
    heightwidth: new FormControl(),
    feet: new FormControl(),
    imageUrl: new FormControl(),
    gridToggle: new FormControl(),
    obstructToggle: new FormControl()
  });

  dndMap: DnDMap;
  mapBackground = {};
  squareStyles = {};
  playerStyles = {};
  squareScale: string = '10%';
  heightWidth:number = 10;
  mapsLoaded=false;
  allLoadedMapsResult;
  allLoadedMapIds:number[];
  selectedMap:number;



  constructor(private dndMapService: DnDMapService, private mapShareService: MapShareService) { }


  ngOnInit() {
    this.dndMap = new DnDMap(0, this.heightWidth, 5); //id zero cannot exist in databse, so it will generate a new unique id)
    this.mapShareService.setDnDMap(this.dndMap);
    this.mapForm.get('heightwidth').setValue(10);
    this.mapForm.get('feet').setValue(5);
    this.mapForm.get('gridToggle').setValue(true);

  }

  public uploadImage() {
    const imageUrl = this.mapForm.get('imageUrl').value;
    this.dndMap.setImage(imageUrl);
    this.mapBackground = {
      'background-image': 'url(' + imageUrl + ')'
    };

  }

  public setMapScale() {
      this.heightWidth = +this.mapForm.get('heightwidth').value;
      if (this.heightWidth > 25) {
          this.heightWidth = 25;
          // alert("Map gridsize can't be bigger than 25x25. Therefore gridsize is set to 25x25.");
      }
      var squareSize = +this.mapForm.get('feet').value;
      if (!squareSize) {
          squareSize = 3;
          // alert("Square size wasn't set and is now defaulted to 3.");
      }

      this.dndMap.setHeightWidth(this.heightWidth, squareSize);
      this.mapShareService.setDnDMap(this.dndMap);


  }

  public obstructSquares(){
      var obstructionMode = this.mapForm.get('obstructToggle').value;
      this.mapShareService.setObstructionMode(obstructionMode);

  }

  public hideGrid() {
  var gridToggle = this.mapForm.get('gridToggle').value;
  var squareBorderStyle= 'dotted 1px rgba(0,0,0,0)';
  if (gridToggle) {
      // grid off
    squareBorderStyle = 'dotted 1px rgba(0,0,0,0.5)';
  }
  this.mapShareService.setSquareBorderStyles(squareBorderStyle);

}


  public saveMap() {
      this.saveMapWithSquares();
      this.savePlayersOnSquares();
  }

  private saveMapWithSquares(){
      this.dndMapService.saveMap(this.dndMap).subscribe((mapId: number) => {
          this.dndMap.id = mapId;
          var mapSquares = this.dndMap.squares;

          for (var i = 0 ; i<mapSquares.length ; i++){
              var square = mapSquares[i];
              square.setMapId(this.dndMap.id);
              this.dndMapService.saveSquare(square).subscribe(result => {
                  //var keys = Object.keys(result);
                  //console.log("this: " + result["id"]);
                  for (var j = 0 ; j<mapSquares.length ; j++){
                      if (mapSquares[j].mapSquareId == result["mapSquareId"]){
                          mapSquares[j].id = result["id"];
                      }
                  }
              }); //saveSquare
          }

          console.log("Map added/updated with id: " + this.dndMap.id);
          console.log("number of squares: " + this.dndMap.numberOfSquares);
    }); //saveMap end

  }

  private savePlayersOnSquares(){

    var mapSquares = this.dndMap.squares;
    for (var i = 0 ; i<mapSquares.length ; i++){
        var square = mapSquares[i];
        var players = square.players;
        for (var j = 0 ; j<players.length ; j++){
            var player = players[j];
            this.dndMapService.savePlayer(player).subscribe(playerResult => {
                var mapSquares2 = this.dndMap.squares;
                for (var k = 0 ; k < mapSquares2.length ; k++){
                    var players2 = mapSquares2[k].players;
                    for (var l = 0 ; l<players2.length ; l++){
                        //console.log("plres scndId: " + playerResult.playerSquareId);
                        if (players2[l].playerSquareId == playerResult["playerSquareId"]){
                            players2[l].id = playerResult["id"];
                            console.log("square: " + mapSquares2[k].mapSquareId + " has got player: " + players2[l].id + "- " + players2[l].name);
                            //console.log("front Id: " + players2[l].id);
                        }
                    }
                }
            });
        }
    }
  }

  loadMap(){
      this.allLoadedMapIds = new Array();
      this.dndMapService.findAllMaps().subscribe(allMaps => {
          this.allLoadedMapsResult = allMaps;
          for (var i=0 ; i< allMaps.length ; i++){
              console.log(allMaps[i]);
              this.allLoadedMapIds.push(allMaps[i]["id"]);
          }
          this.mapsLoaded=true;

      });
  }
  selectMap(id:number){
      this.selectedMap = id;
      
  }
  loadSelectedMap(){
      console.log("selected: " + this.selectedMap);
      /*for (var i=0 ; i< this.allLoadedMapsResult.length ; i++){
          var heightWidth = this.allLoadedMapsResult[i]["heightwidth"];
          var image = this.allLoadedMapsResult[i]["image-url"];
      }*/
  }
}
