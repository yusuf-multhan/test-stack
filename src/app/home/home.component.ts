import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthenticationService,private _route: ActivatedRoute,
    private _router: Router) { 

  }

  ngOnInit() {
    console.log(window.sessionStorage.getItem('token'))
    if(!window.sessionStorage.getItem('token')) {
      this._router.navigate(['/login']);
    }
  }

}
