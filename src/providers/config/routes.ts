import { Injectable } from '@angular/core';

@Injectable()
export class RoutesProvider
{
  
  // api_url = 'http://192.168.0.12:8000/api/v1'; 
  // api_url = 'http://192.168.0.111:8000/api/v1';
  api_url = 'http://192.168.0.8:8000/api/v1';

  header = { 'Content-Type': 'application/json' };

  debug: boolean = true ;

  /* ===============================================RUTAS============================================================ */
  public seleccion_colegio:string = this.api_url + "/colegio/search" ;
  
  public inicio_url:string = this.api_url + "/inicio?" ;

  public login_post_url:string  = this.api_url + "/login"  ;
  public login_check_colegio_token_url:string  = this.api_url + "/login/check_colegio_token?"  ;
  public login_colegio_img_url: string = this.api_url + "/login/get_logo";

  public registrar_get_url:string  = this.api_url + "/registrar?"  ;
  public registrar_post_url:string  = this.api_url + "/registrar?"  ;

  public password_recover_post_url:string  = this.api_url + "/password/recover?"  ;

  public perfil_show_get:string  = this.api_url + "/perfil/show?" ;
  public perfil_edit_get:string  = this.api_url + "/perfil/edit?" ;
  public perfil_edit_put:string  = this.api_url + "/perfil/edit?" + "&_method=PUT" ;

  public avisos_side_menu_get:string  = this.api_url + "/avisos/side_menu?" ;
  public avisos_index_get:string  = this.api_url + "/avisos/index?" ;
  public avisos_aviso_get:string  = this.api_url + "/avisos/aviso?" ;
  public avisos_visto_post:string  = this.api_url + '/avisos/visto?' ;

  public noticias_index_url:string = this.api_url + "/noticias/index?" ;
  public noticias_noticia_detalle_url:string = this.api_url + "/noticias/noticia/detalle?" ;

  public horarios_clases_index_url: string = this.api_url + "/horarios/clases/index?" ;
  public horarios_examenes_index_url: string = this.api_url + "/horarios/examenes/index?" ;
  public horarios_examenes_detalle_url: string = this.api_url + "/horarios/examenes/detalle" ;
  public horarios_clases_detalle_url: string = this.api_url + "/horarios/clases/detalle" ;
  

  public contacto_url: string = this.api_url + "/contacto?" ;
  /* =========================================================================================================== */

  get_random_img(w:number = 200, h:number = 200):string
  {
    return "http://lorempixel.com/"+w+"/"+h+"/";
  }

  

}
