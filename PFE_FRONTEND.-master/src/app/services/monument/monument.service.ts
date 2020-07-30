import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonumentService {
  constructor(
    private http: HttpClient,
  ) {
    
   }

   getAll(type: string): any {
    return this.http.get("http://localhost:3000/places/type/"+type);
   }

   getTop(): any {
    return this.http.get("http://localhost:3000/places/top");
   }

   get(id: number): Observable<any> {
     return this.http.get("http://localhost:3000/places/id/"+id);
   }

   



}
