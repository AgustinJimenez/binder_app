import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../providers/config/routes";
import { ToastProvider } from "./../../../providers/config/toasts";
import { AppPreferences } from '@ionic-native/app-preferences';

@IonicPage()
@Component({
  selector: 'page-noticias-detalles',
  templateUrl: 'noticias-detalles.html',
})
export class NoticiasDetallesPage
{

  public noticia_id: string;
  public noticia: 
  { id: number, titulo: string, fecha: string, contenido: string, archivo: string }
    = 
  { id: null, titulo: '', fecha: '', contenido: '', archivo: null };
  public response: any;
  public user: any;
  public has_loaded: boolean = false;
  public responsable_access_token:string = '';
  public params: any;
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

      //console.log("here colegio token from app preference =====>"+colegio_token );
      if(colegio_token != null || colegio_token != '' || colegio_token != undefined)
        this.colegio_token = colegio_token;
      
      this.fech_access_data();
      
    });
  }

  fech_access_data()
  {
    this.appPreferences.fetch('app', 'responsable_access_token').then( (responsable_access_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if(responsable_access_token != null || responsable_access_token != '' || responsable_access_token != undefined)
        this.responsable_access_token = responsable_access_token;
      
        this.setParams();
      
    });
  }

  setParams()
  {
    this.params = 
    {
      noticia_id: this.navParams.get('noticia_id'),
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token
    }
    //console.log(this.url);
    this.getNoticia();
  }

  getNoticia()
  {
    //console.log("GETTING", this.noticias_detalle_url);
    let loading = this.loadingCtrl.create();
    loading.present();

    if( this.routes.debug )
        console.log('SENDING===>', this.routes.noticias_noticia_detalle_url, this.params );

    this.native_http.get( this.routes.noticias_noticia_detalle_url , this.params, { 'Content-Type': 'application/json' })
    .then(res =>
    {
      this.response = JSON.parse(res.data);

      if( this.routes.debug )
        console.log('GETTING===>', this.response);

      if (this.response.error)
        this.toasts.show_message(this.response.message);
      else if( this.response.data.noticia != undefined )
      {
        this.noticia = {
                        id: this.response.data.noticia.id,
                        titulo: this.response.data.noticia.titulo,
                        fecha: this.response.data.noticia.fecha,
                        contenido: this.response.data.noticia.contenido,
                        archivo: this.response.data.noticia.archivo
                      };
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
