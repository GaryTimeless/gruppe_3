import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { InputData } from './_models/input-data.model';
import { Planning, ProductionPlanningProducts } from './_models/planning.model';
import { Results } from './_models/result-data.model';
import { stammdaten } from './_services/data/stammdaten';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  currentPeriod?: Planning;
  currentPeriodObservable = new ReplaySubject<Planning>(1);
  stammdaten: any = stammdaten;
  stammdatenNachArbeitsplatz?: any;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private notificationsService: TuiNotificationsService
  ) {
    this.stammdatenNachArbeitsplatz = {};
    for (let i in stammdaten) {
      const artikel = (stammdaten as any)[i];
      for (let j in artikel.Arbeitsplaetze) {
        if (!this.stammdatenNachArbeitsplatz[j]) {
          this.stammdatenNachArbeitsplatz[j] = { Artikel: {} };
        }
        this.stammdatenNachArbeitsplatz[j].Artikel[i] = {
          ...artikel,
          Bearbeitungszeit: artikel.Arbeitsplaetze[j].Bearbeitungszeit,
          Rüstzeit: artikel.Arbeitsplaetze[j].Rüstzeit,
        };
      }
    }
    console.log('STAMMDATEN', stammdaten);

    console.log('STAMMDATEN_Arbeitsplatz', this.stammdatenNachArbeitsplatz);
  }

  addPeriod(name: string, result: Results) {
    const period: Partial<Planning> = {
      name,
      result,
      input: {
        sellwish: {
          item: [
            {
              _article: 1,
              _quantity: result?.forecast?._p1,
            },
            {
              _article: 2,
              _quantity: result?.forecast?._p2,
            },
            {
              _article: 3,
              _quantity: result?.forecast?._p3,
            },
          ],
        },
      } as InputData,
    };
    console.log('addPeriod', period);
    this.selectPeriod(period);
    return this.firestore
      .collection('users')
      .doc(this.authService.userId)
      .collection('periods')
      .doc(name.toString())
      .set(JSON.parse(JSON.stringify(period)));
  }

  updatePeriod = (period: Planning, source: string) => {
    if (source === 'disposition1') {
      period.done.production = true;
    } else if (source === 'disposition2' || source === 'disposition3') {
    } else {
      (period.done as any)[source] = true;
    }
    switch (source) {
      case 'sellwish':
      // @ts-ignore
      case 'selldirect':
        period.productionorders = {
          disposition1: [],
          disposition2: [],
          disposition3: [],
          initNumber: 0,
        };

      case 'disposition1':
      case 'disposition2':
      // @ts-ignore
      case 'disposition3':
        period.production = {};
        period.order = {};

      // @ts-ignore
      case 'production':
        period.workingtime = {};

      case 'workingtime':
      case 'order':
    }

    console.log(period);
    return this.firestore
      .collection('users')
      .doc(this.authService.userId)
      .collection('periods')
      .doc(period.name?.toString())
      .update(JSON.parse(JSON.stringify(period)))
      .then(() => {
        

        this.notificationsService
          .show($localize`:@@SAVED:Die Daten wurden gespeichert`, {
            status: TuiNotification.Success,
          })
          .subscribe();
      });
  };

  selectPeriodByParam(periodName: string) {
    this.currentPeriod = new Planning();
    this.loadPeriods().subscribe((res) => {
      console.log(res);
      const period = res.find((x) => x.name == periodName);
      if (period) {
        this.selectPeriod(period);
      }
    });
  }

  selectPeriod(period: Partial<Planning>) {
    this.currentPeriod = new Planning(period);
    console.log('currentPeriod', this.currentPeriod);
    this.currentPeriodObservable.next(this.currentPeriod);
  }

  deletePeriod(periodId: string) {
    return this.firestore
      .collection('users')
      .doc(this.authService.userId)
      .collection('periods')
      .doc(periodId)
      .delete();
  }

  loadPeriods(): Observable<Planning[]> {
    return this.firestore
      .collection('users')
      .doc(this.authService.userId)
      .collection('periods')
      .valueChanges()
      .pipe(
        map((x) => {
          const res: any = [];
          x.forEach((y) => {
            res.push(new Planning(y));
          });
          return res;
        })
      );
  }
}
