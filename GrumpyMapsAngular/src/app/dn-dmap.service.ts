
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
//import { map } from 'rxjs/operator/map';
//import { catch } from 'rxjs/operator/catch';

import {DnDMap} from './domain/dn-dmap';

@Injectable({
  providedIn: 'root'
})
export class DnDMapService {

  constructor(private http: HttpClient) { }

  setMapScale(dndMap : DnDMap){
      console.log("sending...");
      return this.http.post('http://localhost:8080/dndmap', dndMap);
 /* .catch((error: any) => Observable.throw(error.json().error || 'Server error'))*/;
  }
/*
  findAll(): Observable<DnDMap[]>  {
    return this.http.get('http://localhost:8080/dndMap')
     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
*/
}
