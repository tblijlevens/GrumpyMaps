import { Component }              from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css']
})
export class MapDetailComponent implements OnInit {
  mapForm = new FormGroup ({
     heightwidth: new FormControl(),
     feet: new FormControl()
   });
  constructor() { }
}
