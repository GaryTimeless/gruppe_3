import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './data.service';
import { StepsModule } from './steps/steps.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'plannery-erp';
  siteLocale

  constructor(private route: ActivatedRoute, public dataService:DataService, private router:Router) {
    this.route.queryParams.subscribe((params) => {
      console.log('params', params);
      if(params.period){
        this.dataService.selectPeriodByParam(params.period)
      }
    });

    this.siteLocale = window.location.pathname.split('/')[1];
    console.log('SITE', this.siteLocale)
  }


  switchLang(lang:string){
    const path = window.location.pathname.split('/')
    path.shift()
    path.shift()

    const extension = this.dataService.currentPeriod?.name?'?period='+this.dataService.currentPeriod?.name :''
    switch(lang){
      case 'de':
        window.location.href = `/de/${path.join('/')}`;
      break;
      case 'en':
        window.location.href =`/en/${path.join('/')}`;
        // this.router.navigate([`/en/${window.location.pathname}`]);
      break;
      }
    }
}
