import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = "http://192.168.100.6:3000/api/v1/users";
  apiKey = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'; // <-- Enter your own key here!

  constructor(private http: HTTP) { }
  

  public async createUser(data):Promise<any>{
   return new Promise( (resolve,reject) => {
      this.http.sendRequest( this.url , {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'utf8',
        timeout: 1000
      } )
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  public async siginUser(email,password):Promise<any>{
    return new Promise( (resolve,reject) => {
       this.http.sendRequest( this.url , {
         method: 'get',
         headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
         data: {
           'email': email,
           'password': password
         },
         serializer: 'utf8',
         timeout: 1000
       } )
         .then(res => {
           resolve(res)
         })
         .catch(error => {
           reject(error);
         });
     });
   }
}