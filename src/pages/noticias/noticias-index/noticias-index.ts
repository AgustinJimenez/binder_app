import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { RoutesProvider } from "./../../../providers/config/routes";
import { ToastProvider } from "./../../../providers/config/toasts";
import { NoticiasDetallesPage } from "./../noticias-detalles/noticias-detalles";
import { AppPreferences } from '@ionic-native/app-preferences';
import { Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-noticias-index',
  templateUrl: 'noticias-index.html',
})
export class NoticiasIndexPage 
{
  @ViewChild(Content) content: Content;

  public response: any;
  public loading: any;
  public has_loaded: boolean = false;
  public responsable_id: any;
  public user: any;
  public noticias: Array<{ id: number ,titulo: string, contenido: string, fecha: any , archivo: string}> = [];
  public responsable_access_token:string = '';
  public params: any;
  public colegio_token: string;
  public show_loading_spinner: boolean = false;

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

  doInfinite( infiniteScroll ) 
  {
    //console.log( "doInfinite", infiniteScroll );
 
    //console.log('Begin async operation');

    setTimeout(() => 
    {
      this.load_noticias();

      //console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);

  }

  reload_content( refresher )
  {
    this.has_loaded = false;
    this.getNoticias( false );
    setTimeout(() => 
    {
      refresher.complete();
    }, 2000);


  }

  getNoticias(show_loading = true)
  {

    this.noticias = [];
    if( show_loading == true )
    {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
    
    this.load_noticias();

  }

  fech_access_data()
  {
    this.appPreferences.fetch('app', 'responsable_access_token').then( (responsable_access_token) =>
    {

      //console.log("here access token from app preference =====>"+responsable_access_token );
      if(responsable_access_token != null || responsable_access_token != '' || responsable_access_token != undefined)
        this.responsable_access_token = responsable_access_token;
      
        this.getNoticias();
      
    });
  }

  load_noticias()
  {
    this.params = 
    { 
      skip: this.noticias.length, 
      responsable_access_token: this.responsable_access_token,
      colegio_token: this.colegio_token
    };

    if( this.routes.debug )
      console.log( "SENDING===>", this.routes.noticias_index_url, this.params );
    
    this.native_http.get( this.routes.noticias_index_url, this.params, this.routes.header )
    .then(res =>
    {
      this.response = JSON.parse(res.data);
      
      if( this.routes.debug )
        console.log('GETTING===>', this.response );
      
      if (this.response.error)
        this.toasts.show_message(this.response.message);
      else
      {
        for (let noticia of this.response.data.noticias )
          this.noticias.push( noticia );
      }
        this.loading.dismiss();
        this.has_loaded = true;
        this.show_loading_spinner = false;
        //console.log("LOADED", this.noticias);
    })
    .catch(err =>
    {
      this.loading.dismiss();
      this.toasts.show_message('no_server_available');
      
      if( this.routes.debug )
        console.log("ERROR: ", err, err.error);
      
      this.has_loaded = true;
      this.show_loading_spinner = false;
    });
  }

  noticia_was_clicked( noticia )
  {
    this.navCtrl.push(NoticiasDetallesPage, { noticia_id: noticia.id, responsable_id: this.responsable_id });
  }

}
