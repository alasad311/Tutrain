import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router';
import { IonInfiniteScroll,NavController } from '@ionic/angular';
import { UtilService } from '../service/util.service';
import { FetchService } from './../service/api/fetch.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  searchInput:any;
  searchResults:any;
  showNull = false;
  type = "all";
  page = 0;
  constructor(private router: Router, private fetch: FetchService,private nav: NavController,private util: UtilService) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      const searchValue = this.router.getCurrentNavigation().extras.state;


      this.searchInput = searchValue;
      this.searchDB(searchValue);
    }
  }
  goBackHome(){
    this.router.navigate(['/home']);
  }
  ionViewDidEnter() {
    this.util.refreshUserData();
  }
  ionViewDidLeave() {
    this.util.refreshUserData();
  }
  searchDB(value)
  {
    this.page = 0;
    this.searchResults = null;
    this.showNull = false;
    this.fetch.searchAll(value,this.page).then((response) => {
      var json = JSON.parse(response.data);
      this.searchResults = json.response
      if(json.response.length === 0)
        {
          this.showNull = true;
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        }
    }).catch((error) => {
      
    });
  }
  searchBy(by)
  {
    this.searchResults = null;
    this.page = 0;
    this.showNull = false;
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    if(by === "all")
    {
      this.fetch.searchAll(this.searchInput,this.page).then((response) => {
        var json = JSON.parse(response.data);
        this.searchResults = json.response
        if(json.response.length === 0)
        {
          this.showNull = true;
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        }
      }).catch((error) => {
        
      });
    }else if(by === "users")
    {
      this.fetch.searchUsers(this.searchInput,this.page).then((response) => {
        var json = JSON.parse(response.data);
        this.searchResults = json.response
        if(json.response.length === 0)
        {
          this.showNull = true;
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        }
      }).catch((error) => {
        
      });
    }else if(by === "courses")
    {
      this.fetch.searchCourses(this.searchInput,this.page).then((response) => {
        var json = JSON.parse(response.data);
        this.searchResults = json.response
        if(json.response.length === 0)
        {
          this.showNull = true;
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        }
      }).catch((error) => {
        
      });
    }else if(by === "sessions")
    {
      this.fetch.searchSessions(this.searchInput,this.page).then((response) => {
        var json = JSON.parse(response.data);
        this.searchResults = json.response
        if(json.response.length === 0)
        {
          this.showNull = true;
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        }
      }).catch((error) => {
        
      });
    }
  }
  doInfinite(event) {
    setTimeout(() => {
      this.page = this.page + 1;
      if(this.type === "all")
      {
        this.fetch.searchAll(this.searchInput,this.page).then((response) => {
          var json = JSON.parse(response.data);
          for (let i = 0; i < json.response.length; i++) {
            this.searchResults.push(json.response[i])
          }
          if(json.response.length == 0)
            event.target.disabled = true;
          event.target.complete();
        }).catch((error) => {
          
        });
      }else if(this.type === "users")
      {
        this.fetch.searchUsers(this.searchInput,this.page).then((response) => {
          var json = JSON.parse(response.data);
          for (let i = 0; i < json.response.length; i++) {
            this.searchResults.push(json.response[i])
          }
          if(json.response.length == 0)
            event.target.disabled = true;
          event.target.complete();
        }).catch((error) => {
          
        });
      }else if(this.type === "courses")
      {
        this.fetch.searchCourses(this.searchInput,this.page).then((response) => {
          var json = JSON.parse(response.data);
          for (let i = 0; i < json.response.length; i++) {
            this.searchResults.push(json.response[i]);
          }
          if(json.response.length == 0)
            event.target.disabled = true;
          event.target.complete();
        }).catch((error) => {
        });
      }else if(this.type === "sessions")
      {
        this.fetch.searchSessions(this.searchInput,this.page).then((response) => {
          var json = JSON.parse(response.data);
          this.searchResults = json.response
          if(json.response.length === 0)
          {
            this.showNull = true;
            this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
          }
        }).catch((error) => {
          
        });
      }
    }, 3000);
  }
  splitTags(tags){
    return tags.split(',');
  }
  viewDetails(selectID,type)
  {
    const navigationExtras: NavigationExtras = {
      queryParams: {
          page: '/search',
          id: selectID
      }
    };
   if(type === 'user')
   {
    this.nav.navigateForward('/details/users',navigationExtras);
   }else if(type === 'course'){
    this.nav.navigateForward('/details/courses',navigationExtras);
   }
   else if(type === 'session'){
    this.nav.navigateForward('/details/session',navigationExtras);
   }
  }
}

