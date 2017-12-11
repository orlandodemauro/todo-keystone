import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor() {}

  canActivate() {
    if (localStorage.getItem('username') !== null) {
        return true;
    } else {
        return false;
    }
  }
}
