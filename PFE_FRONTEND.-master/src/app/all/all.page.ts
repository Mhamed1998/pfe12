import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { PlaceModel, Bus, Taxi, Tram } from '../_models/place.model';
import { MonumentService } from '../services/monument/monument.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../services/config/config.service';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-all',
  templateUrl: './all.page.html',
  styleUrls: ['./all.page.scss'],
})
export class AllPage implements OnInit {

  lieu: PlaceModel = new PlaceModel();
  note: any;
  IsLoged: any;
  UserInfo: any;
  Bus: Bus[] = [];
  Taxi: Taxi[] = [];
  Trams: Tram[] = [];
  constructor(
    public Router: Router,
    private config: ConfigService,
    public Storage: Storage,
    public Http: HttpClient,
    private route: ActivatedRoute, private monumentService: MonumentService, public AuthenticationService: AuthenticationService) {
    // AuthenticationService.ifLoggedIn();

    this.IsLoged = AuthenticationService.isAuthenticated();
    this.UserInfo = this.AuthenticationService.getInfo();
    console.log(this.IsLoged);
    const url = this.config.domainURL;

  }

  ngOnInit() {
    const url = this.config.domainURL;
    this.route.params.subscribe(params => {

      this.monumentService.get(params.id).subscribe(rsp => {
        console.log(rsp);
        this.lieu = rsp.data;

      });

      this.Http.get(url + "lieubus/" + params.id).subscribe((rsp:any)  => {
        this.Bus = rsp.data[0];
        console.log(this.Bus);
      })


      this.Http.get(url + "lieutaxi/" + params.id).subscribe((rsp:any) => {
        this.Taxi = rsp.data[0];
        console.log(this.Taxi);
      })


      this.Http.get(url + "lieutram/" + params.id).subscribe((rsp:any) => {
        this.Trams = rsp.data[0];
      })
    });


  }
  public async change(note) {
    let url = this.config.domainURL + 'avis/vote';
    this.Storage.get('USER_INFO').then((response) => {
      if (response != null && response != "") {


        let vote = {
          userId: response.Id,
          lieuId: this.lieu.id,
          note: note
        }
        console.log(this.AuthenticationService.getInfo());
        console.log(vote.userId);
        this.Http.post(url, vote).subscribe(function (reponse) {
          console.log(reponse);
        })
        console.log(note);
      } else {
        this.Router.navigateByUrl("login");
      }
    });

  }
}
