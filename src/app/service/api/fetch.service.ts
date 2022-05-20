import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  apiKey = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'; // <-- Enter your own key here!

  constructor(private http: HTTP) { }

  public async getUser(email):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = "https://tapp.scd.edu.om/api/v1/users/"+email 
      this.http.sendRequest( url, {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        serializer: 'utf8',
        timeout: 1000
      } )
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  public async getHomePage(email):Promise<any>{
    const res1 = new Promise( (resolve,reject) => {
      this.http.sendRequest( "https://tapp.scd.edu.om/api/v1/ads" , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        serializer: 'utf8',
        timeout: 1000
      } )
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        })
    });
    const res2 = new Promise( (resolve,reject) => {
      this.http.sendRequest( "https://tapp.scd.edu.om/api/v1/category" , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        serializer: 'utf8',
        timeout: 1000
      } )
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
    const res3 = new Promise( (resolve,reject) => {
      const url = "https://tapp.scd.edu.om/api/v1/courses/new/"+email
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        serializer: 'utf8',
        timeout: 1000
      } )
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
    return new Promise( (resolve,reject) => {
        Promise.all([res1, res2,res3]).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }
  public async searchAll(value,page):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = "https://tapp.scd.edu.om/api/v1/search/all/"+value+"/"+page;
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
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
  
  public async searchUsers(value,page):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = "https://tapp.scd.edu.om/api/v1/search/users/"+value+"/"+page;
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
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

  public async searchCourses(value,page):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = "https://tapp.scd.edu.om/api/v1/search/courses/"+value+"/"+page;
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
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
  public async getCourseDetail(id):Promise<any>{
    const courseDetails = new Promise( (resolve,reject) => {
      const url = "https://tapp.scd.edu.om/api/v1/course/"+id;
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
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
    const sections = new Promise( (resolve,reject) => {
      const url = "https://tapp.scd.edu.om/api/v1/course/sections/"+id;
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
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
   
    return new Promise( (resolve,reject) => {
      Promise.all([courseDetails,sections]).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
  }
  
}
