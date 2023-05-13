import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { setClassMetadata } from '@angular/core/src/r3_symbols';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { sum } from '@taiga-ui/cdk';
import { smartSearch, TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { DataService } from 'src/app/data.service';
import { Planning } from 'src/app/_models/planning.model';
import { OrdersInWork, OrdersInWorkWorkplace, WaitingListElement } from 'src/app/_models/result-data.model';
import { calcVerhaeltnis } from '../verhaeltnis';


@Component({
  selector: 'app-disposition1',
  templateUrl: './disposition1.component.html',
  styleUrls: ['./disposition1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Disposition1Component implements OnInit {
  @Input() activeItem: number = 0;
  @Output() activeItemChange = new EventEmitter<any>();
  
  errors: any = {};

  testValue = new FormControl(true);
  nummer1: any;
  nummer2: any;
  nummer3: any;
  nummer4: any;
  nummer5: any;
  nummer7: any;
  nummer6: any;
  nummer8: any;
  nummer9: any;
  nummer10: any;
  nummer11: any;
  nummer12: any;

  //Spalte 1
  value2: any;
  value3: any;
  value4: any;
  value5: any;
  value6: any;
  value7: any;
  value8: any;
  value9: any;
  value10: any;
  value11: any;
  value12: any;

  value1: any;
  value22: any;
  value312: any;
  value23: any;
  value24: any;
  value25: any;
  value26: any;
  value27: any;
  value28: any;
  value29: any;
  value210: any;
  value211: any;
  value212: any;
  value51: any;
  value21: any;
  value31: any;
  value52: any;
  value53: any;
  value54: any;
  value55: any;
  value56: any;
  value57: any;
  value58: any;
  value59: any;
  value510: any;
  value511: any;
  value512: any;

  waitinglist: any = {}
  ordersinwork: any = {}
  value13: any;
  value41: any;
  value42: any;
  value43: any;
  value44: any;
  value45: any;
  value46: any;
  value47: any;
  value48: any;
  value49: any;
  value410: any;
  value411: any;
  value412: any;
  value32: any;
  value33: any;
  value34: any;
  value35: any;
  value36: any;
  value37: any;
  value38: any;
  value39: any;
  value310: any;
  value311: any;

  constructor(public dataService: DataService, private router: Router, private cdr: ChangeDetectorRef,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService) { }

  ngOnInit(): void {
    this.dataService.currentPeriodObservable.subscribe((period: Planning) => {
      console.log(period)
      if (period) {

        //Spalte3
        this.value21 = period?.result?.warehousestock.article.find(x => x._id == 1)?._amount;
        this.value22 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          period.result!.warehousestock.article.find(x => x._id == 26)!._amount.toString());
        this.value23 = period?.result?.warehousestock.article.find(x => x._id == 51)?._amount;
        this.value24 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          period.result!.warehousestock.article.find(x => x._id == 16)!._amount.toString());
        this.value25 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          period.result!.warehousestock.article.find(x => x._id == 17)!._amount.toString());
        this.value26 = period?.result?.warehousestock.article.find(x => x._id == 50)?._amount;
        this.value27 = period?.result?.warehousestock.article.find(x => x._id == 4)?._amount;
        this.value28 = period?.result?.warehousestock.article.find(x => x._id == 10)?._amount;
        this.value29 = period?.result?.warehousestock.article.find(x => x._id == 49)?._amount;
        this.value210 = period?.result?.warehousestock.article.find(x => x._id == 7)?._amount;
        this.value211 = period?.result?.warehousestock.article.find(x => x._id == 13)?._amount;
        this.value212 = period?.result?.warehousestock.article.find(x => x._id == 18)?._amount;

         //Abfrage der eingetragenen Daten
        // this.nummer1 = 0;
        this.nummer1 = period?.productionPlanning._p1.period0.plannedStock
        // this.nummer1 = period?.planningo.disposition1?._nummer1;
        this.nummer2 = period?.planningo.disposition1?._nummer2 ?? this.value22;
        this.nummer3 = period?.planningo.disposition1?._nummer3 ?? this.value23;
        this.nummer4 = period?.planningo.disposition1?._nummer4 ?? this.value24;
        this.nummer5 = period?.planningo.disposition1?._nummer5 ?? this.value25;
        this.nummer6 = period?.planningo.disposition1?._nummer6 ?? this.value26;
        this.nummer7 = period?.planningo.disposition1?._nummer7 ?? this.value27;
        this.nummer8 = period?.planningo.disposition1?._nummer8 ?? this.value28;
        this.nummer9 = period?.planningo.disposition1?._nummer9 ?? this.value29;
        this.nummer10 = period?.planningo.disposition1?._nummer10 ?? this.value210;
        this.nummer11 = period?.planningo.disposition1?._nummer11 ?? this.value211;
        this.nummer12 = period?.planningo.disposition1?._nummer12 ?? this.value212;


        // Spalte4
        const tempMap: { [key: string]: WaitingListElement } = {}
        period?.result?.waitinglistworkstations?.workplace?.forEach(element => {
          if (element.waitinglist) {
            if (element.waitinglist instanceof Array) {
              console.log(element.waitinglist[0])
              element.waitinglist.forEach(element2 => {
                if(!tempMap[`${element2._period}-${element2._order}-${element2._amount}`]){
                  tempMap[`${element2._period}-${element2._order}-${element2._amount}`] = element2
                }
              })
            } else {
              // element.waitinglist._item
              // element.waitinglist._amount
              if(!tempMap[`${element.waitinglist._period}-${element.waitinglist._order}-${element.waitinglist._amount}`]){
                tempMap[`${element.waitinglist._period}-${element.waitinglist._order}-${element.waitinglist._amount}`] = element.waitinglist
              }
            }
          }
        });

        console.log(tempMap)
        Object.values(tempMap).forEach(element => {
          if (!this.waitinglist[element._item]) {
            this.waitinglist[element._item] = 0
          }
          this.waitinglist[element._item] += element._amount
        })

        this.value31 = this.waitinglist[1] ?? 0;
        this.value32 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          this.waitinglist[26] ?? 0
        );
        this.value33 = this.waitinglist[51] ?? 0;
        this.value34 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          this.waitinglist[16] ?? 0);
        this.value35 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          this.waitinglist[17] ?? 0);
        this.value36 = this.waitinglist[50] ?? 0;
        this.value37 = this.waitinglist[4] ?? 0;
        this.value38 = this.waitinglist[10] ?? 0;
        this.value39 = this.waitinglist[49] ?? 0;
        this.value310 = this.waitinglist[7] ?? 0;
        this.value311 = this.waitinglist[13] ?? 0;
        this.value312 = this.waitinglist[18] ?? 0;

        //Spalte 5
        const tempMap2: { [key: string]: OrdersInWorkWorkplace } = {}
        if (period?.result?.ordersinwork?.workplace instanceof Array) {
          period?.result?.ordersinwork?.workplace?.forEach(element => {
            if (!tempMap2[`${element._id}-${element._period}-${element._order}-${element._amount}`]) {
              tempMap2[`${element._id}-${element._period}-${element._order}-${element._amount}`] = element
            }
          });
        } else if (period?.result?.ordersinwork?.workplace?._period) {
          if (!tempMap2[`${period?.result?.ordersinwork?.workplace._id}-${period?.result?.ordersinwork?.workplace._period}-${period?.result?.ordersinwork?.workplace._order}-${period?.result?.ordersinwork?.workplace._amount}`]) {
            tempMap2[`${period?.result?.ordersinwork?.workplace._id}-${period.result.ordersinwork.workplace._id}-${period.result.ordersinwork.workplace._period}-${period.result.ordersinwork.workplace._order}`] = period?.result?.ordersinwork?.workplace
          }
        }

        Object.values(tempMap2).forEach(element => {
          if (!this.ordersinwork[element._item]) {
            this.ordersinwork[element._item] = 0
          }
          this.ordersinwork[element._item] += element._amount
        })
        this.value41 = this.ordersinwork[1] ?? 0;
        this.value42 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          this.ordersinwork[26] ?? 0);
        this.value43 = this.ordersinwork[51] ?? 0;
        this.value44 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          this.ordersinwork[16] ?? 0);
        this.value45 = calcVerhaeltnis(
          1,
          period.productionPlanning,
          this.ordersinwork[17] ?? 0);
        this.value46 = this.ordersinwork[50] ?? 0;
        this.value47 = this.ordersinwork[4] ?? 0;
        this.value48 = this.ordersinwork[10] ?? 0;
        this.value49 = this.ordersinwork[49] ?? 0;
        this.value410 = this.ordersinwork[7] ?? 0;
        this.value411 = this.ordersinwork[13] ?? 0;
        this.value412 = this.ordersinwork[18] ?? 0;

        //Spalte6

        console.log(this.nummer1, this.dataService.currentPeriod!.planningo.disposition1?._nummer1, this.value21, this.value31, this.value41)


        this.value51 =   (this.dataService.currentPeriod?.input.selldirect?.item.find(x => x._article == 1)?._quantity ?? 0) + (period?.result?.forecast?._p1??0) + (this.nummer1 ??0) - this.value21 - this.value31 - this.value41;
        this.value52 =  Number.parseInt((this.value51 + this.value31 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer2 ?? this.nummer2) - this.value22 - this.value32 - this.value42).toString());
        this.value53 =  Number.parseInt((this.value51 + this.value31 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer3 ?? this.nummer3) - this.value23 - this.value33 - this.value43).toString());
        this.value54 =  Number.parseInt((this.value53 + this.value33 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer4 ?? this.nummer4) - this.value24 - this.value34 - this.value44).toString());
        this.value55 =  Number.parseInt((this.value53 + this.value33 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer5 ?? this.nummer5) - this.value25 - this.value35 - this.value45).toString());
        this.value56 =  Number.parseInt((this.value53 + this.value33 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer6 ?? this.nummer6) - this.value26 - this.value36 - this.value46).toString());
        this.value57 =  Number.parseInt((this.value56 + this.value36 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer7 ?? this.nummer7) - this.value27 - this.value37 - this.value47).toString());
        this.value58 =  Number.parseInt((this.value56 + this.value36 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer8 ?? this.nummer8) - this.value28 - this.value38 - this.value48).toString());
        this.value59 =  Number.parseInt((this.value56 + this.value36 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer9 ?? this.nummer9) - this.value29 - this.value39 - this.value49).toString());
        this.value510 = Number.parseInt((this.value59 + this.value39 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer10 ?? this.nummer10) - this.value210 - this.value310 - this.value410).toString());
        this.value511 = Number.parseInt((this.value59 + this.value39 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer11 ?? this.nummer11) - this.value211 - this.value311 - this.value411).toString());
        this.value512 = Number.parseInt((this.value59 + this.value39 + (this.dataService.currentPeriod!.planningo.disposition1?._nummer12 ?? this.nummer12) - this.value212 - this.value312 - this.value412).toString());

        //Spalte1
        this.value1 = (period?.result?.forecast?._p1 ?? 0) + (this.dataService.currentPeriod?.input.selldirect?.item.find(x => x._article == 1)?._quantity ?? 0)
        this.value2 = this.value51 ?? "-";
        this.value3 = this.value51 ?? "-";
        this.value4 = this.value53 ?? "-";
        this.value5 = this.value53 ?? "-";
        this.value6 = this.value53 ?? "-";
        this.value7 = this.value56 ?? "-";
        this.value8 = this.value56 ?? "-";
        this.value9 = this.value56 ?? "-";
        this.value10 = this.value59 ?? "-";
        this.value11 = this.value59 ?? "-";
        this.value12 = this.value59 ?? "-";


        // console.log("Test_ID1"+_id1);

        // this.value31= period?.result?.waitinglistworkstations.workplace.find(x => x._id ==7)?
        // -> Zuerst alle Arbeitsplätze summieren und dann auf die Menge der Teile zugrifen! 
        //   this.value41= period?.result?.ordersinwork.workplace.;
        // this.value312= period?.result?.ordersinwork.workplace.find(x => x._id == 7)?._amount;
        //Dataservice.Stammdaten <- für die ID Übersicht
        this.cdr.detectChanges()
      }
    })
  }

  setData(event: any, key: string) {
    if (event !== undefined && event !== null) {
      if (key == "nummer1") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer1 = event
        //Spalte6
        this.value51 = this.nummer1 + this.value1 - this.value21 - this.value31 - this.value41
        //Spalte1
        this.value2 = this.value51 ?? "-";
        this.value3 = this.value51 ?? "-";
      }
      if (key == "nummer2") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer2 = event
        //Spalte6
        this.value52 = Number.parseInt((this.nummer2 + this.value31 + this.value2 - this.value22 - this.value32 - this.value42).toString());

      }
      if (key == "nummer3") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer3 = event
        
        //Spalte6
        this.value53 = Number.parseInt((this.nummer3 + this.value31 + this.value3 - this.value23 - this.value33 - this.value43).toString());

        //Spalte1
        this.value4 = this.value53 ?? "-";
        this.value5 = this.value53 ?? "-";
        this.value6 = this.value53 ?? "-";

        delete this.errors.nummer4
        delete this.errors.nummer5
        delete this.errors.nummer6

       //Update zusätzliche Werte von Spalte6
        this.value54 = Number.parseInt((this.nummer4 + this.value33 + this.value4 - this.value24 - this.value34 - this.value44).toString());
        this.value55 = Number.parseInt((this.nummer5 + this.value33 + this.value5 - this.value25 - this.value35 - this.value45).toString());
        this.value56 = Number.parseInt((this.nummer6 + this.value33 + this.value6 - this.value26 - this.value36 - this.value46).toString());

        //Spalte1
        this.value7 = this.value56 ?? "-";
        this.value8 = this.value56 ?? "-";
        this.value9 = this.value56 ?? "-";      

        delete this.errors.nummer7
        delete this.errors.nummer8
        delete this.errors.nummer9

       //Update zusätzliche Werte von Spalte6
        this.value57 =  Number.parseInt((this.nummer7 + this.value36 + this.value7 - this.value27 - this.value37 - this.value47).toString());
        this.value58 =  Number.parseInt((this.nummer8 + this.value36 + this.value8 - this.value28 - this.value38 - this.value48).toString());
        this.value59 =  Number.parseInt((this.nummer9 + this.value36 + this.value9 - this.value29 - this.value39 - this.value49).toString());


         //Spalte6
         this.value59 = Number.parseInt((this.nummer9 + this.value36 + this.value9 - this.value29 - this.value39 - this.value49).toString());
         //Spalte1
         this.value10 = this.value59 ?? "-";
         this.value11 = this.value59 ?? "-";
         this.value12 = this.value59 ?? "-";
 
        delete this.errors.nummer10
        delete this.errors.nummer11
        delete this.errors.nummer12

       //Update zusätzliche Werte von Spalte6
       this.value510 = Number.parseInt((this.nummer10 + this.value39 + this.value10 - this.value210 - this.value310 - this.value410).toString());
       this.value511 = Number.parseInt((this.nummer11 + this.value39 + this.value11 - this.value211 - this.value311 - this.value411).toString());
       this.value512 = Number.parseInt((this.nummer12 + this.value39 + this.value12 - this.value212 - this.value312 - this.value412).toString());
      }
      if (key == "nummer4") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer4 = event
        //Spalte6
        this.value54 = Number.parseInt((this.nummer4 + this.value33 + this.value4 - this.value24 - this.value34 - this.value44).toString());

      }
      if (key == "nummer5") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer5 = event
        //Spalte6
        this.value55 = Number.parseInt((this.nummer5 + this.value33 + this.value5 - this.value25 - this.value35 - this.value45).toString());
      }
      if (key == "nummer6") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer6 = event
        //Spalte6
        this.value56 = Number.parseInt((this.nummer6 + this.value33 + this.value6 - this.value26 - this.value36 - this.value46).toString());
        //Spalte1
        this.value7 = this.value56 ?? "-";
        this.value8 = this.value56 ?? "-";
        this.value9 = this.value56 ?? "-";


        delete this.errors.nummer7
        delete this.errors.nummer8
        delete this.errors.nummer9

       //Update zusätzliche Werte von Spalte6
        this.value57 =  Number.parseInt((this.nummer7 + this.value36 + this.value7 - this.value27 - this.value37 - this.value47).toString());
        this.value58 =  Number.parseInt((this.nummer8 + this.value36 + this.value8 - this.value28 - this.value38 - this.value48).toString());
        this.value59 =  Number.parseInt((this.nummer9 + this.value36 + this.value9 - this.value29 - this.value39 - this.value49).toString());

         //Spalte6
         this.value59 = Number.parseInt((this.nummer9 + this.value36 + this.value9 - this.value29 - this.value39 - this.value49).toString());
         //Spalte1
         this.value10 = this.value59 ?? "-";
         this.value11 = this.value59 ?? "-";
         this.value12 = this.value59 ?? "-";
 
         delete this.errors.nummer10
         delete this.errors.nummer11
         delete this.errors.nummer12
 

        delete this.errors.nummer10
        delete this.errors.nummer11
        delete this.errors.nummer12

       //Update zusätzliche Werte von Spalte6
       this.value510 = Number.parseInt((this.nummer10 + this.value39 + this.value10 - this.value210 - this.value310 - this.value410).toString());
       this.value511 = Number.parseInt((this.nummer11 + this.value39 + this.value11 - this.value211 - this.value311 - this.value411).toString());
       this.value512 = Number.parseInt((this.nummer12 + this.value39 + this.value12 - this.value212 - this.value312 - this.value412).toString());
      }
      if (key == "nummer7") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer7 = event
        //Spalte6
        this.value57 = Number.parseInt((this.nummer7 + this.value36 + this.value7 - this.value27 - this.value37 - this.value47).toString());
      }
      if (key == "nummer8") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer8 = event
        //Spalte6
        this.value58 = Number.parseInt((this.nummer8 + this.value36 + this.value8 - this.value28 - this.value38 - this.value48).toString());
      }
      if (key == "nummer9") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer9 = event
        //Spalte6
        this.value59 = Number.parseInt((this.nummer9 + this.value36 + this.value9 - this.value29 - this.value39 - this.value49).toString());
        //Spalte1
        this.value10 = this.value59 ?? "-";
        this.value11 = this.value59 ?? "-";
        this.value12 = this.value59 ?? "-";

        delete this.errors.nummer10
        delete this.errors.nummer11
        delete this.errors.nummer12

       //Update zusätzliche Werte von Spalte6
       this.value510 = Number.parseInt((this.nummer10 + this.value39 + this.value10 - this.value210 - this.value310 - this.value410).toString());
       this.value511 = Number.parseInt((this.nummer11 + this.value39 + this.value11 - this.value211 - this.value311 - this.value411).toString());
       this.value512 = Number.parseInt((this.nummer12 + this.value39 + this.value12 - this.value212 - this.value312 - this.value412).toString());
      }
      if (key == "nummer10") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer10 = event
        //Spalte6
        this.value510 = Number.parseInt((this.nummer10 + this.value39 + this.value10 - this.value210 - this.value310 - this.value410).toString());
      }
      if (key == "nummer11") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer11 = event
        //Spalte6
        this.value511 = Number.parseInt((this.nummer11 + this.value39 + this.value11 - this.value211 - this.value311 - this.value411).toString());
      }
      if (key == "nummer12") {
        this.dataService.currentPeriod!.planningo.disposition1._nummer12 = event
        //Spalte6
        this.value512 = Number.parseInt((this.nummer12 + this.value39 + this.value12 - this.value212 - this.value312 - this.value412).toString());
      }
      console.log(event)
    }
  }

  safeData() {
    this.dataService.currentPeriod!.productionorders.disposition1 = [
      {
        _id: 1,
        _amount: this.value51,
      },
      {
        _id: 26,
        _amount: this.value52,
      },
      {
        _id: 51,
        _amount: this.value53,
      },
      {
        _id: 16,
        _amount: this.value54,
      },
      {
        _id: 17,
        _amount: this.value55,
      },
      {
        _id: 50,
        _amount: this.value56,
      },
      {
        _id: 4,
        _amount: this.value57,
      },
      {
        _id: 10,
        _amount: this.value58,
      },
      {
        _id: 49,
        _amount: this.value59,
      },
      {
        _id: 7,
        _amount: this.value510,
      },
      {
        _id: 13,
        _amount: this.value511,
      },
      {
        _id: 18,
        _amount: this.value512,
      }
    ]
  }
  checkInput(event: any, key: string) {
    if (event === null) {
      this.errors[key] = $localize`:@@ERROR_REQUIRED:Dieses Feld muss ausgefüllt werden`
    } else if (event < 0 || event.toString().includes("-")) {
      this.errors[key] = $localize`:@@ERROR_MUST_BE_POSITIVE:Der Wert muss positiv sein`;
    } else if (event % 10 != 0) {
        this.errors[key] = $localize`:@@ERROR_ONLY_TENS:Nur Zehnerschritte möglich`;
    } else if (
      event.toString().includes(".") || event.toString().includes(",") ) {
      this.errors[key] = $localize `:@@ERROR_MUST_BE_A_WHOLE_NUMBER:Es dürfen nur ganze Zahlen eingetragen werden`
     } else {
      delete this.errors[key];
    }
  }

  back = () => this.router.navigate([`/steps/sellwish`]); 

  next = () => {

    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer2){
      this.setData(this.nummer2,"nummer2")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer3){
      this.setData(this.nummer3,"nummer3")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer4){
      this.setData(this.nummer4,"nummer4")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer5){
      this.setData(this.nummer5,"nummer5")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer6){
      this.setData(this.nummer6,"nummer6")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer7){
      this.setData(this.nummer7,"nummer7")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer8){
      this.setData(this.nummer8,"nummer8")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer9){
      this.setData(this.nummer9,"nummer9")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer10){
      this.setData(this.nummer10,"nummer10")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer11){
      this.setData(this.nummer11,"nummer11")
    }
    if(!this.dataService.currentPeriod!.planningo.disposition1?._nummer12){
      this.setData(this.nummer12,"nummer12")
    }

    //Überprüfung der Produktionsaufträge für die kommende Periode und geplante Lagerbestände am Ende der Planperiode
    this.CheckErrors(this.value52,this.dataService.currentPeriod!.planningo.disposition1?._nummer2,"nummer2")
    this.CheckErrors(this.value53,this.dataService.currentPeriod!.planningo.disposition1?._nummer3,"nummer3")
    this.CheckErrors(this.value54,this.dataService.currentPeriod!.planningo.disposition1?._nummer4,"nummer4")
    this.CheckErrors(this.value55,this.dataService.currentPeriod!.planningo.disposition1?._nummer5,"nummer5")
    this.CheckErrors(this.value56,this.dataService.currentPeriod!.planningo.disposition1?._nummer6,"nummer6")
    this.CheckErrors(this.value57,this.dataService.currentPeriod!.planningo.disposition1?._nummer7,"nummer7")
    this.CheckErrors(this.value58,this.dataService.currentPeriod!.planningo.disposition1?._nummer8,"nummer8")
    this.CheckErrors(this.value59,this.dataService.currentPeriod!.planningo.disposition1?._nummer9,"nummer9")
    this.CheckErrors(this.value510,this.dataService.currentPeriod!.planningo.disposition1?._nummer10,"nummer10")
    this.CheckErrors(this.value511,this.dataService.currentPeriod!.planningo.disposition1?._nummer11,"nummer11")
    this.CheckErrors(this.value512,this.dataService.currentPeriod!.planningo.disposition1?._nummer12,"nummer12")

    if (Object.keys(this.errors).length > 0) {
      console.log("Error" + this.errors)
      this.notificationsService
      .show($localize`:@@ERROR_FAILS:Bitte fehlerhafte Felder prüfen`, {
        status: TuiNotification.Error,
      })
      .subscribe();
      return;
    }
    if (this.dataService.currentPeriod)
    this.dataService.updatePeriod(this.dataService.currentPeriod, 'disposition1');
    
    this.activeItem = 1
    this.activeItemChange.emit(this.activeItem);

    this.safeData();
  }  

  CheckErrors(value5x : number, event: any,  key : string){
    if (value5x< 0) {
      this.errors[key] = $localize`:@@ERROR_MUST_BE_POSITIVE:Der Produktionsauftrag für die kommende Periode muss positiv sein`
} else if (event === null) {
  this.errors[key] = $localize`:@@ERROR_REQUIRED:Dieses Feld muss ausgefüllt werden`
} else if (event < 0 || event.toString().includes("-")) {
  this.errors[key] = $localize`:@@ERROR_MUST_BE_POSITIVE:Der Wert muss positiv sein`;
} else if (
  event.toString().includes(".") || event.toString().includes(",") ) {
  this.errors[key] = $localize `:@@ERROR_MUST_BE_A_WHOLE_NUMBER:Es dürfen nur ganze Zahlen eingetragen werden`
  }
else {
  delete this.errors[key];
}
  }
}
