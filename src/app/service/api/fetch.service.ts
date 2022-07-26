import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { StorageService } from '../storage/storage.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Photo } from '@capacitor/camera';
import { ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  apiKey = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'; // <-- Enter your own key here!
  constructor( private http: HTTP,private storage: StorageService,
    private transfer: FileTransfer) {
    this.http.setDataSerializer('raw');
  }
  fileTransfer: FileTransferObject = this.transfer.create();
  public async getUser(email): Promise<any>{
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
  public async getHomePage(email): Promise<any>{
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
    const res4 = new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+email+'/order/courses'
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
        Promise.all([res1, res2, res3, res4]).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  }
  public async searchAll(value,page): Promise<any>{
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
  
  public async searchUsers(value,page): Promise<any>{
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

  public async searchCourses(value,page): Promise<any>{
    return new Promise( async (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/search/courses/'+value+'/'+page;
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
  public async getCourseDetail(id): Promise<any>{
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
    const trailer = new Promise( async (resolve,reject) => {
      const user = await this.storage.get('user');
      const url = 'https://tapp.scd.edu.om/api/v1//course/trailer/'+id+'/'+user.email;
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
      Promise.all([courseDetails,sections,paid,trailer]).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
  }
  public async updateOrder(data): Promise<any>{
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
  public async getUserDetailByID(id): Promise<any>{
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
  public async submitReport(data): Promise<any>{
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
  public async createSlot(data): Promise<any>{
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
  public async updateUserToken(data): Promise<any>{
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
  public async updateBooking(data): Promise<any>{
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
  public async cancelBooking(data): Promise<any>{
    return new Promise( (resolve,reject) => {
      this.http.setDataSerializer('urlencoded');
      this.http.sendRequest( "https://tapp.scd.edu.om/api/v1/slot/cancel" , {
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
  public async getUserInvites(refCode): Promise<any>{
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
  public async getUserOrders(id,page): Promise<any>{
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
  public async getUserRequests(id,page,type): Promise<any>{
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
  public async getTotalUnPaid(id): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+id+'/wallet/';
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
  public async getAppSetting(): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/app/setting';
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
  public async requestPayout(data): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/payout/request';
      this.http.sendRequest( url, {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'json',
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
  public async deleteUser(id): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+id+'/delete/';
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
  public async searchSessions(value,page): Promise<any>{
    const user = await this.storage.get('user');
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/search/sessions/'+value+'/'+page;
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
  public async searchSessionsWithinUser(value,page): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/search/user/sessions/'+value+'/'+page;
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
  public async getSessionDetails(id): Promise<any>{
    const courseDetails = new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/session/'+id;
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
    const seats = new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/session/counter/'+id;
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
      const url = 'https://tapp.scd.edu.om/api/v1/session/paied/'+id+'/'+user.email;
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
      Promise.all([courseDetails,seats,paid]).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
  }
  public async addRating(data): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/rating/new';
      this.http.sendRequest( url, {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'json',
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
  public async getAllSessions(id,page): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+id+'/all/sessions/'+page;
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
  public async getContest(): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/contest/';
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
  public async getSubscriptions(): Promise<any>{
    return new Promise((resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/contest/subscriptions';
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
  public async getContestQuestions(id): Promise<any>{
    return new Promise((resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/contest/'+id;
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
  public async contestDidAnswerer(id): Promise<any>{
    return new Promise( async (resolve,reject) => {
      const user = await this.storage.get('user');
      const url = 'https://tapp.scd.edu.om/api/v1/contest/'+id+'/answered';
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
  public async submitUserAnswerer(contestID,answererID): Promise<any>{
    return new Promise( async (resolve,reject) => {
      const user = await this.storage.get('user');
      const data = {
        answer: answererID
      };
      const url = 'https://tapp.scd.edu.om/api/v1/contest/'+contestID+'/';
      this.http.sendRequest( url , {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey,"userID": ""+user.user_id},
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
  public async uploadBio(userID,uploadVideo:ChooserResult): Promise<any>{
    return new Promise( async (resolve,reject) => {
      let options: FileUploadOptions = {
        fileKey: 'bioVideo',
        chunkedMode: true,
        mimeType: 'multipart/form-data',
        headers: {'Authorization' : 'Bearer '+this.apiKey,"userID": ""+userID}
      }
      this.fileTransfer.upload(uploadVideo.uri, encodeURI('https://tapp.scd.edu.om/api/v1/users/uploadbio'), options).then((data) => {
        resolve(JSON.parse(data.response))
      }, (err) => {
        reject(err);

      })
     
   }) 
  }
  public async updateUser(userID,data,imageData: Photo): Promise<any>{
    //lets being with upload the picture first
    return new Promise( async (resolve,reject) => {
      if(imageData != null)
      {
        let options: FileUploadOptions = {
          fileKey: 'tutrainPro',
          chunkedMode: true,
          mimeType: 'multipart/form-data',
          params: data,
          headers: {'Authorization' : 'Bearer '+this.apiKey,"userID": ""+userID}
       }
        this.fileTransfer.upload(imageData.path, encodeURI('https://tapp.scd.edu.om/api/v1/users/upload'), options).then((data) => {
          resolve(JSON.parse(data.response))
        }, (err) => {
          reject(err);

        })
      }else{
        const url = 'https://tapp.scd.edu.om/api/v1/users/upload';
        this.http.sendRequest( url , {
          method: 'post',
          headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey,"userID": ""+userID},
          data: data,
          serializer: 'json',
          timeout: 1000
        } )
          .then(res => {
            resolve(JSON.parse(res.data))
          })
          .catch(error => {
            reject(error);
          });
      }
   }) 

  }
  public async updateSession(id,data,imageData: Photo): Promise<any>{
    //lets being with upload the picture first
    return new Promise( async (resolve,reject) => {
      if(imageData != null)
      {
        let options: FileUploadOptions = {
          fileKey: 'tutrainSession',
          chunkedMode: true,
          mimeType: 'multipart/form-data',
          params: data,
          headers: {'Authorization' : 'Bearer '+this.apiKey}
       }
        this.fileTransfer.upload(imageData.path, encodeURI('https://tapp.scd.edu.om/api/v1/session/'+id+'/upload'), options).then((data) => {
          resolve(JSON.parse(data.response))
        }, (err) => {
          reject(err);

        })
      }else{
        const url = 'https://tapp.scd.edu.om/api/v1/session/'+id+'/update';
        this.http.sendRequest( url , {
          method: 'post',
          headers: {'content-type' : 'application/json','Authorization' :  'Bearer '+this.apiKey},
          data: data,
          serializer: 'json',
          timeout: 1000
        } )
          .then(res => {
            resolve(JSON.parse(res.data))
          })
          .catch(error => {
            reject(error);
          });
      }
   }) 

  }
  public async createSession(data,imageData: Photo): Promise<any>{
    //lets being with upload the picture first
    const user = await this.storage.get('user');
    return new Promise( async (resolve,reject) => {
      let options: FileUploadOptions = {
        fileKey: 'tutrainSession',
        chunkedMode: true,
        mimeType: 'multipart/form-data',
        params: data,
        headers: {'Authorization' : 'Bearer '+this.apiKey,"userID": ""+user.user_id}
      }
      this.fileTransfer.upload(imageData.path, encodeURI('https://tapp.scd.edu.om/api/v1/session/create'), options).then((data) => {
        resolve(JSON.parse(data.response))
      }, (err) => {
        reject(err);
      })
   }) 
  }
  
  public async changeUserPassword(userID,data): Promise<any>{
    return new Promise( (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/users/'+userID+'/password';
      this.http.sendRequest( url, {
        method: 'post',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey},
        data: data,
        serializer: 'json',
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
  public async getAllNewCoursePages(id,page): Promise<any>{
    return new Promise( async (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/courses/allnew/'+page;
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey,"userID": ""+id},
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
  public async getAllCoursesInCategory(id,categoryID,page): Promise<any>{
    return new Promise( async (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/category/'+categoryID+'/'+page;
      this.http.sendRequest( url , {
        method: 'get',
        headers: {'content-type' : 'application/json','Authorization' : 'Bearer '+this.apiKey,"userID": ""+id},
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
  public async getWinners(): Promise<any>{
    return new Promise( async (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/contest/winner';
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
  public async deleteSession(id): Promise<any>{
    return new Promise( async (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/session/delete/'+id;
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
  public async getAllSeatBySession(id): Promise<any>{
    return new Promise( async (resolve,reject) => {
      const url = 'https://tapp.scd.edu.om/api/v1/session/seats/'+id;
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
  
}
