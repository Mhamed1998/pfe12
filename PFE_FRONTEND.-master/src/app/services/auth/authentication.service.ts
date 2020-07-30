import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authState = new BehaviorSubject(false);
  constructor(
    private platform: Platform,
    private storage: Storage,
    private router: Router,
    private menu: MenuController
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
   }

   ifLoggedIn() {
    this.storage.get('USER_INFO').then((response) => {
      console.log(response);
      if (response) {
        console.log("Is Loged")
        this.authState.next(true);
      }else{
        console.log("Is  NPT Loged")
        this.router.navigateByUrl('/login');
      }
    });
  }

  async getInfo() {
    let info = "";
    await this.storage.get('USER_INFO').then((response) => {
      info = response;
      console.log(response);
    });
    console.log(info);
    if(this.isAuthenticated()){
      return info;
    }else{
      return null;
    }
  }

  login(user: any) {
    
    this.storage.set('USER_INFO', user).then((response) => {
      this.authState.next(true);
    });
  }

  logout() {
    this.menu.enable(false,"IsLoged");
    this.menu.enable(true,"IsNotLoged");
    localStorage.clear();
    this.storage.remove('USER_INFO').then(() => {
      this.router.navigateByUrl('login');
      this.authState.next(false);
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }

}
