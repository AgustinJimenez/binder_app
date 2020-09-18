import { Injectable } from '@angular/core';

@Injectable()
export class ParserProvider
{

  ArrayToObject(array_element)
  {
    let tmp_obj = {};
    for (let i = 0; i < array_element.length; ++i)
      tmp_obj[i] = array_element[i];

    return tmp_obj;
  }

  ArrayToJsonStringify( array_element )
  {
    return JSON.stringify( this.ArrayToObject( array_element ) );
  }

}
