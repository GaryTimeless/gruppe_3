import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import {
  Order,
  OrderList,
  Production,
  ProductionList,
  SellDirect,
  SellWish,
} from 'src/app/_models/input-data.model';
import { PeriodsWithForecast, Planning } from 'src/app/_models/planning.model';
import {
  Forecast,
  WarehouseStock,
  FutureInwardStockMovementOrder,
} from 'src/app/_models/result-data.model';
import { stammdaten } from 'src/app/_services/data/stammdaten';
import { Bestellposition } from 'src/app/_models/order.model copy';
import { itemsQueryListObservable } from '@taiga-ui/cdk';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent implements OnInit {
  errors: any = {};
  // Verkaufsdaten
  forecastCurrentPeriod: Forecast =
    this.dataService.currentPeriod?.result?.forecast!;
  forecastCurrentPeriodErzeugnisse: Production[] =
    this.dataService.currentPeriod?.input.productionlist?.production!;
  periodsWithForecast: PeriodsWithForecast = {
    period1: {
      _p1:   this.dataService.currentPeriod?.productionPlanning._p1.period1.production,
      _p2:   this.dataService.currentPeriod?.productionPlanning._p2.period1.production,
      _p3:   this.dataService.currentPeriod?.productionPlanning._p3.period1.production,
    },
    period2: {
      _p1:   this.dataService.currentPeriod?.productionPlanning._p1.period2.production,
      _p2:   this.dataService.currentPeriod?.productionPlanning._p2.period2.production,
      _p3:   this.dataService.currentPeriod?.productionPlanning._p3.period2.production,
    },
    period3: {
      _p1:   this.dataService.currentPeriod?.productionPlanning._p1.period3.production,
      _p2:   this.dataService.currentPeriod?.productionPlanning._p2.period3.production,
      _p3:   this.dataService.currentPeriod?.productionPlanning._p3.period3.production,
    },
  }

    // this.dataService.currentPeriod?.sellwish!;
  selldirect_p1: number =
    this.dataService.currentPeriod?.input.selldirect?.item[0]._quantity ?? 0;
  selldirect_p2: number =
    this.dataService.currentPeriod?.input.selldirect?.item[1]._quantity ?? 0;
  selldirect_p3: number =
    this.dataService.currentPeriod?.input.selldirect?.item[2]._quantity ?? 0;
  lagerkostensatz: number = 0.3;
  lagerkostensatzToggle = false;

  //IDs aller Kaufteile
  orderIDs: number[] = [
    21, 22, 23, 24, 25, 27, 28, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
    44, 45, 46, 47, 48, 52, 53, 57, 58, 59,
  ];

  //BEstellung initialisieren
  bestellung: { [key: string]: Bestellposition } = {};

  constructor(
    public dataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationsService: TuiNotificationsService
  ) {}

  ngOnInit(): void {
    if (!this.dataService.currentPeriod) {
      this.router.navigate(['/steps/upload']);
    }

    this.dataService.currentPeriodObservable.subscribe((period: Planning) => {
      if (this.dataService.currentPeriod?.order.bestellung) {
        this.bestellung = this.dataService.currentPeriod?.order.bestellung;
        Object.values(this.bestellung).forEach((item: any) => {
          this.prognosenBerechnen(item);
        });
      } else {
        //Bestellpositionen in Bestellung einfügen
        this.bestellungenBerechnen();
      }
      this.cdr.detectChanges();
    });
  }

  lagerkostensatzToggleChange(event: any) {
    this.lagerkostensatz = event ? 1.3 : 0.3;
    this.bestellungenBerechnen();
    this.cdr.detectChanges();
  }

  bestellmengeNormalChange(key: string, event: string) {
    delete this.errors[key + '.normal'];
    if (Number.parseInt(event) < 0) {
      this.errors[
        key + '.normal'
      ] = $localize`:@@NOT_NEGATIVE:Wert darf nicht negativ sein`;
    }
    if (Number.parseFloat(event) % 1 !== 0) {
      this.errors[
        key + '.normal'
      ]= `Es sind nur positive ganze Zahlen erlaubt!`;
    }
    console.log(key, event);
    this.bestellung[key]._bestellmengeNormal = Number.parseInt(event) ?? 0;
    this.prognosenBerechnen(this.bestellung[key]);
    this.cdr.detectChanges();
  }

  bestellmengeEilChange(key: string, event: string) {
    delete this.errors[key + '.eil'];
    if (Number.parseInt(event) < 0) {
      this.errors[
        key + '.eil'
      ] = $localize`:@@NOT_NEGATIVE:Wert darf nicht negativ sein`;
    }
    if (Number.parseFloat(event) % 1 !== 0) {
      this.errors[
        key + '.eil'
      ]= `Es sind nur positive ganze Zahlen erlaubt!`;
    }
    console.log(key, event);
    this.bestellung[key]._bestellmengeEil = Number.parseInt(event);
    this.prognosenBerechnen(this.bestellung[key]);
    this.cdr.detectChanges();
  }

  bestellungenBerechnen(){
         for (let i of this.orderIDs) {

          let lieferzeit = this.dataService.stammdaten[i].Lieferzeit
          if (!lieferzeit) {
            lieferzeit = 0
          } else if (typeof lieferzeit == 'string') {
            lieferzeit = Number.parseFloat(this.dataService.stammdaten[i].Lieferzeit?.replace(',', '.'))
          }


          let abweichung2 = this.dataService.stammdaten[i].Lieferzeitabweichung

          if (!abweichung2) {
            abweichung2 = 0

          } else if (typeof abweichung2 == 'string') {
            abweichung2 = Number.parseFloat(this.dataService.stammdaten[i].Lieferzeitabweichung?.replace(',', '.'))

          }

          var pos: Bestellposition = {
            _artikelnummer: i,
            _lieferkosten: this.dataService.stammdaten[i].Lieferkosten ? this.dataService.stammdaten[i].Lieferkosten : 0,
            _lieferzeit: lieferzeit,
            _lieferzeitabweichung: abweichung2,
            _startpreis: this.dataService.stammdaten[i].Startpreis ?? 0,
            _verwendung: this.dataService.stammdaten[i].VerwendungMap ? this.dataService.stammdaten[i].VerwendungMap : 0,
            _lagerbestand: this.dataService.currentPeriod?.result?.warehousestock?.article?.find(x => x._id == i)?._amount ?? 0,
            _diskontmenge: this.dataService.stammdaten[i].Diskontmenge ?? 0,
            _bestellmengeNormal: 0,
            _bestellmengeEil: 0,
            _prog1: 0,
            _prog2: 0,
            _prog3: 0,
            _prog4: 0,
            _bestellungZuSpaet: 0,
            _ausstehendeBestellungen: [],
          }

          this.bestellung[i] = pos;

          //Prognosen für einzelene Bestellpositionen berechnen
          this.prognosenBerechnen(this.bestellung[i])
          this.benoetigteBestellungenberechnen(this.bestellung[i])
          this.prognosenBerechnen(this.bestellung[i])

      let abweichung = this.dataService.stammdaten[i].Lieferzeitabweichung;

      if (!abweichung) {
        abweichung = 0;
      } else if (typeof abweichung == 'string') {
        abweichung = Number.parseFloat(
          this.dataService.stammdaten[i].Lieferzeitabweichung?.replace(',', '.')
        );
      }

      var pos: Bestellposition = {
        _artikelnummer: i,
        _lieferkosten: this.dataService.stammdaten[i].Lieferkosten
          ? this.dataService.stammdaten[i].Lieferkosten
          : 0,
        _lieferzeit: lieferzeit,
        _lieferzeitabweichung: abweichung,
        _startpreis: this.dataService.stammdaten[i].Startpreis ?? 0,
        _verwendung: this.dataService.stammdaten[i].VerwendungMap
          ? this.dataService.stammdaten[i].VerwendungMap
          : 0,
        _lagerbestand:
          this.dataService.currentPeriod?.result?.warehousestock?.article?.find(
            (x) => x._id == i
          )?._amount ?? 0,
        _diskontmenge: this.dataService.stammdaten[i].Diskontmenge ?? 0,
        _bestellmengeNormal: 0,
        _bestellmengeEil: 0,
        _prog1: 0,
        _prog2: 0,
        _prog3: 0,
        _prog4: 0,
        _bestellungZuSpaet: 0,
        _ausstehendeBestellungen: [],
      };

      this.bestellung[i] = pos;

      //Prognosen für einzelene Bestellpositionen berechnen
      this.prognosenBerechnen(this.bestellung[i]);
      this.benoetigteBestellungenberechnen(this.bestellung[i]);
      this.prognosenBerechnen(this.bestellung[i]);
    }
  }

  prognosenBerechnen(bestellposition: Bestellposition) {
    // Prognosen zurücksetzen und neu berechnen
    bestellposition._prog1 = 0;
    bestellposition._prog2 = 0;
    bestellposition._prog3 = 0;
    bestellposition._prog4 = 0;
    bestellposition._ausstehendeBestellungen= [];

    const aktuelle_periode = this.dataService.currentPeriod?.result?._period
      ? Number.parseInt(this.dataService.currentPeriod?.result?._period) + 1
      : 1;
    const zukünftigeBestellungen =
      this.dataService.currentPeriod?.result?.futureinwardstockmovement.order ??
      [];
    for (let order of zukünftigeBestellungen) {
      // Vergangene Bestellungen entsprechen ihres Ankunftszeitpunkts in die Prognose integrieren

      if (order._article == bestellposition._artikelnummer) {
        var gesamtzeit: number = 0;
        bestellposition._ausstehendeBestellungen.push(order)
        if (order._mode == 5) {
          gesamtzeit =
            order._orderperiod +
            bestellposition._lieferzeit +
            0.2 +
            bestellposition._lieferzeitabweichung / 2;
        } else {
          gesamtzeit =
            order._orderperiod + bestellposition._lieferzeit / 2 + 0.2;
        }

        if (
          gesamtzeit > aktuelle_periode &&
          gesamtzeit <= aktuelle_periode + 1
        ) {
          bestellposition._prog2 += order._amount;
        } else if (
          gesamtzeit > aktuelle_periode + 1 &&
          gesamtzeit <= aktuelle_periode + 2
        ) {
          bestellposition._prog3 += order._amount;
        } else if (
          gesamtzeit > aktuelle_periode + 2 &&
          gesamtzeit <= aktuelle_periode + 3
        ) {
          bestellposition._prog4 += order._amount;
        }
      }
    }

    //Felder BestellungNormal und BestellungEil in Prognosen integrieren
    const gesamtzeitNormal: number =
      aktuelle_periode +
      bestellposition._lieferzeit +
      0.2 +
      bestellposition._lieferzeitabweichung / 2;
    if (
      gesamtzeitNormal > aktuelle_periode &&
      gesamtzeitNormal <= aktuelle_periode + 1
    ) {
      bestellposition._prog2 += bestellposition._bestellmengeNormal;
    } else if (
      gesamtzeitNormal > aktuelle_periode + 1 &&
      gesamtzeitNormal <= aktuelle_periode + 2
    ) {
      bestellposition._prog3 += bestellposition._bestellmengeNormal;
    } else if (
      gesamtzeitNormal > aktuelle_periode + 2 &&
      gesamtzeitNormal <= aktuelle_periode + 3
    ) {
      bestellposition._prog4 += bestellposition._bestellmengeNormal;
    }

    //für Eilbestellungen
    const gesamtzeitEil: number =
      aktuelle_periode + bestellposition._lieferzeit / 2 + 0.2;
    if (
      gesamtzeitEil > aktuelle_periode &&
      gesamtzeitEil <= aktuelle_periode + 1
    ) {
      bestellposition._prog2 += bestellposition._bestellmengeEil;
    } else if (
      gesamtzeitEil > aktuelle_periode + 1 &&
      gesamtzeitEil <= aktuelle_periode + 2
    ) {
      bestellposition._prog3 += bestellposition._bestellmengeEil;
    } else if (
      gesamtzeitEil > aktuelle_periode + 2 &&
      gesamtzeitEil <= aktuelle_periode + 3
    ) {
      bestellposition._prog4 += bestellposition._bestellmengeEil;
    }

    bestellposition._prog1 += bestellposition._lagerbestand;

    // Prognose für die aktuelle Periode berechnen
    this.verwendungKaufteileCurrentPeriodBerechnen(bestellposition);

    // Prognose für die folgenden 3 Perioden berechnen

    // Verwendung in Variable für kürzere Schreibweise in den Formeln
    const verwendung_p1: number = bestellposition._verwendung.p1 ?? 0;
    const verwendung_p2: number = bestellposition._verwendung.p2 ?? 0;
    const verwendung_p3: number = bestellposition._verwendung.p3 ?? 0;

    const forecast_prog2_p1: number = this.periodsWithForecast.period1._p1 ?? 0;
    const forecast_prog2_p2: number = this.periodsWithForecast.period1._p2 ?? 0;
    const forecast_prog2_p3: number = this.periodsWithForecast.period1._p3 ?? 0;
    bestellposition._prog2 +=
      bestellposition._prog1 -
      verwendung_p1 * forecast_prog2_p1 -
      verwendung_p2 * forecast_prog2_p2 -
      verwendung_p3 * forecast_prog2_p3;
    const forecast_prog3_p1: number = this.periodsWithForecast.period2._p1 ?? 0;
    const forecast_prog3_p2: number = this.periodsWithForecast.period2._p2 ?? 0;
    const forecast_prog3_p3: number = this.periodsWithForecast.period2._p3 ?? 0;
    bestellposition._prog3 +=
      bestellposition._prog2 -
      verwendung_p1 * forecast_prog3_p1 -
      verwendung_p2 * forecast_prog3_p2 -
      verwendung_p3 * forecast_prog3_p3;
    const forecast_prog4_p1: number = this.periodsWithForecast.period3._p1 ?? 0;
    const forecast_prog4_p2: number = this.periodsWithForecast.period3._p2 ?? 0;
    const forecast_prog4_p3: number = this.periodsWithForecast.period3._p3 ?? 0;
    bestellposition._prog4 +=
      bestellposition._prog3 -
      verwendung_p1 * forecast_prog4_p1 -
      verwendung_p2 * forecast_prog4_p2 -
      verwendung_p3 * forecast_prog4_p3;
  }
  verwendungKaufteileCurrentPeriodBerechnen(bestellposition: Bestellposition) {
    const verwendungKaufteile = {
      1: {
        verwendung: [
          { artikel: 21, anzahl: 1 },
          { artikel: 24, anzahl: 1 },
          { artikel: 27, anzahl: 1 },
        ],
      },
      26: {
        verwendung: [
          { artikel: 44, anzahl: 2 },
          { artikel: 47, anzahl: 1 },
          { artikel: 48, anzahl: 2 },
        ],
      },
      51: {
        verwendung: [
          { artikel: 24, anzahl: 1 },
          { artikel: 27, anzahl: 1 },
        ],
      },
      16: {
        verwendung: [
          { artikel: 24, anzahl: 1 },
          { artikel: 28, anzahl: 1 },
          { artikel: 40, anzahl: 1 },
          { artikel: 41, anzahl: 1 },
          { artikel: 42, anzahl: 2 },
        ],
      },
      17: {
        verwendung: [
          { artikel: 43, anzahl: 1 },
          { artikel: 44, anzahl: 1 },
          { artikel: 45, anzahl: 1 },
          { artikel: 46, anzahl: 1 },
        ],
      },
      50: {
        verwendung: [
          { artikel: 24, anzahl: 2 },
          { artikel: 25, anzahl: 2 },
        ],
      },
      4: {
        verwendung: [
          { artikel: 35, anzahl: 2 },
          { artikel: 36, anzahl: 1 },
          { artikel: 52, anzahl: 1 },
          { artikel: 53, anzahl: 36 },
        ],
      },
      10: {
        verwendung: [
          { artikel: 32, anzahl: 1 },
          { artikel: 39, anzahl: 1 },
        ],
      },
      49: {
        verwendung: [
          { artikel: 24, anzahl: 2 },
          { artikel: 25, anzahl: 2 },
        ],
      },
      7: {
        verwendung: [
          { artikel: 35, anzahl: 2 },
          { artikel: 37, anzahl: 1 },
          { artikel: 38, anzahl: 1 },
          { artikel: 52, anzahl: 1 },
          { artikel: 53, anzahl: 36 },
        ],
      },
      13: {
        verwendung: [
          { artikel: 32, anzahl: 1 },
          { artikel: 39, anzahl: 1 },
        ],
      },
      18: {
        verwendung: [
          { artikel: 28, anzahl: 3 },
          { artikel: 32, anzahl: 1 },
          { artikel: 59, anzahl: 2 },
        ],
      },
      2: {
        verwendung: [
          { artikel: 22, anzahl: 1 },
          { artikel: 24, anzahl: 1 },
          { artikel: 27, anzahl: 1 },
        ],
      },
      56: {
        verwendung: [
          { artikel: 24, anzahl: 1 },
          { artikel: 27, anzahl: 1 },
        ],
      },
      55: {
        verwendung: [
          { artikel: 24, anzahl: 2 },
          { artikel: 25, anzahl: 2 },
        ],
      },
      5: {
        verwendung: [
          { artikel: 35, anzahl: 2 },
          { artikel: 36, anzahl: 1 },
          { artikel: 57, anzahl: 1 },
          { artikel: 58, anzahl: 36 },
        ],
      },
      11: {
        verwendung: [
          { artikel: 32, anzahl: 1 },
          { artikel: 39, anzahl: 1 },
        ],
      },
      54: {
        verwendung: [
          { artikel: 24, anzahl: 2 },
          { artikel: 25, anzahl: 2 },
        ],
      },
      8: {
        verwendung: [
          { artikel: 35, anzahl: 2 },
          { artikel: 37, anzahl: 1 },
          { artikel: 38, anzahl: 1 },
          { artikel: 57, anzahl: 1 },
          { artikel: 58, anzahl: 36 },
        ],
      },
      14: {
        verwendung: [
          { artikel: 32, anzahl: 1 },
          { artikel: 39, anzahl: 1 },
        ],
      },
      19: {
        verwendung: [
          { artikel: 28, anzahl: 4 },
          { artikel: 32, anzahl: 1 },
          { artikel: 59, anzahl: 2 },
        ],
      },
      3: {
        verwendung: [
          { artikel: 23, anzahl: 1 },
          { artikel: 24, anzahl: 1 },
          { artikel: 27, anzahl: 1 },
        ],
      },
      31: {
        verwendung: [
          { artikel: 24, anzahl: 1 },
          { artikel: 27, anzahl: 1 },
        ],
      },
      30: {
        verwendung: [
          { artikel: 24, anzahl: 2 },
          { artikel: 25, anzahl: 2 },
        ],
      },
      6: {
        verwendung: [
          { artikel: 33, anzahl: 1 },
          { artikel: 34, anzahl: 36 },
          { artikel: 35, anzahl: 2 },
          { artikel: 36, anzahl: 1 },
        ],
      },
      12: {
        verwendung: [
          { artikel: 32, anzahl: 1 },
          { artikel: 39, anzahl: 1 },
        ],
      },
      29: {
        verwendung: [
          { artikel: 24, anzahl: 2 },
          { artikel: 25, anzahl: 2 },
        ],
      },
      9: {
        verwendung: [
          { artikel: 33, anzahl: 1 },
          { artikel: 34, anzahl: 36 },
          { artikel: 35, anzahl: 2 },
          { artikel: 37, anzahl: 1 },
          { artikel: 38, anzahl: 1 },
        ],
      },
      15: {
        verwendung: [
          { artikel: 32, anzahl: 1 },
          { artikel: 39, anzahl: 1 },
        ],
      },
      20: {
        verwendung: [
          { artikel: 28, anzahl: 5 },
          { artikel: 32, anzahl: 1 },
          { artikel: 59, anzahl: 2 },
        ],
      },
    };

    Object.entries(verwendungKaufteile).forEach((item: any) => {
      for (let v of item[1].verwendung) {
        if (v.artikel == bestellposition._artikelnummer) {
          for (let ez_prog in this.forecastCurrentPeriodErzeugnisse) {
            if (
              item[0] == this.forecastCurrentPeriodErzeugnisse[ez_prog]._article
            ) {
              bestellposition._prog1 -=
                v.anzahl *
                this.forecastCurrentPeriodErzeugnisse[ez_prog]._quantity;
            }
          }
        }
      }
    });
  }

  benoetigteBestellungenberechnen(bestellposition: Bestellposition) {
    const p1AllePerioden =
      bestellposition._verwendung.p1 *
      (this.forecastCurrentPeriod._p1! +
        this.periodsWithForecast.period1._p1! +
        this.periodsWithForecast.period2._p1! +
        this.periodsWithForecast.period3._p1!);
    const p2AllePerioden =
      bestellposition._verwendung.p2 *
      (this.forecastCurrentPeriod._p2! +
        this.periodsWithForecast.period1._p2! +
        this.periodsWithForecast.period2._p2! +
        this.periodsWithForecast.period3._p2!);
    const p3AllePerioden =
      bestellposition._verwendung.p3 *
      (this.forecastCurrentPeriod._p3! +
        this.periodsWithForecast.period1._p3! +
        this.periodsWithForecast.period2._p3! +
        this.periodsWithForecast.period3._p3!);
    const durchschnitt = (p1AllePerioden + p2AllePerioden + p3AllePerioden) / 4;

    if (bestellposition._prog1 < 0) {
      bestellposition._bestellungZuSpaet = 1;
      console.log('bestellungzuspaet prog1');
    }

    const ankunftszeitpunkt =
      Number.parseInt(this.dataService.currentPeriod?.result?._period!) +
      1 +
      bestellposition._lieferzeit +
      bestellposition._lieferzeitabweichung / 2 +
      0.2;
    const ankunftszeitpunktEil =
      Number.parseInt(this.dataService.currentPeriod?.result?._period!) +
      1 +
      bestellposition._lieferzeit / 2 +
      0.2;
    const prog2 =
      Number.parseInt(this.dataService.currentPeriod?.result?._period!) + 2;

    if (bestellposition._prog2 < 0 && ankunftszeitpunkt + 1 > prog2) {
      if (ankunftszeitpunkt <= prog2) {
        const optimaleBestellmenge = Math.sqrt(
          (2 * durchschnitt * bestellposition._lieferkosten) /
            (Number.parseFloat(
              bestellposition._startpreis.toString().split(',').join('.')
            ) *
              this.lagerkostensatz)
        );
        console.log(
          durchschnitt,
          bestellposition._lieferkosten,
          bestellposition._startpreis,
          this.lagerkostensatz,
          Number.parseFloat(
            bestellposition._startpreis.toString().split(',').join('.')
          )
        );

        bestellposition._bestellmengeNormal = Math.ceil(optimaleBestellmenge);
        console.log(
          optimaleBestellmenge + ' ' + bestellposition._bestellmengeNormal
        );
      } else if (ankunftszeitpunktEil <= prog2) {
        const optimaleBestellmenge = Math.sqrt(
          (2 * durchschnitt * bestellposition._lieferkosten * 10) /
            (Number.parseFloat(
              bestellposition._startpreis.toString().split(',').join('.')
            ) *
              this.lagerkostensatz)
        );
        bestellposition._bestellmengeEil = Math.ceil(optimaleBestellmenge);
        console.log(
          optimaleBestellmenge + ' ' + bestellposition._bestellmengeEil
        );
      } else {
        bestellposition._bestellungZuSpaet = 1;
        console.log('bestellungzuspaet prog2');
      }
      this.prognosenBerechnen(bestellposition);
    }

    const prog3 =
      Number.parseInt(this.dataService.currentPeriod?.result?._period!) + 3;

    if (
      bestellposition._prog3 < 0 &&
      ankunftszeitpunkt + 1 > prog3 &&
      !(
        bestellposition._bestellmengeNormal > 0 ||
        bestellposition._bestellmengeEil > 0
      )
    ) {
      if (ankunftszeitpunkt <= prog3) {
        const optimaleBestellmenge = Math.sqrt(
          (2 * durchschnitt * bestellposition._lieferkosten) /
            (Number.parseFloat(
              bestellposition._startpreis.toString().split(',').join('.')
            ) *
              this.lagerkostensatz)
        );
        bestellposition._bestellmengeNormal = Math.ceil(optimaleBestellmenge);
      } else if (ankunftszeitpunktEil <= prog3) {
        const optimaleBestellmenge = Math.sqrt(
          (2 * durchschnitt * bestellposition._lieferkosten * 10) /
            (Number.parseFloat(
              bestellposition._startpreis.toString().split(',').join('.')
            ) *
              this.lagerkostensatz)
        );
        bestellposition._bestellmengeEil = Math.ceil(optimaleBestellmenge);
      } else {
        bestellposition._bestellungZuSpaet = 1;
        console.log('bestellungzuspaet prog3');
      }
      this.prognosenBerechnen(bestellposition);
    }

    const prog4 =
      Number.parseInt(this.dataService.currentPeriod?.result?._period!) + 4;

    if (
      bestellposition._prog4 < 0 &&
      ankunftszeitpunkt + 1 > prog4 &&
      !(
        bestellposition._bestellmengeNormal > 0 ||
        bestellposition._bestellmengeEil > 0
      )
    ) {
      if (ankunftszeitpunkt <= prog4) {
        const optimaleBestellmenge = Math.sqrt(
          (2 * durchschnitt * bestellposition._lieferkosten) /
            (Number.parseFloat(
              bestellposition._startpreis.toString().split(',').join('.')
            ) *
              this.lagerkostensatz)
        );
        bestellposition._bestellmengeNormal = Math.ceil(optimaleBestellmenge);
      } else if (ankunftszeitpunktEil <= prog4) {
        const optimaleBestellmenge = Math.sqrt(
          (2 * durchschnitt * bestellposition._lieferkosten * 10) /
            (Number.parseFloat(
              bestellposition._startpreis.toString().split(',').join('.')
            ) *
              this.lagerkostensatz)
        );
        bestellposition._bestellmengeEil = Math.ceil(optimaleBestellmenge);
      } else {
        bestellposition._bestellungZuSpaet = 1;
        console.log('bestellungzuspaet prog4');
      }
      this.prognosenBerechnen(bestellposition);
    }
  }

  back = () => this.router.navigate(['/steps/workingtime']);
  next = () => {
    if (Object.keys(this.errors).length > 0) {
      this.notificationsService
        .show(
          $localize`:@@ERROR_NOT_CORRECT:Es sind nicht alle Felder richtig ausgefüllt`,
          {
            status: TuiNotification.Error,
          }
        )
        .subscribe();
      return;
    }

    this.router.navigate(['/steps/summary']);
    var bestellliste: Order[] = [];
    var bestellliste2: Bestellposition[] = [];

    Object.values(this.bestellung).forEach((item: any) => {
      bestellliste2.push(item);
      if (item._bestellmengeNormal > 0) {
        const tempOrder: Order = {
          _article: Number.parseInt(item._artikelnummer),
          _quantity: item._bestellmengeNormal,
          _modus: 5,
        };
        bestellliste.push(tempOrder);
      }
      if (item._bestellmengeEil > 0) {
        const tempOrder: Order = {
          _article: Number.parseInt(item._artikelnummer),
          _quantity: item._bestellmengeEil,
          _modus: 4,
        };
        bestellliste.push(tempOrder);
      }
    });

    if (this.dataService.currentPeriod) {
      this.dataService.currentPeriod.input.orderlist = { order: bestellliste };
      this.dataService.currentPeriod.order.bestellung = this.bestellung;
      this.dataService.updatePeriod(this.dataService.currentPeriod, 'order');
    }
  };

  getPeriodPlus = (plus: number) =>
    Number.parseInt(this.dataService.currentPeriod?.result?._period ?? '0') +
    plus;
}
