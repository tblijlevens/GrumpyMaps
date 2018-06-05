import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {DnDMapService} from '../dn-dmap.service'
import {DnDMap} from '../domain/dn-dmap'
import {Square} from '../domain/square'

import {SquareDetailShareService} from '../square-detail-share.service';
import {SquareComponent} from '../square/square.component';
import {SquareDetailComponent} from '../square-detail/square-detail.component';


@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css'],
  providers:  [DnDMapService, SquareDetailShareService]
})

export class MapDetailComponent implements OnInit {
  mapForm = new FormGroup ({
     heightwidth: new FormControl(),
     feet: new FormControl()
   });

   allSquares:Square[];
   dndMap:DnDMap;

   constructor(private dndMapService : DnDMapService) { }


  ngOnInit() {
      //TODO dndmap should be created with a unique number as an id (first parameter): Get last map id from database, add 1.
      this.dndMap=new DnDMap(2, 10, 5);
      this.allSquares = this.dndMap.getSquares();

  }

  public setMapScale(){
      var heightWidth = +this.mapForm.get('heightwidth').value;
      if (heightWidth >25){
          heightWidth = 25;
          alert("Map gridsize can't be bigger than 25x25. Therefore gridsize is set to 25x25.");
      }
      var squareSize = +this.mapForm.get('feet').value;
      if (!squareSize){
          squareSize=5;
          alert("Square size wasn't set and is now defaulted to 5.");
      }

      this.dndMap.setHeightWidth(heightWidth, squareSize);
      this.allSquares = this.dndMap.getSquares();

//        this.dndMapService.setMapScale(dndMap).subscribe();
  }

/*    public retrieveMaps(){
      console.log(this.dndMapService.findAll().subscribe());

  }
*/

}
