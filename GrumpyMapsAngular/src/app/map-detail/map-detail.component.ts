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

     squareScale:string = '5%';
   allSquares:Square[];
   dndMap:DnDMap;

   constructor(private dndMapService : DnDMapService) { }


  ngOnInit() {

  }
  public setMapScale(){
      const heightWidth = this.mapForm.get('heightwidth').value;
      const squareSize = this.mapForm.get('feet').value;
      const numberOfSquares = heightWidth*heightWidth;
      this.squareScale = 100/heightWidth+'%';
      console.log('heightwidth: ' + heightWidth + '\n' +
                    'Scale = ' + this.squareScale);

      this.dndMap =  new DnDMap(heightWidth, squareSize, numberOfSquares, this.squareScale);
      this.allSquares = this.dndMap.getSquares();



//        this.dndMapService.setMapScale(dndMap).subscribe();
  }

/*    public retrieveMaps(){
      console.log(this.dndMapService.findAll().subscribe());

  }
*/

}
