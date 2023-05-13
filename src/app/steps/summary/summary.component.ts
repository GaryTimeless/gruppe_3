import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  TuiHintModule,
  TuiNotificationsService,
  TuiTooltipModule,
} from '@taiga-ui/core';
import { DataService } from 'src/app/data.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { TuiScrollbarModule } from '@taiga-ui/core';
import { HttpClient } from '@angular/common/http';
import { InputDataParseService } from 'src/app/_services/input-data-parse.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent implements OnInit {
  constructor(
    public dataService: DataService,
    private router: Router,
    private readonly notifications: TuiNotificationsService,
    private http: HttpClient,
    private inputDataParseService: InputDataParseService
  ) {}

  ngOnInit(): void {
    // if (!this.dataService.currentPeriod) {
    //   this.router.navigate(['/steps/upload']);
    // }
  }

  export() {
    const xml = this.inputDataParseService.parseToXML({
      input: {
        qualitycontrol: { _type: 'no', _losequantity: 0, _delay: 0 },
        ...this.dataService.currentPeriod?.input,
      },
    });
    // console.log(xml)
    this.downloadURI(
      'data:text/xml;base64,' + btoa(xml),
      'input_periode' + this.dataService.currentPeriod?.name + '.xml'
    );
  }

  downloadURI(uri: string, name: string) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // loadFakeData() {
  //   if (this.dataService.currentPeriod) {
  //     this.http.get('/assets/xml/input.json').subscribe((res:any) => {
  //       console.log('load', res)
  //       this.dataService.currentPeriod!.input = res.input
  //     })
  //   }
  // }

  back = () => this.router.navigate(['/steps/order']);
}

export class TuiTooltipExample3 {}
