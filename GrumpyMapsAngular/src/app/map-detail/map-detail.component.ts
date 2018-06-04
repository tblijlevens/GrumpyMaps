import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {DnDMapService} from '../dn-dmap.service'
import {DnDMap} from '../dn-dmap'
import {Square} from '../square'

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css'],
  providers:  [DnDMapService]

})
export class MapDetailComponent implements OnInit {
  mapForm = new FormGroup ({
     heightwidth: new FormControl(),
     feet: new FormControl()
   });

   mapHeight:number = 10;
   mapWidth:number = 5;
   squareScale:string = '5%';
   allSquares:Square[];
   dndMap:DnDMap;

   constructor(private dndMapService : DnDMapService) { }


  ngOnInit() {

  }
  public setMapScale(){
      const numberOfSquares = this.mapWidth*this.mapHeight;
      this.squareScale = 100/this.mapWidth+'%';
      console.log('scale: ' + this.squareScale);

      this.dndMap =  new DnDMap(this.mapHeight, this.mapWidth, numberOfSquares, this.squareScale);
      console.log('Map created with mapheight is ' + this.dndMap.mapHeight);
      this.allSquares = this.dndMap.getSquares();



//        this.dndMapService.setMapScale(dndMap).subscribe();
  }

/*    public retrieveMaps(){
      console.log(this.dndMapService.findAll().subscribe());

  }
*/

}
