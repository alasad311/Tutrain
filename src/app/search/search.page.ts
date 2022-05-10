import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchInput:any;
  searchResults:any;
  type = "all";
  constructor(private router: Router) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      const searchValue = this.router.getCurrentNavigation().extras.state;
      this.searchInput = searchValue;
      this.searchDB(searchValue)
    }
  }
  goBackHome(){
    this.router.navigate(['/home']);
  }
  searchDB(value)
  {
    
  }
  searchBy(by)
  {
    
  }
}

