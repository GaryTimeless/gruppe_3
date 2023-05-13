import { Component, OnInit } from '@angular/core';
import { ResultDataParseService } from '../_services/result-data-parse.service';
import { HttpClient } from '@angular/common/http';
import { InputDataParseService } from '../_services/input-data-parse.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    private inputDataParseService: InputDataParseService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  

  parseInputToXML() {
    this.http.get('/assets/xml/input.json').subscribe((res) => {
      const xml = this.inputDataParseService.parseToXML(res);
      // console.log(xml)
      this.downloadURI('data:text/xml;base64,' + btoa(xml), 'res.xml');
    });
  }

  downloadURI(uri: string, name: string) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
