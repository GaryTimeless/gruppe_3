import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { DataService } from 'src/app/data.service';
import { Production } from 'src/app/_models/input-data.model';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionComponent implements OnInit {
  defaultOrder = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 26, 49, 54,
    29, 50, 55, 30, 51, 56, 31, 1, 2, 3,
  ];
  errors: any = {};
  enabled?: Production[];
  splittedMap: any = {};

  constructor(
    public dataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}

  ngOnInit(): void {
    if (!this.dataService.currentPeriod) {
      this.router.navigate(['/steps/upload']);
    }

    this.dataService.currentPeriodObservable.subscribe((res) => {
      if (res && this.dataService.currentPeriod) {
        console.log(res.productionorders);
        const map: { [key: string]: Production } = {};
        for (let a of [
          ...res.productionorders.disposition1,
          ...res.productionorders.disposition2,
          ...res.productionorders.disposition3,
        ]) {
          if (!map[a._id]) {
            map[a._id] = { _article: a._id, _quantity: 0 };
          }
          map[a._id]._quantity += a._amount;
        }
        const temp = Object.values(map);

        temp.sort(
          (a, b) =>
            this.defaultOrder.indexOf(a._article) -
            this.defaultOrder.indexOf(b._article)
        );

        this.dataService.currentPeriod.production.afterSplitting = temp;

        const index26 = temp.findIndex((x) => x._article === 26);
        this.split(index26);

        this.dataService.currentPeriod.production.afterSplitting[
          index26
        ]._quantity = 50;
        this.changeQuantity(
          this.dataService.currentPeriod.production.afterSplitting[index26],
          index26
        );
        this.moveUp(index26, true);

        // console.log('ind', index26, temp[index26]);
        // if (temp[index26]._quantity > 100) {
        //   temp[index26]._quantity = temp[index26]._quantity - 50;
        //   temp.unshift({ _article: 26, _quantity: 50 });
        // }

        this.cdr.detectChanges();

        this.dataService.currentPeriod.production.defaultOrder = JSON.parse(
          JSON.stringify(
            this.dataService.currentPeriod?.production.afterSplitting
          )
        );
      }
    });
  }

  getBearbeitungszeit = (arbeitsplatz: any) => arbeitsplatz.Bearbeitungszeit;

  getWidth = (value: any): string => 45 + 30 * (value - 1) + 'px';

  sortArbeitsplaetze = (arbeitsplaetze: any) =>
    Object.entries(arbeitsplaetze)
      .map((x) => ({ key: x[0], value: x[1] }))
      .sort((a: any, b: any) => a.value.Reihenfolge - b.value.Reihenfolge);

  back = () => this.router.navigate(['/steps/planning']);

  next = () => {
    if (this.dataService.currentPeriod) {
      this.errors = {};

      if (Object.keys(this.errors).length > 0) {
        this.notificationsService
          .show(
            $localize`:@@ERROR_NOT_FILLED_CORRECT:Es sind nicht alle Felder richtig ausgefüllt`,
            {
              status: TuiNotification.Error,
            }
          )
          .subscribe();
        return;
      }
      console.log('update');
      if (
        this.dataService.currentPeriod.input &&
        this.dataService.currentPeriod.production.afterSplitting
      ) {
        this.dataService.currentPeriod.input.productionlist = {
          production:
            this.dataService.currentPeriod.production.afterSplitting.filter(
              (x) => x._quantity > 0
            ),
        };
      }
      this.dataService.updatePeriod(
        this.dataService.currentPeriod,
        'production'
      );
      this.router.navigate(['/steps/workingtime']);
    }
  };

  // split(index: number) {
  //   if (this.dataService.currentPeriod?.production.afterSplitting) {
  //     this.dataService.currentPeriod.production.currentSplit =
  //       [this.dataService.currentPeriod.production.afterSplitting[index]];
  //     this.dialog.subscribe({
  //       next: (data) => {
  //         console.log('Dialog emitted data = ' + data);
  //       },
  //       complete: () => {
  //         console.log('Dialog closed');
  //       },
  //     });
  //   }
  // }

  split(index: number) {
    if (this.dataService.currentPeriod?.production.afterSplitting) {
      console.log('Split', index);
      const element =
        this.dataService.currentPeriod.production.afterSplitting[index];
      if (this.splittedMap && !this.splittedMap[element._article]) {
        this.splittedMap[element._article] = element._quantity;
      }
      const quantityTotal = element._quantity;
      element._quantity = Math.round(element._quantity / 2 / 10) * 10;

      const newElement: Production = {
        _article: element._article,
        _quantity: quantityTotal - element._quantity,
      };

      this.dataService.currentPeriod.production.afterSplitting.splice(
        index,
        0,
        newElement
      );
      console.log(
        'Split',
        this.dataService.currentPeriod.production.afterSplitting
      );
      this.cdr.detectChanges();
    }
  }

  changeQuantity(p: Production, index: number) {
    if (this.dataService.currentPeriod?.production?.afterSplitting) {
      let fullAmount = this.splittedMap[p._article];

      const indices = [];
      let toUpdate;
      for (const i in this.dataService.currentPeriod.production
        .afterSplitting) {
        const element =
          this.dataService.currentPeriod.production.afterSplitting[i];
        if (element._article == p._article) {
          delete this.errors[i];
          indices.push(i);
          fullAmount -= element._quantity;
          if (Number.parseInt(i) !== index) {
            toUpdate = Number.parseInt(i);
          }
        }
      }

      delete this.errors[index];
      if (toUpdate) {
        fullAmount +=
          this.dataService.currentPeriod?.production?.afterSplitting[toUpdate]
            ._quantity;
        if (fullAmount >= 0) {
          this.dataService.currentPeriod.production.afterSplitting[
            toUpdate
          ]._quantity = fullAmount;
        } else {
          this.errors[
            index
          ] = $localize`:@@ERROR_NOT_HIGHER:Der Wert kann nicht höher sein als der geplante`;
        }
      }
      if (fullAmount % 10 != 0) {
        this.errors[
          index
        ] = $localize`:@@ERROR_ONLY_TENS:Nur Zehnerschritte möglich`;
      }
    }
  }

  deleteSplitting(p: Production, index: number) {
    if (this.dataService.currentPeriod?.production.afterSplitting) {
      p._quantity = 0;
      this.changeQuantity(p, index);
      this.dataService.currentPeriod.production.afterSplitting.splice(index, 1);

      const count =
        this.dataService.currentPeriod.production.afterSplitting.filter(
          (x) => x._article === p._article
        ).length;
      if (count === 1) {
        delete this.splittedMap[p._article];
      }
    }
  }

  moveUp = (index: number, full = false) => {
    if (full) {
      if (this.dataService.currentPeriod?.production.afterSplitting) {
        const tempElement =
          this.dataService.currentPeriod!.production.afterSplitting![index];

        this.dataService.currentPeriod?.production.afterSplitting.splice(
          index,
          1
        );
        this.dataService.currentPeriod.production.afterSplitting.unshift(
          tempElement
        );
        window.scrollTo(0, document.getElementById('table')!.offsetTop);
      }
    } else {
      this.move(index, -1);
    }
  };
  moveDown = (index: number, full = false) => {
    if (full) {
      if (this.dataService.currentPeriod?.production.afterSplitting) {
        const tempElement =
          this.dataService.currentPeriod!.production.afterSplitting![index];

        this.dataService.currentPeriod?.production.afterSplitting.splice(
          index,
          1
        );
        this.dataService.currentPeriod.production.afterSplitting.push(
          tempElement
        );
        window.scrollTo(
          0,
          document.getElementById('table')!.offsetTop +
            document.getElementById('table')!.offsetHeight
        );
      }
    } else {
      this.move(index, 1);
    }
  };

  move(index: number, delta: number) {
    if (this.dataService.currentPeriod?.production.afterSplitting) {
      var newIndex = index + delta;
      if (
        newIndex < 0 ||
        newIndex ==
          this.dataService.currentPeriod?.production.afterSplitting.length
      ) {
        return;
      }
      var indexes = [index, newIndex].sort((a, b) => a - b);
      console.log(indexes);
      this.dataService.currentPeriod?.production.afterSplitting.splice(
        indexes[0],
        2,
        this.dataService.currentPeriod?.production.afterSplitting[indexes[1]],
        this.dataService.currentPeriod?.production.afterSplitting[indexes[0]]
      );

      this.cdr.detectChanges();
      window.scrollBy(0, delta * 56);
    }
  }
}
