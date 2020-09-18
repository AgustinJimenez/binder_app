import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../providers/config/routes";
import { ToastProvider } from "./../../../providers/config/toasts";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Device } from '@ionic-native/device';
import { FCM } from '@ionic-native/fcm';
import { Platform } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';
import { LoginPage } from './../login/login';

@IonicPage()
@Component({
  selector: 'page-registrarse',
  templateUrl: 'registrarse.html',
})
export class RegistrarsePage
{
  @ViewChild('nombreInput') nombre_input

  private registro_form : FormGroup;

  public grado_options :
  {
    options:
    {
      key: string,
      value: string,
    }[]
  };

  public grados_searched:boolean = false;
  public firebase_token: string;
  public platform: string;
  public colegio_token: string = '';

  constructor
  (
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private native_http: HTTP,
    public routes: RoutesProvider,
    public toasts: ToastProvider,
    private device: Device,
    private fcm: FCM,
    private appPreferences:AppPreferences,
    public plt: Platform
  )
  {
    this.init();

  }

  init()
  {
    this.set_variables();
  }

  set_variables()
  {
    this.colegio_token = this.navParams.get('colegio_token');
    this.grados_searched = false;
    this.registro_form = this.formBuilder.group
    ({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      tipo_encargado: ['tutor', Validators.required],
      secciones_ids: [[], Validators.required],
      telefono: ['', Validators.required],
    });
    this.fetch_firebase_token();
    this.grado_options = {options:[]};
    if( this.plt.is('android') )
      this.platform = 'android';
    else if( this.plt.is('ios') )
      this.platform = 'ios';
    else if( this.plt.is("windows") )
      this.platform = 'windows';
    else
      this.platform = 'other';

      this.search_grados();
  }

  fetch_firebase_token()
  {
    this.fcm.getToken().then(token =>
      {
        this.firebase_token = token;
      });
  }

  init_focus()
	{

    setTimeout(() => {
      this.nombre_input.setFocus();
    }, 2500);

  }

  verify_form()
  {
    if( this.registro_form.value.password != this.registro_form.value.password_confirmation  )
      this.toasts.show_message( "Las contraseñas introducidas no coinciden. " );
    else
      this.registro_form_submited();
  }

  save_colegio_token()
  {
    this.appPreferences.store('app', 'colegio_token', this.colegio_token);
  }

  registro_form_submited()
  {
    let loading = this.loadingCtrl.create();
    let url = this.routes.registrar_post_url;
    let params = this.registro_form.value;

    if( params.secciones_ids.length > 0 )
      params.secciones_ids = this.ArrayToObject( params.secciones_ids );


    params.device_info =
    {
      token: this.firebase_token,
      isVirtual:this.device.isVirtual,
      manufacturer:this.device.manufacturer,
      model:this.device.model,
      serial:this.device.serial,
      uuid:this.device.uuid,
      version:this.device.version,
      platform: this.platform
    };
    params.colegio_token = this.colegio_token;

    loading.present();
    
    if( this.routes.debug )
      console.log("SENDING===>", url, params);

    this.native_http.post(url, params, this.routes.header )
    .then( res =>
    {
      let response = JSON.parse( res.data );

      if( this.routes.debug )
        console.log("GETTING===>", response);

      loading.dismiss();
      if( response.error )
        this.toasts.show_message( response.message );
      else
      {
        this.appPreferences.store('app', 'show_pendiente_aprobacion_message', true );
        this.save_colegio_token();
        this.navCtrl.setRoot( LoginPage, { colegio_token: this.colegio_token });
      }
    })
    .catch( err =>
    {
      loading.dismiss();

      if( this.routes.debug )
        console.log(err, err.error);

      this.toasts.show_message( "no_server_available" );
    });

  }

  search_grados()
  {
    let loading = this.loadingCtrl.create();
    let url = this.routes.registrar_get_url;
    loading.present();
    this.native_http.get( url , { colegio_token: this.colegio_token }, {'Content-Type': 'application/json'})
    .then( res =>
    {
      let response = JSON.parse( res.data );

      if( this.routes.debug )
        console.log( "GETTING===>", response );

      this.grado_options.options = [];

      if( response.error )
        this.toasts.show_message( response.message );
      else
        for (let grado of response.grados)
          for (let seccion of grado.secciones)
            this.grado_options.options.push({ key: grado.nombre + " " + seccion.nombre , value: seccion.id })

      loading.dismiss();
      this.init_focus();

      this.grados_searched = true;

    })
    .catch( err =>
    {
      loading.dismiss();
      this.toasts.show_message('no_server_available');

      if( this.routes.debug )
        console.log("ERROR: ", err);

      this.grados_searched = true;
    });


  }



  ArrayToObject(arr)
  {
    let rv = {};
    for (let i = 0; i < arr.length; ++i)
      rv[i] = arr[i];

    return rv;
  }


}
