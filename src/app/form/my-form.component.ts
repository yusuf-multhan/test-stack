import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, User } from '../authentication.service';

@Component({
  selector: 'my-form',
  templateUrl: './my-form.component.html',
  styleUrls: ['./my-form.component.css']
})
export class MyFormComponent implements OnInit {

  credentials: User = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthenticationService,private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
  }

  onSubmit(): void {
    this.auth.login(this.credentials).subscribe(() => {      
      this._router.navigate(['/home']);
    }, (err) => {
      console.error(err);
    }); 
  }

}
