import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HTTP } from '@ionic-native/http';
import { ToastProvider } from "./../../../providers/config/toasts";
import { RoutesProvider } from "./../../../providers/config/routes";
import { AppPreferences } from '@ionic-native/app-preferences';
import { LoginPage } from './../login/login';
import { FCM } from '@ionic-native/fcm';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  private form : FormGroup;
  private firebase_token: string;
  private colegio_token: string;
  private params: any;
  private loading: any;
  constructor
  (
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private native_http: HTTP,
    public routes: RoutesProvider,
    private fcm: FCM,
    public toasts: ToastProvider,
    private appPreferences:AppPreferences,
    public loadingCtrl: LoadingController
  )
  {
    this.init();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ForgotPasswordPage');
  }

  init()
  {
    this.set_params();
  }

  set_params()
  {
    this.form = this.formBuilder.group
    ({
      email: ['', Validators.email]
    });

    this.fcm.getToken().then(token =>
    {
      this.firebase_token = token;
    });

    this.colegio_token = this.navParams.get('colegio_token');
  }

  verify_form()
  {
    this.submit_form();
  }

  submit_form()
  {
    this.loading = this.loadingCtrl.create();
    this.params = this.form.value;
    this.params.token = this.firebase_token;
    this.params.colegio_token = this.colegio_token;
    this.loading.present();

    this.native_http.post( this.routes.password_recover_post_url, this.params, this.routes.header )
    .then( res =>
    {
      let response = JSON.parse( res.data );
      //console.log( response );
      this.loading.dismiss();
      if( response.error )
        this.toasts.show_message( response.message );
      else
      {
        //console.log( response );
        this.appPreferences.store('app', 'show_recover_modal', true );
        this.appPreferences.store('app', 'show_recover_modal_email', response.others.email );
        this.navCtrl.setRoot( LoginPage, { colegio_token: this.colegio_token } );
      }
    })
    .catch( err =>
    {
      this.loading.dismiss();
      console.log(err, err.error);
      this.toasts.show_message( "no_server_available" );
    });



  }

}
