import { Component, OnInit } from '@angular/core';
import { MonumentService } from '../services/monument/monument.service';
import { PlaceModel } from '../_models/place.model';
import { AuthenticationService } from '../services/auth/authentication.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  places : PlaceModel[];
  title: string;
  constructor(private monumentService: MonumentService, private authenticationService: AuthenticationService) {
  }
  ngOnInit() {
    this.monumentService.getTop().subscribe(rsp => {
      console.log(rsp);
      this.places = rsp.data;
    }, err => console.log(err));
  }

  logoutFn() {
    console.log("logout");
    this.authenticationService.logout();
  }
}