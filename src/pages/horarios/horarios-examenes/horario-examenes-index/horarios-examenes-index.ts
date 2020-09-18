import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { AppPreferences } from '@ionic-native/app-preferences';
import { ToastProvider } from "./../../../../providers/config/toasts";
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../../providers/config/routes";
import { HorariosExamenesDetallePage } from './../horario-examenes-detalles/horarios-examenes-detalle';

@IonicPage()
@Component({
  selector: 'page-horarios-examenes-index',
  templateUrl: 'horarios-examenes-index.html',
})
export class HorariosExamenesIndexPage 
{

  public seccion_id: string;
  public nombre_grado_seccion: string;
  public colegio_token: string;
  public responsable_access_token: string;
  public loading: any;
  public horarios_examenes: Array<any> = [];
  public has_loaded: boolean = false;
  public params: any;
  public response: any;

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
    this.setVariables();
  }

  setVariables()
  {
    if( this.navParams.get('seccion_id') != undefined )
      this.seccion_id = this.navParams.get('seccion_id');
    
    if( this.navParams.get('nombre_grado_seccion') != undefined )
      this.nombre_grado_seccion = this.navParams.get('nombre_grado_seccion');
    //console.log('SECCION ID UPDATED==>', this.id_seccion);
    this.fetch_colegio_token();
  }

  fetch_colegio_token()
  {
    this.appPreferences.fetch('app', 'colegio_token').then( (colegio_token) =>
    {

      //console.log("here colegio token from app preference =====>"+colegio_token );
      if(colegio_token != null || colegio_token != '' || colegio_token != undefined)
        this.colegio_token = colegio_token;
      
      this.fecth_access_data();
      
    });
  }

  fecth_access_data()
  {
    this.appPreferences.fetch('app', 'responsable_access_token').then( (responsable_access_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if(responsable_access_token != null || responsable_access_token != '' || responsable_access_token != undefined)
        this.responsable_access_token = responsable_access_token;
      
        this.getElements();
      
    });
  }

  getElements(show_loading = true)
  {
    this.horarios_examenes = [];
    if( show_loading )
    {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
    this.load_elements();

  }

  load_elements()
  {
    this.params = 
    {
      skip: this.horarios_examenes.length,
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token,
      seccion_id: this.seccion_id
    }; 

    if( this.routes.debug )
      console.log("SENDING=>", this.routes.horarios_examenes_index_url, this.params );

    this.native_http.get( this.routes.horarios_examenes_index_url , this.params, this.routes.header )
    .then(res =>
    {
      this.response = JSON.parse(res.data);

      if( this.routes.debug )
        console.log('GETTING==>', this.response );

      if (this.response.error)
        this.toasts.show_message(this.response.message);
      else
      {
        for (let horario_examen of this.response.data.horarios_examenes )
          this.horarios_examenes.push( horario_examen );
      }
      this.loading.dismiss();
      this.has_loaded = true;
    })
    .catch(err =>
    {
      this.loading.dismiss();
      this.has_loaded = true;
      this.toasts.show_message('no_server_available');
      
      if( this.routes.debug )
        console.log("ERROR: ", err, err.error);
    
    });
  }

  reload_content( refresher )
  {
    this.has_loaded = false;
    this.getElements( false );
    setTimeout(() => 
    {
      refresher.complete();
    }, 2000);


  }

  doInfinite( ): Promise<any>
  {
    return new Promise( (resolve) => 
    {

      setTimeout(() => 
      {
        this.load_elements();

        resolve();
        
      }, 500);
      

    } );

  }

  horario_examen_was_clicked( horario_examen )
  {
    this.navCtrl.push( HorariosExamenesDetallePage, { horario_examen_id: horario_examen.id } );
  }

}
