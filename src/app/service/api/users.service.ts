import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = "http://196.168.100.6:3000/api/v1/users";
  apiKey = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'; // <-- Enter your own key here!
  
  headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Authorization', 'Bearer '+this.apiKey)
  constructor(private http: HttpClient) { }

  public createUser(data): Observable<any> {
    
    return this.http.post(this.url,
      data,{headers: this.headers,observe: 'response'});
  }

  
}
