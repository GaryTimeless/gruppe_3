import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent {
  readonly steps = [
    { route: '/steps/upload', label: $localize`:@@Upload_Step:Import` },
    {
      route: '/steps/selldirect',
      label: $localize`:@@Selldirect_Step:Direktverkauf`,
    },
    { route: '/steps/sellwish', label: $localize`:@@Sellwish_Step:Prognose` },
    {
      route: '/steps/planning',
      label: $localize`:@@Planning_Step:Disposition`,
    },
    {
      route: '/steps/production',
      label: $localize`:@@Production_Step:Auftragspriorisierung`,
    },
    {
      route: '/steps/workingtime',
      label: $localize`:@@Workingtime_Step:Kapazitätsplanung`,
    },
    {
      route: '/steps/order',
      label: $localize`:@@Order_Step:Bestellverwaltung`,
    },
    {
      route: '/steps/summary',
      label: $localize`:@@Summary_Step:Zusammenfassung`,
    },
  ];
  activeItemIndex: number = -1;

  public isMobile =
    window.screen.width < 568 || window.innerWidth < window.innerHeight;

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.isMobile =
      event.target.innerWidth < 568 ||
      event.target.innerWidth < event.target.innerHeight;
  }

  constructor(
    public dataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        setTimeout(() => {
          const path = val.url?.split('?')?.[0];
          console.log('routeChanged', path);
          if (path) {
            const index = this.steps.findIndex((x) => x.route === path);
            if (index > -1) {
              this.activeItemIndex = index;
              this.cdr.detectChanges();
            }
          }
        });
      }
    });

    this.dataService.currentPeriodObservable.subscribe((res) => {
      if (res) {
        this.cdr.detectChanges();
      }
    });
  }
}
