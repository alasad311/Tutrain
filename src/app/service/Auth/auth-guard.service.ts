import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FetchService } from '../api/fetch.service';
import { StorageService } from './../storage/storage.service';



@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public storage: StorageService,public fetch: FetchService,
      private router: Router
        ) {}
    subscribe(arg0: (state: any) => void) {
      throw new Error('Method not implemented.');
    }
    async canActivate(): Promise<boolean> {
      let status = false;
      const user = await this.storage.get("user").then(async (x) =>{
        if(x)
        {
          if(x.is_active == 0)
          {
            this.storage.clear();
            this.router.navigateByUrl('/welcome', { replaceUrl:true });
            status = false;

          }else
          {
            status = true;
          }
        }else{
          this.router.navigateByUrl('/welcome', { replaceUrl:true });
          status = false;
        }
      });
      return status;
    }

}