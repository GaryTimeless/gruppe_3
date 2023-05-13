import { Injectable } from '@angular/core';
import { J2xOptions, j2xParser } from 'fast-xml-parser';
import * as he from 'he';

@Injectable({
  providedIn: 'root',
})
export class InputDataParseService {
  constructor() {}

  parseToXML(object: any): string {
    console.log('parseToXML', object);

    var defaultOptions: Partial<J2xOptions> = {
      attributeNamePrefix: '_',
      textNodeName: '#text',
      ignoreAttributes: false,
      cdataTagName: '__cdata',
      cdataPositionChar: '\\c',
      format: false,
      indentBy: '  ',
      supressEmptyNode: false,
      tagValueProcessor: (a: any) => he.encode(a, { useNamedReferences: true }),
      attrValueProcessor: (a: any) =>
        he.encode(a, { useNamedReferences: true }),
    };
    var parser = new j2xParser(defaultOptions);
    return parser.parse(object);
  }
}
