import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { StorageService } from '../storage/storage.service';


@Injectable({
  providedIn: 'root'
})
export class FetchService {
  apiKey = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'; // <-- Enter your own key here!
  constructor( private http: HTTP,private storage: StorageService) {
    this.http.setDataSerializer('raw');
  }

  public async getUser(email):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+email 
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
      this.http.sendRequest( 'https://tapp.scd.edu.om/api/v1/ads' , {
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
      this.http.sendRequest( 'https://tapp.scd.edu.om/api/v1/category' , {
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
      const url = 'https://tapp.scd.edu.om/api/v1/courses/new/'+email
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
    return new Promise( async (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/search/all/'+value+'/'+page;
      const user = await this.storage.get('user');
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey,"userID": ""+user.user_id},
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
    return new Promise( async (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/search/users/'+value+'/'+page;
      const user = await this.storage.get('user');
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey,"userID": ""+user.user_id},
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
      const url = 'https://tapp.scd.edu.om/api/v1/search/courses/'+value+'/'+page;
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
      const url = 'https://tapp.scd.edu.om/api/v1/course/'+id;
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
      const url = 'https://tapp.scd.edu.om/api/v1/course/sections/'+id;
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
    const paid = new Promise( async (resolve,reject) => {
      const user = await this.storage.get('user');
      const url = 'https://tapp.scd.edu.om/api/v1//course/paied/'+id+'/'+user.email;
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
      Promise.all([courseDetails,sections,paid]).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
  }
  public async updateOrder(data):Promise<any>{
    return new Promise( (resolve,reject) => {
      this.http.setDataSerializer('urlencoded');
      this.http.sendRequest( "https://tapp.scd.edu.om/api/v1/order" , {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'json',
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
  public async getUserDetailByID(id):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/user/'+id
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
  public async submitReport(data):Promise<any>{
    return new Promise( (resolve,reject) => {
      this.http.setDataSerializer('urlencoded');
      this.http.sendRequest( "https://tapp.scd.edu.om/api/v1/report/" , {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'json',
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
  public async createSlot(data):Promise<any>{
    return new Promise( (resolve,reject) => {
      this.http.setDataSerializer('urlencoded');
      this.http.sendRequest( "https://tapp.scd.edu.om/api/v1/slot/" , {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'json',
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
  public async updateUserToken(data):Promise<any>{
    return new Promise( (resolve,reject) => {
      this.http.setDataSerializer('urlencoded');
      this.http.sendRequest( "https://tapp.scd.edu.om/api/v1/user/token" , {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'json',
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
  public async updateBooking(data):Promise<any>{
    return new Promise( (resolve,reject) => {
      this.http.setDataSerializer('urlencoded');
      this.http.sendRequest( "https://tapp.scd.edu.om/api/v1/slot/update" , {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'json',
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
  public async getUserInvites(refCode):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+refCode+'/invites';
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
  public async getUserOrders(id,page):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+id+'/orders/'+page;
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
  public async getUserRequests(id,page,type):Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+id+'/requests/'+page+'/'+type;
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
  
}
