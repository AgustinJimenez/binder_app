import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../providers/config/routes";
import { ToastProvider } from "./../../../providers/config/toasts";
import { Keyboard } from '@ionic-native/keyboard';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ParserProvider } from './../../../providers/parser';
import { FCM } from '@ionic-native/fcm';
import { CustomDeviceProvider } from './../../../providers/device';
import { PerfilUsuarioShowPage } from './../show/perfil-usuario-show';
import { AppPreferences } from '@ionic-native/app-preferences';

@IonicPage()
@Component({
  selector: 'page-perfil-usuario-edit',
  templateUrl: 'perfil-usuario-edit.html',
})
export class PerfilUsuarioEditPage
{
  @ViewChild('nombreInput') nombre_input
  private response: any;
  form: FormGroup;
  responsable: any;
  private responsable_id: string;
  private device_info: any;
  public responsable_access_token:string = '';
  public params: any;
  public loading: any;
  public colegio_token: string;
  private grado_options :
  {
    options:
    {
      key: string,
      value: string,
    }[]
  };

  constructor
  (
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private native_http: HTTP,
    public routes: RoutesProvider,
    public toasts: ToastProvider,
    public keyboard: Keyboard,
    private formBuilder: FormBuilder,
    private pv_parser: ParserProvider,
    private fcm: FCM,
    public device: CustomDeviceProvider,
    private appPreferences: AppPreferences
  )
  {
    this.init();
  }

  init()
  {
    this.set_device_info();
    this.form = this.set_form_builder();
    this.grado_options = { options: [] };
    this.fetch_colegio_token();
  }

  fetch_colegio_token()
  {
    this.appPreferences.fetch('app', 'colegio_token').then( (colegio_token) =>
    {

      //console.log("here colegio token from app preference =====>"+colegio_token );
      if(colegio_token != null || colegio_token != '' || colegio_token != undefined)
        this.colegio_token = colegio_token;
      
      this.fetch_access_data();
      
    });
  }

  set_device_info()
  {
    this.device_info = this.device.getInfo();
    this.fcm.getToken().then(token => { this.device_info.token = token; });
  }

  

  fetch_access_data()
  {
    this.appPreferences.fetch('app', 'responsable_access_token').then( (responsable_access_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if(responsable_access_token != null || responsable_access_token != '' || responsable_access_token != undefined)
        this.responsable_access_token = responsable_access_token;
      
        this.get_usuario();
      
    });
  }

  init_focus() {

    setTimeout(() => {
      this.nombre_input.setFocus();
    }, 2500);

  }

  verify_form()
  {
    this.submit();
  }

  get_usuario()
  {
    this.params = 
    { 
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token
    };

    this.loading = this.loadingCtrl.create();
    this.loading.present();
    
    if( this.routes.debug )
      console.log( "URL====>", this.routes.perfil_edit_get, this.params );
    
    this.native_http.get( this.routes.perfil_edit_get, this.params, this.routes.header )
    .then(res =>
    {
      this.response = JSON.parse(res.data);

      if( this.routes.debug )
        console.log( "RESPONSE===>", this.response );

      if (this.response.error)
        this.toasts.show_message(this.response.message);
      else
      {

        for (let grado of this.response.others.grados)
          for (let seccion of grado.secciones)
            this.grado_options.options.push({ key: grado.nombre + " " + seccion.nombre, value: seccion.id })

        this.responsable = this.response.others.responsable;

        this.form = this.set_form_builder
        (
          this.responsable.nombre,
          this.responsable.apellido,
          this.responsable.user.email,
          this.responsable.tipo_encargado,
          this.response.others.suscripciones_ids,
          this.responsable.telefono
        );
      }
      this.loading.dismiss();

    })
    .catch(err =>
    {
      this.loading.dismiss();
      this.toasts.show_message('no_server_available');

      if( this.routes.debug )
        console.log("ERROR: ", err);

    });


  }


  submit()
  {
    this.loading = this.loadingCtrl.create();
    this.params = this.form.value;

    if ( this.params.secciones_ids.length > 0)
      this.params.secciones_ids = this.pv_parser.ArrayToObject( this.params.secciones_ids );

    this.params.device_info = this.device_info;
    this.params.responsable_id = this.responsable_id;
    this.params.responsable_access_token = this.responsable_access_token;
    this.params.colegio_token = this.colegio_token;

    this.loading.present();
    this.native_http.post( this.routes.perfil_edit_put, this.params, { 'Content-Type': 'application/json' })
    .then(res =>
    {
      this.response = JSON.parse(res.data);

      if( this.routes.debug )
        console.log("RESPONSE==>", this.response);

      this.loading.dismiss();
      if( this.response.error )
        this.toasts.show_message( this.response.message );
      else {
        this.toasts.show_message("Cambios realizados correctamente.");
        this.navCtrl.setRoot(PerfilUsuarioShowPage);
      }
    })
    .catch(err =>
    {
      this.loading.dismiss();

      if( this.routes.debug )
        console.log(err, err.error);
      //this.toasts.show_message( err );
    });
  }

  set_form_builder(nombre = '', apellido = '', email = '', tipo_encargado = '', secciones_ids = [], telefono = '')
  {
    return this.formBuilder.group
    ({
      nombre: [nombre, Validators.compose([Validators.required])],
      apellido: [apellido, Validators.compose([Validators.required])],
      email: [email, Validators.compose([Validators.required, Validators.email])],
      tipo_encargado: [tipo_encargado, Validators.compose([Validators.required])],
      secciones_ids: [secciones_ids, Validators.required],
      telefono: [telefono, Validators.required],
    });
  }
/*
  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilUsuarioEditPage');
  }
  */

}
