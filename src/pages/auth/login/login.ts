import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RoutesProvider } from './../../../providers/config/routes';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RegistrarsePage } from './../registrarse/registrarse';
import { Keyboard } from '@ionic-native/keyboard';
import { AppPreferences } from '@ionic-native/app-preferences';
import { HTTP } from '@ionic-native/http';
import { ToastProvider } from "./../../../providers/config/toasts";
import { HomePage } from '../../home/home';
import { ForgotPasswordPage } from "./../forgot-password/forgot-password";
import { SeleccionColegioPage } from '../../seleccion-colegio/seleccion-colegio';
import { FCM } from '@ionic-native/fcm';
import { CustomDeviceProvider } from "./../../../providers/device";
import { Platform } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage
{
  @ViewChild('emailInput') usuario_input
  private login_form : FormGroup;
  public check_colegio_key_url: string = '';
  public response: any;
  public responsable_access_token: string;
  public login_url: string;
  public login_colegio_img_url: string = 'assets/imgs/blank.png';
  public colegio_token: string;
  public params: any;
  public device_token: string;
  public device_info: any;
  public loading: any;
  public colegio_nombre: string = '';
  public last_email_typed: string = '';
  constructor(
    public navCtrl: NavController,
    private fcm: FCM,
    public navParams: NavParams,
    public rp: RoutesProvider,
    private formBuilder: FormBuilder,
    public keyboard: Keyboard,
    private appPreferences: AppPreferences,
    private native_http: HTTP,
    public toasts: ToastProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public device: CustomDeviceProvider,
    public platform: Platform
  )
  {
    this.init();
  }

  init()
  {
    this.fetch_last_email_typed();
    this.set_variables();
    this.fetch_firebase_token();
    this.fetch_device_info();
    //this.init_focus();
  }
  fetch_last_email_typed()
  {
    this.appPreferences.fetch('app','last_email_typed').then(( last_email_typed ) =>
    {

      if( last_email_typed != null || last_email_typed != undefined || last_email_typed != '' )
        this.last_email_typed = last_email_typed;

        //console.log("LAST EMAIL TYPED FETCHED==>", this.last_email_typed );

        this.set_default_form_values();
      
    });
  }

  fetch_firebase_token()
  {
    this.fcm.getToken().then(token =>
    {
      this.device_token = token;
    });
  }

  fetch_device_info()
  {
    this.device_info = this.device.getInfo();//.getInfo()
  }

  go_to_seleccion_colegio()
  {
    this.keyboard.close();
    this.navCtrl.setRoot(SeleccionColegioPage);
  }

  set_default_form_values()
  {
    this.login_form = this.formBuilder.group
    ({
      email: [ this.last_email_typed, Validators.required],
      password: ['', Validators.required],
    });
  }

  set_variables()
  {
    this.login_colegio_img_url = this.rp.login_colegio_img_url;
    this.appPreferences.remove('app', 'responsable_access_token');
    this.keyboard.close();
    this.colegio_token = this.navParams.get("colegio_token");
    this.set_default_form_values();
    this.get_colegio_logo();
  }

  get_colegio_logo()
  {
    this.params = { colegio_token: this.colegio_token };

    if( this.rp.debug )
      console.log("SENDING===>", this.login_colegio_img_url, this.params);
    
    this.native_http.get(this.login_colegio_img_url, this.params, this.rp.header)
    .then(res =>
    {
      this.response = JSON.parse(res.data);

      if( this.rp.debug )
        console.log( "GETTING===>", this.response );

      if (this.response.error)
        this.toasts.show_message(this.response.message);
      else
      {
        this.login_colegio_img_url = (this.response.data.imagen_url != null) ? this.response.data.imagen_url : '/assets/imgs/blank.png';
        this.save_colegio_logo_img();
      }    
    })
    .catch(err =>
    {
      this.toasts.show_message('no_server_available');

      if( this.rp.debug )
        console.log("ERROR: ", err, err.error);

    });
  }

  ionViewDidLoad()
  {
    this.check_estado_aprobacion();
    this.if_show_recover_modal();
  }


  check_estado_aprobacion()
  {
    this.appPreferences.fetch('app','show_pendiente_aprobacion_message').then(( show_pendiente ) =>
    {

      if( show_pendiente )
        this.alertCtrl.create
        ({
          title: 'USUARIO REGISTRADO',
          message: 'Gracias por registrarte. Una vez aprobado será notificado.',
          buttons:
          [{
              text: 'Cerrar',
              role: 'cancel',
              handler: () => {this.appPreferences.store('app','show_pendiente_aprobacion_message', false );}
          }]
        })
        .present();

    });
  }

  if_show_recover_modal()
  {
    let email_to_show = "";
    this.appPreferences.fetch('app', 'show_recover_modal_email' ).then(( show_recover_modal_email ) =>
    {
      if( show_recover_modal_email != null )
        email_to_show = " (" + show_recover_modal_email + ") ";
    });

    this.appPreferences.fetch('app', 'show_recover_modal' ).then(( show_recover_modal ) =>
    {
      if( show_recover_modal )
        this.alertCtrl.create
        ({
          title: 'Olvide mi Contraseña',
          message: 'Se enviara un correo a su email ' + email_to_show + ' para cambiar su contraseña.',
          buttons:
          [{
              text: 'Cerrar',
              role: 'cancel',
              handler: () => {this.appPreferences.store('app','show_recover_modal', false );}
          }]
        })
        .present();
    });
  }


  

  init_focus()
  {

    setTimeout(() =>
    {
        this.usuario_input.setFocus();
    }, 2500);

    this.keyboard.show();

  }

  login_form_submited()
  {
    this.loading = this.loadingCtrl.create();
    this.params = this.login_form.value;
    this.params.colegio_token = this.colegio_token;
    this.params.device_token = this.device_token;
    this.params.device_info = this.device_info;

    this.loading.present();
    
    if( this.rp.debug )
      console.log("SENDING===>", this.rp.login_post_url, this.params );
    
    this.native_http.post( this.rp.login_post_url, this.params, this.rp.header )
    .then( res =>
    {
      let response = JSON.parse( res.data );

      if( this.rp.debug )
        console.log("GETTING===>", response);

      if( response.error )
        this.toasts.show_message( response.message );
      else
      {
          this.appPreferences.store('app','responsable_access_token', response.others.responsable_access_token );
          this.responsable_access_token = response.others.responsable_access_token ;
          this.colegio_nombre = response.others.colegio_nombre
          this.go_to_home();
      }

      this.loading.dismiss();
    })
    .catch( err =>
    {
      this.loading.dismiss();

      if( this.rp.debug )
        console.log(err, err.error, 'at login_form_submited()');

      this.toasts.show_message( "no_server_available" );
    });
  }

  registrarse_was_clicked()
  {
    this.keyboard.close();
    this.navCtrl.push( RegistrarsePage, { colegio_token: this.colegio_token } );
  }

  olvide_password_was_clicked()
  {
    this.keyboard.close();
    this.navCtrl.push( ForgotPasswordPage, { responsable_access_token : this.responsable_access_token, colegio_token: this.colegio_token } );
  }

  save_colegio_token()
  {
    this.appPreferences.store('app', 'colegio_token', this.colegio_token);
  }

  save_las_email_typed()
  {
    //console.log("SAVING LAST EMAIL TYPED==>", this.params.email );
    this.appPreferences.store('app', 'last_email_typed', this.params.email );
  }

  save_colegio_logo_img()
  {
    this.appPreferences.store('app', 'colegio_logo_url', this.login_colegio_img_url);
  }

  save_colegio_nombre()
  {
    this.appPreferences.store('app', 'colegio_nombre', this.colegio_nombre );
  }

  go_to_home()
  {
    this.save_colegio_token();
    this.save_colegio_nombre();
    this.save_las_email_typed();
    this.keyboard.close();
    this.navCtrl.setRoot(HomePage, { responsable_access_token : this.responsable_access_token, colegio_token: this.colegio_token });
  }

}
