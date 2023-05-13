import { Injectable } from '@angular/core';
import { Results } from '../_models/result-data.model';
import * as parser from '../../../node_modules/fast-xml-parser';

@Injectable({
  providedIn: 'root',
})
export class ResultDataParseService {
  constructor() {}

  parseFromXML(xml: string): Results | null {

    var options:Partial<parser.X2jOptions> = {
      attributeNamePrefix: '_',
      textNodeName: '#text',
      ignoreAttributes: false,
      ignoreNameSpace: false,
      allowBooleanAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      cdataTagName: '__cdata',
      cdataPositionChar: '\\c',
      parseTrueNumberOnly: false,
      numParseOptions: {
        hex: true,
        leadingZeros: true,
      },
      arrayMode: false, //"strict"
      // attrValueProcessor: (val:any, attrName:any) =>
      //   he.decode(val, { isAttributeValue: true }), //default is a=>a
      // tagValueProcessor: (val:any, tagName:any) => he.decode(val), //default is a=>a
      // stopNodes: ['parse-me-as-string'],
    };

    if (parser.validate(xml) === true) {
      const res = parser.parse(xml, options);
      // console.log(res);
      return res.results as Results;
    }
    return null;
  }
}
