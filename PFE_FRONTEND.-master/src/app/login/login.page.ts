import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoadingController, MenuController } from '@ionic/angular';
import { ConfigService } from '../services/config/config.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { ToastsService } from '../services/toast/toasts.service';
import { ErrormsgService } from '../services/errormsg/errormsg.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  public showPassword: boolean = true;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private config: ConfigService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastController: ToastsService,
    private authService: AuthenticationService,
    public errorMSG: ErrormsgService,
    public menu:MenuController
  ) { 
    authService.logout();
    
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  // validation_messages = {
  //   email: [
  //     { type: 'required', message: 'Email rejeté' },
  //     { type: 'pattern', message: 'Enter un email valide' }
  //   ],
  //   password: [
  //     { type: 'required', message: 'Mot de passe rejeté' },
  //     { type: 'minlength', message: 'Le mot de passe doit comporter au moins 5 caractères.' },
  //   ],

  // };

  onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }


  async onSubmit(values) {
    let data: any;
    const url = this.config.domainURL + 'login';
    const loading = await this.loadingCtrl.create({
      message: 'Vérification...',
    });
    data = this.http.post(url, values);
    loading.present().then(() => {
      data.subscribe(result => {
        let user = jwt_decode(result.data.token);
        user = user.user;
        localStorage.setItem('lsUserID', user.Id);
        localStorage.setItem('lsUserName', user.Prenom);
        localStorage.setItem('lsEmail', user.Email);
        localStorage.setItem('lsApiToken', result.data.token);

        if (result.error === false) {
          this.authService.login(user);
          
    this.menu.enable(true,"IsLoged");
    this.menu.enable(false,"IsNotLoged");
          this.router.navigateByUrl('home');
          this.toastController.presentToast(result.message);
          loading.dismiss();
        } else {
          this.toastController.presentToast(result.message);
          loading.dismiss();
        }

        loading.dismiss();
      }, (err) => {
        this.toastController.presentToast("Utilisateur ou mot de passe incorrecte !");
        loading.dismiss();
      });
      return loading.present();
    }, error => {
      console.log(error);
      loading.dismiss();
    });

    this.validations_form.reset();

    console.log(values);

  }


}
