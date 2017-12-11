import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    localStorage.setItem('username',this.model.username);
    this.router.navigate(['/all']);
  }
}
