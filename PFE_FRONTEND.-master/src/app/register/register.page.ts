import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PasswordValidator } from '../password.validator';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ConfigService } from '../services/config/config.service';
import { ErrormsgService } from '../services/errormsg/errormsg.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  public showPassword: boolean = true;
  public showConfirmPassword: boolean = true;
  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public router: Router,
    private config: ConfigService,
    public http: HttpClient,
    private iab: InAppBrowser,
    public errorMSG: ErrormsgService
  ) { 
    this.onSubmit = this.onSubmit.bind(this); 
  }

  ngOnInit() {

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    this.validations_form = this.formBuilder.group({
      fullName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z ]{2,30}$')
        // Validators.pattern('^[a-zA-Z]+$')
      ])),

      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      mobileNo: new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      matching_passwords: this.matching_passwords_group,

    });
  }


  onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

  onConfirmPasswordToggle(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  openExternalURL() {
    this.iab.create('http://sandtell.com/', '_system');
  }


  onSubmit(values) {
    console.log(values);
    console.log(this.router);
    let signupValues = {
      firstName : values.fullName,
      lastName : values.fullName,
      email : values.email,
      password : values.matching_passwords.password,
      tel:values.mobileNo
    };
    let url = this.config.domainURL + 'register';
    console.log(url); 
    console.log(signupValues);
    let _this = this;
    this.http.post(url,signupValues).subscribe(function(result:any){
      if(!result.error){
        _this.router.navigateByUrl("/login");
      }else{
        _this.presentToast("Erreur lors de la création de votre compte veuillez patient et essayer ultérieurement");
      }
    },function(){
      _this.presentToast("Erreur lors de la création de votre compte veuillez patient et essayer ultérieurement");
    })

/*
    let data: any;
    const url = this.config.domainURL + 'signup';
    const loading = await this.loadingCtrl.create({
      message: 'Creating New User...',
    });
    data = this.http.post(url, signupValues);
    loading.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        console.log(result.data.user_id);
        if (result.status === '1' && result.data.isVerified === 0) {
          //this.router.navigateByUrl('otp');
          this.presentToast(result.message);
          loading.dismiss();
        } else if (result.status === '0') {
          this.presentToast(result.message);
          loading.dismiss();
        }

        loading.dismiss();
      });
      return loading.present();
    }, error => {
      console.log(error);
      loading.dismiss();
    });
    this.validations_form.reset();*/
  }


  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
