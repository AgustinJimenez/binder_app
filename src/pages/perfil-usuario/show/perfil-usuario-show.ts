import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../providers/config/routes";
import { ToastProvider } from "./../../../providers/config/toasts";
import { Keyboard } from '@ionic-native/keyboard';
import { PerfilUsuarioEditPage } from '../edit/perfil-usuario-edit';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Events } from 'ionic-angular';
import { SeleccionColegioPage } from "../../seleccion-colegio/seleccion-colegio";
@IonicPage()
@Component({
  selector: 'page-perfil-usuario-show',
  templateUrl: 'perfil-usuario-show.html',
})
export class PerfilUsuarioShowPage
{
  url:string;
  responsable:any;
  response: any;
  responsable_access_token: string = '';
  colegio_token: string; 
  params: any;
  loading: any;

  constructor
  (
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private native_http: HTTP,
    public routes: RoutesProvider,
    public toasts: ToastProvider,
    public keyboard: Keyboard,
    private appPreferences: AppPreferences,
    public events: Events
  )
  {
    this.init();
  }
  
  init()
  {
    this.fetch_colegio_token();
  }
/*
  ionViewDidLoad() {
    //console.log('ionViewDidLoad PerfilUsuarioShowPage');
  }
*/
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

  logout()
  {
    this.keyboard.close();
    this.appPreferences.remove('app', 'responsable_access_token');
    this.appPreferences.remove('app', 'colegio_token');
    this.navCtrl.setRoot( SeleccionColegioPage );
  }

  get_usuario()
  {
    this.loading = this.loadingCtrl.create();
    this.params = 
    { 
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token
    };
    
    this.loading.present();

    if( this.routes.debug )
      console.log("SENDING===>", this.routes.perfil_show_get, this.params );

    this.native_http.get( this.routes.perfil_show_get , this.params, this.routes.header )
    .then( res =>
    {
      this.response = JSON.parse( res.data );
      
      if( this.routes.debug )
        console.log("RESPONSE===>", this.response);
      
      if( this.response.error )
        this.toasts.show_message( this.response.message );
      else
        this.responsable = this.response.others.responsable;

      this.loading.dismiss();

    })
    .catch( err =>
    {
      this.loading.dismiss();
      this.toasts.show_message('no_server_available');
      
      if( this.routes.debug )
        console.log("ERROR: ", err);
    });


  }

  go_to_perfil_usuario_edit()
  {
    this.keyboard.close();
    this.navCtrl.push(PerfilUsuarioEditPage);
  }

}
