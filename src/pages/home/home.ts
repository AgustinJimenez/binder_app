import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../providers/config/routes";
import { ToastProvider } from "./../../providers/config/toasts";
import { AvisoDetallesPage } from "./../avisos/aviso-detalles/aviso-detalles";
import { NoticiasDetallesPage } from "./../noticias/noticias-detalles/noticias-detalles";
import { AppPreferences } from '@ionic-native/app-preferences';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage
{
  public response: any;
  public loading: any;
  public has_loaded: boolean = false;
  public last_noticia: { id: string, titulo: string, contenido: string, fecha: string, archivo: any };
  public avisos_no_leidos: Array<any> = [];
  public params: any;
  public responsable_access_token:string = ''; 
  public param_access_token:string;
  public colegio_token: string;

  constructor
  (
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private native_http: HTTP,
    public routes: RoutesProvider,
    public toasts: ToastProvider,
    public loadingCtrl: LoadingController,
    private appPreferences: AppPreferences
  )
  {
  }

  ionViewCanEnter()
  {
    this.init();
  }

  init()
  {
    this.setVariables();
  }

  reload_avisos_no_leidos_content( refresher )
  {
    this.has_loaded = false;
    this.getApiDatas( false );
    setTimeout(() => 
    {
      refresher.complete();
    }, 2000);
  }

  setVariables()
  {
    this.responsable_access_token = this.navParams.get('responsable_access_token');
    this.colegio_token = this.navParams.get('colegio_token');
    this.avisos_no_leidos = [];
    this.last_noticia;
    this.fech_access_data();
  }

  fech_access_data()
  {
    this.appPreferences.fetch('app', 'responsable_access_token').then( (responsable_access_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if(responsable_access_token != null || responsable_access_token != '' || responsable_access_token != undefined)
        this.responsable_access_token = responsable_access_token;
      this.fetch_colegio_token();
    });
  }

  fetch_colegio_token()
  {
    this.appPreferences.fetch('app', 'colegio_token').then( (colegio_token) =>
    {
      //console.log("here access token from app preference =====>"+responsable_access_token );
      if
      (
        colegio_token != null ||
        colegio_token != '' ||
        colegio_token != undefined
      )
      {
        this.colegio_token = colegio_token;
        this.getApiDatas();
      }
    });
  }

  


  getApiDatas( show_loading = true )
  {
    if( show_loading )
    {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
    this.avisos_no_leidos = [];
    this.loadApiDatas();
  }

  loadApiDatas()
  {
    this.params = 
    { 
      skip: this.avisos_no_leidos.length, 
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token 
    };

    if( this.routes.debug )
      console.log("SENDING===>", this.routes.inicio_url, this.params );

    this.native_http.get( this.routes.inicio_url , this.params, this.routes.header )
    .then(res =>
    {
      this.response = JSON.parse(res.data);

      if( this.routes.debug )
        console.log('GETTING', this.response );

      if ( this.response.error )
        this.toasts.show_message(this.response.message);
      else
      {
        this.last_noticia = this.response.data.last_noticia;

        for (let aviso of this.response.data.avisos_no_leidos )
          this.avisos_no_leidos.push(aviso);
          
      }
      this.loading.dismiss();
      this.has_loaded = true;
    })
    .catch(err =>
    {
      this.has_loaded = true;
      this.loading.dismiss();
      this.toasts.show_message('no_server_available');
      
      if( this.routes.debug )
        console.log("ERROR: ", err, err.error);
    });
  }

  last_noticia_was_clicked( noticia )
  {
    if( this.last_noticia != null )
      this.navCtrl.push( NoticiasDetallesPage, { noticia_id: this.last_noticia.id });
  }

  aviso_was_clicked(aviso)
  {
    if( aviso != null )
      this.navCtrl.push(AvisoDetallesPage, { aviso_id: aviso.id, seccion_id: aviso.relaciones_secciones[0].seccion_id });
  }

  doInfinite( ): Promise<any>
  {
    return new Promise( (resolve) => 
    {

      setTimeout(() => 
      {
        this.loadApiDatas();

        resolve();
        
      }, 1000);
      

    } );

  }

  

}
