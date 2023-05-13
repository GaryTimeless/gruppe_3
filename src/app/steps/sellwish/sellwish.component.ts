import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { DataService } from 'src/app/data.service';
import { Planning } from 'src/app/_models/planning.model';
import {
  OrdersInWorkWorkplace,
  WaitingListElement,
} from 'src/app/_models/result-data.model';

@Component({
  selector: 'app-sellwish',
  templateUrl: './sellwish.component.html',
  styleUrls: ['./sellwish.component.scss'],
})
export class SellwishComponent implements OnInit {
  constructor(
    public dataService: DataService,
    private router: Router,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {}
  errors: any = {};

  ordersinwork: any = {};
  waitinglist: any = {};
  localInitNumber: number = 0;

  ngOnInit(): void {
    if (!this.dataService.currentPeriod) {
      this.router.navigate(['/steps/upload']);
    }

    this.dataService.currentPeriodObservable.subscribe((period: Planning) => {
      console.log(period);
      if (period) {
        const tempMap: { [key: string]: WaitingListElement } = {};
        period?.result?.waitinglistworkstations?.workplace?.forEach(
          (element) => {
            if (element.waitinglist) {
              if (element.waitinglist instanceof Array) {
                element.waitinglist.forEach((element2) => {
                  if (!tempMap[`${element2._period}-${element2._order}`]) {
                    tempMap[`${element2._period}-${element2._order}`] =
                      element2;
                  }
                });
              } else {
                if (
                  !tempMap[
                    `${element.waitinglist._period}-${element.waitinglist._order}`
                  ]
                ) {
                  tempMap[
                    `${element.waitinglist._period}-${element.waitinglist._order}`
                  ] = element.waitinglist;
                }
              }
            }
          }
        );
        Object.values(tempMap).forEach((element) => {
          if (!this.waitinglist[element._item]) {
            this.waitinglist[element._item] = 0;
          }
          this.waitinglist[element._item] += element._amount;
        });

        const tempMap2: { [key: string]: OrdersInWorkWorkplace } = {};
        console.log(period?.result?.ordersinwork?.workplace);
        if (period?.result?.ordersinwork?.workplace instanceof Array) {
          period?.result?.ordersinwork?.workplace?.forEach((element) => {
            if (!tempMap2[`${element._period}-${element._order}`]) {
              tempMap2[`${element._period}-${element._order}`] = element;
            }
          });
        } else if (period?.result?.ordersinwork?.workplace?._period) {
          if (
            !tempMap2[
              `${period?.result?.ordersinwork?.workplace._period}-${period?.result?.ordersinwork?.workplace._order}`
            ]
          ) {
            tempMap2[
              `${period.result.ordersinwork.workplace._period}-${period.result.ordersinwork.workplace._order}`
            ] = period?.result?.ordersinwork?.workplace;
          }
        }
  
        Object.values(tempMap2).forEach((element) => {
          if (!this.ordersinwork[element._item]) {
            this.ordersinwork[element._item] = 0;
          }
          this.ordersinwork[element._item] += element._amount;
        });

        for (let product in this.dataService.currentPeriod
          ?.productionPlanning) {
          for (let period in (
            this.dataService.currentPeriod?.productionPlanning as any
          )[product]) {
            switch (period) {
              case 'period0':
                if (
                  !(this.dataService.currentPeriod!.productionPlanning as any)[
                    product
                  ][period].production
                ) {
                  (this.dataService.currentPeriod!.productionPlanning as any)[
                    product
                  ][period].production = (
                    this.dataService.currentPeriod?.result?.forecast as any
                  )[product];
                }
                break;
              default:
                if (
                  !(this.dataService.currentPeriod!.productionPlanning as any)[
                    product
                  ][period].production
                ) {
                  (this.dataService.currentPeriod!.productionPlanning as any)[
                    product
                  ][period].production = (
                    this.dataService.currentPeriod?.sellwish as any
                  )[period][product];
                }
            }
          }
        }

        this.calcPlannedStock();
      }
    });
  }

  formatProduct = (s: string) => s.substring(1, 3).toUpperCase();

  calcPlannedStock(
    event: any = null,
    product: string = '',
    period: string = ''
  ) {
    delete this.errors[`production.${product}.${period}`];
    if (event) {
      if (event % 10 !== 0) {
        this.errors[
          `production.${product}.${period}`
        ] = $localize`:@@ERROR_ONLY_TENS:Nur Zehnerschritte möglich`;
      }
    }
    if (this.dataService.currentPeriod) {
      for (let product of ['_p1', '_p2', '_p3']) {
        // for (let product in this.dataService.currentPeriod?.productionPlanning) {
        const productNumber = Number.parseInt(product.substring(2, 3));
        for (let period of ['period0', 'period1', 'period2', 'period3']) {
          // for (let period in (
          //   this.dataService.currentPeriod?.productionPlanning as any
          // )[product]) {
          switch (period) {
            case 'period0':
              const warehousestock =
                this.dataService.currentPeriod.result!.warehousestock.article.find(
                  (x) => x._id == productNumber
                )!._amount;
              const selldirect =
                this.dataService.currentPeriod.input.selldirect?.item.find(
                  (x) => x._article == productNumber
                )!._quantity;
              const waitinglist =
                this.waitinglist[Number.parseInt(product.substring(2, 3))] ?? 0;
              const ordersinwork =
                this.ordersinwork[Number.parseInt(product.substring(2, 3))] ??
                0;
              (this.dataService.currentPeriod!.productionPlanning as any)[
                product
              ].period0.plannedStock =
                warehousestock +
                waitinglist +
                ordersinwork +
                ((this.dataService.currentPeriod!.productionPlanning as any)[
                  product
                ].period0.production ?? 0) -
                ((this.dataService.currentPeriod.result?.forecast as any)[
                  product
                ] ?? 0) -
                (selldirect ?? 0);
              break;
            case 'period1':
            case 'period2':
            case 'period3':
              this.calcFuturePeriod(product, Number.parseInt(period.slice(-1)));
              break;
            default:
          }
        }
      }
    }
  }

  calcFuturePeriod(product: string, periodNumber: number) {
    // console.log(
    //   product,
    //   periodNumber,
    //   periodNumber - 1,
    //   (this.dataService.currentPeriod!.productionPlanning as any)[product][
    //     'period' + (periodNumber - 1)
    //   ].plannedStock ?? 0,
    //   (this.dataService.currentPeriod!.productionPlanning as any)[product][
    //     'period' + periodNumber
    //   ].production ?? 0,
    //   (this.dataService.currentPeriod?.sellwish as any)[
    //     'period' + periodNumber
    //   ][product] ?? 0
    // );

    (this.dataService.currentPeriod!.productionPlanning as any)[product][
      'period' + periodNumber
    ].plannedStock =
      ((this.dataService.currentPeriod!.productionPlanning as any)[product][
        'period' + (periodNumber - 1)
      ].plannedStock ?? 0) +
      ((this.dataService.currentPeriod!.productionPlanning as any)[product][
        'period' + periodNumber
      ].production ?? 0) -
      ((this.dataService.currentPeriod?.sellwish as any)[
        'period' + periodNumber
      ][product] ?? 0);
  }

  hasError(product: string, period: string) {
    delete this.errors[`production.${product}.${period}`];
    let value;
    if (period === 'period0') {
      value = (this.dataService.currentPeriod!.productionPlanning as any)[product]
      .period0.plannedStock;
    } else {
      value = (this.dataService.currentPeriod!.productionPlanning as any)[product][
        period
      ].plannedStock;
    }

    if (value  < 0) {
      this.errors[
        `production.${product}.${period}`
      ] = $localize`:@@NOT_NEGATIVE:Wert darf nicht negativ sein`;
    }
    if (value % 1 !== 0) {
      this.errors[
        `production.${product}.${period}`
      ] = 'Nur ganzzahlige Werte möglich';
    }
    return this.errors[`production.${product}.${period}`]
  }

  sellWishChange(period: string, product: string, event: any) {
    delete this.errors[`${period}.${product}`];
    if (event % 10 !== 0) {
      this.errors[
        `${period}.${product}`
      ] = $localize`:@@ERROR_ONLY_TENS:Nur Zehnerschritte möglich`;
    }
    (this.dataService.currentPeriod!.productionPlanning as any)[product][
      period
    ].production = event;
    this.calcPlannedStock();
  }

  getPeriodPlus = (plus: number) =>
    Number.parseInt(this.dataService.currentPeriod?.result?._period ?? '0') +
    plus;

  back = () => this.router.navigate(['/steps/selldirect']);

  next = () => {
    if (this.dataService.currentPeriod) {
      this.errors = {};

      this.checkError('period1', '_p1');
      this.checkError('period1', '_p2');
      this.checkError('period1', '_p3');
      this.checkError('period2', '_p1');
      this.checkError('period2', '_p2');
      this.checkError('period2', '_p3');
      this.checkError('period3', '_p1');
      this.checkError('period3', '_p2');
      this.checkError('period3', '_p3');

      if (
        this.dataService.currentPeriod.result?.forecast._p1 &&
        this.dataService.currentPeriod.result?.forecast._p2 &&
        this.dataService.currentPeriod.result?.forecast._p3
      ) {
        this.dataService.currentPeriod.input.sellwish = {
          item: [
            {
              _article: 1,
              _quantity: this.dataService.currentPeriod.result!.forecast._p1,
            },
            {
              _article: 2,
              _quantity: this.dataService.currentPeriod.result!.forecast._p2,
            },
            {
              _article: 3,
              _quantity: this.dataService.currentPeriod.result!.forecast._p3,
            },
          ],
        };
      }

      if (Object.keys(this.errors).length > 0) {
        this.notificationsService
          .show(
            $localize`:@@ERROR_REQUIRED_POSITIVE:Es müssen alle Felder ausgefüllt und positiv sein!`,
            {
              status: TuiNotification.Error,
            }
          )
          .subscribe();
        return;
      }
      console.log('update');
      this.dataService.updatePeriod(this.dataService.currentPeriod, 'sellwish');
      this.router.navigate(['/steps/planning']);
    }
  };

  checkError(
    period: 'period1' | 'period2' | 'period3',
    element: '_p1' | '_p2' | '_p3'
  ) {
    if (
      (this.dataService.currentPeriod?.sellwish?.[period]?.[element] ?? 0) < 0
    ) {
      this.errors[`${period}.${element}`] = true;
    }
  }
}
