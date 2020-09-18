import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../../providers/config/routes";
import { ToastProvider } from "./../../../../providers/config/toasts";
import { AppPreferences } from '@ionic-native/app-preferences';

@IonicPage()
@Component({
  selector: 'page-horarios-examenes-detalle',
  templateUrl: 'horarios-examenes-detalle.html',
})
export class HorariosExamenesDetallePage 
{

  public horario_examen_id: string;
  public horario_examen: any;
  public response: any;
  public responsable_access_token:string = '';
  public params:any;
  public colegio_token: string;

  constructor
  (
    public navCtrl: NavController,
    public navParams: NavParams,
    private native_http: HTTP,
    public routes: RoutesProvider,
    public toasts: ToastProvider,
    public loadingCtrl: LoadingController,
    private appPreferences: AppPreferences
  ) 
  {
    this.init();
  }

  init()
  {
    this.fetch_colegio_token();
  }

  fetch_colegio_token()
  {
    this.appPreferences.fetch('app', 'colegio_token').then( (colegio_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
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
      
        this.set_params();
      
    });
  }

  set_params()
  {

    this.params = 
    {
      id: this.navParams.get('horario_examen_id'),
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token
    };
    //console.log("ON SET PARAMS===>", this.params);
    this.getAviso();
  }

  getAviso()
  {
    //console.log("GETTING", this.url);
    let loading = this.loadingCtrl.create();
    loading.present();
    
    if( this.routes.debug )
      console.log("SENDING===>", this.routes.horarios_examenes_detalle_url, this.params);
    
      this.native_http.get( this.routes.horarios_examenes_detalle_url, this.params, this.routes.header )
    .then(res => 
    {
        this.response = JSON.parse(res.data);

        if( this.routes.debug )
          console.log('GETTING===>', this.response);

        if (this.response.error)
          this.toasts.show_message( this.response.message );
        else
        {
          this.horario_examen = this.response.data.horario_examen;
        }
        loading.dismiss();
      })
      .catch(err => {
        loading.dismiss();
        this.toasts.show_message('no_server_available');

        if( this.routes.debug )
          console.log("ERROR: ", err, err.error);
          
      });

  }

}
