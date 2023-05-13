import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/data.service';
import { WorkingTime } from 'src/app/_models/input-data.model';
import { workingtimeDetails, newOrders} from 'src/app/_models/workingtime.model';

@Component({
  selector: 'app-workingtime',
  templateUrl: './workingtime.component.html',
  styleUrls: ['./workingtime.component.scss'],
})
export class WorkingtimeComponent implements OnInit {
  tempInput: WorkingTime[] = [
    { _station: 1, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 2, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 3, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 4, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 6, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 7, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 8, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 9, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 10, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 11, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 12, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 13, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 14, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
    { _station: 15, _shift: 1, _overtime: 0, _suggestion: 0, _setuptime: 0, _processingtime: 0 },
  ];

  //Zeile 1 und 5 bleiben leer
  tempWorkingtimeDetails: workingtimeDetails[] = [
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
    { _newOrders: [], _waitinglist: 0, _ordersInWork: 0, _setuptimeOld: 0, _setuptimeNew: 0},
  ];

  constructor(
    public dataService: DataService,
    private router: Router,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private cdr: ChangeDetectorRef
  ) {}
  errors?: any = {}



  ngOnInit(): void {
    if (!this.dataService.currentPeriod) {
      this.router.navigate(['/steps/upload']);
    }

    this.dataService.currentPeriodObservable.pipe(take(1)).subscribe(() => {
      this.workingtimeStation();
      this.cdr.detectChanges();
    });
  }
  back = () => this.router.navigate(['/steps/production']);
  next = () => {
    if (this.dataService.currentPeriod){

    if (Object.keys(this.errors).length > 0) {
      this.notificationsService
        .show('Es sind nicht alle Felder richtig ausgefüllt', {
          status: TuiNotification.Error,
        })
        .subscribe();
      return;
    }

    if (this.dataService.currentPeriod.workingtime.updatedWorkingtime){
      this.dataService.currentPeriod.input.workingtimelist ={workingtime: this.dataService.currentPeriod?.workingtime?.updatedWorkingtime!}
    }
    if (this.dataService.currentPeriod.workingtime.defaultWorkingtime && !this.dataService.currentPeriod.workingtime.updatedWorkingtime){ 
      this.dataService.currentPeriod.input.workingtimelist ={workingtime: this.dataService.currentPeriod?.workingtime?.defaultWorkingtime!}
    }

    this.dataService.updatePeriod(this.dataService.currentPeriod,  'workingtime');
    this.router.navigate(['/steps/order']);
    }
  };
  public workingtimeStation() {
      for (let i in this.tempInput) {
        for (let j in this.dataService.stammdatenNachArbeitsplatz) {
          if (
            (this.tempInput[i]._station == parseInt(j))
          ) {
            this.addProcessingtime(j);
            this.addSetuptime(j);
          }
        }
      }
      console.log(this.tempInput);
      console.log(this.tempWorkingtimeDetails);
      if (this.dataService.currentPeriod){
        this.dataService.currentPeriod.workingtime.defaultWorkingtime = this.tempInput;
        this.dataService.currentPeriod.workingtime.defaultWorkingtimeDetails = this.tempWorkingtimeDetails;
      }
  }

  addProcessingtime(j: any) {
    var tempZeile = 0;
    if (j < 5) {
      tempZeile = j - 1;
    } else {
      tempZeile = j - 2;
    }
    var tempProcessingtime = 0;
    if (this.dataService.currentPeriod?.production.afterSplitting)
    var tempafterSplitting = this.dataService.currentPeriod.production.afterSplitting;
    Object.values(
      this.dataService.stammdatenNachArbeitsplatz[j].Artikel
    ).forEach((item: any) => {
      for (let h in tempafterSplitting){
        const num = item.Artikelnummer.replace(/^\D+|\D+$/g, '');
        const hInt = parseInt(h)
        if (tempafterSplitting && tempafterSplitting?.[hInt] && num == tempafterSplitting[hInt]?._article){
          tempProcessingtime = tempProcessingtime + (item.Bearbeitungszeit * tempafterSplitting[hInt]!._quantity);
          var tempNewOrder: newOrders = { _item: "", _quantity: 0, _processingtime: 0};
          tempNewOrder._item = item.Artikelnummer;
          // funktioniert bei Splitting nicht (wird ignoriert)
          tempNewOrder._quantity += tempafterSplitting[hInt]!._quantity;
          tempNewOrder._processingtime = item.Bearbeitungszeit;
          this.tempWorkingtimeDetails[j]._newOrders.push(tempNewOrder);
        }
      }
    });
    // Zeitbedarf aus WS eingerechnet
    this.dataService.currentPeriod?.result?.waitinglistworkstations?.workplace?.forEach((itemWS:any) =>{
      if (itemWS._id == j && itemWS._timeneed > 0){
        tempProcessingtime = tempProcessingtime + itemWS._timeneed;
        this.tempWorkingtimeDetails[j]._waitinglist = itemWS._timeneed;
      }
      });

      // Zeitbedarf aus IB eingerechnet
      if(this.dataService.currentPeriod?.result?.ordersinwork?.workplace instanceof Array){
        this.dataService.currentPeriod?.result?.ordersinwork?.workplace?.forEach((itemIB:any) =>{
          if (itemIB._id == j && itemIB._timeneed > 0){
            tempProcessingtime = tempProcessingtime + itemIB._timeneed;
            this.tempWorkingtimeDetails[j]._ordersInWork = itemIB._timeneed;
          }
      });
               
      }else if(this.dataService.currentPeriod?.result?.ordersinwork?.workplace){
        if (this.dataService.currentPeriod?.result?.ordersinwork?.workplace._id == j && this.dataService.currentPeriod?.result?.ordersinwork?.workplace._timeneed > 0){
          tempProcessingtime = tempProcessingtime + this.dataService.currentPeriod?.result?.ordersinwork?.workplace._timeneed;
          this.tempWorkingtimeDetails[j]._ordersInWork = this.dataService.currentPeriod?.result?.ordersinwork?.workplace._timeneed;
        }
      }
    if (tempProcessingtime >= 0 && tempProcessingtime != null){
    this.tempInput[tempZeile]._processingtime = tempProcessingtime;
    }
  }

  addSetuptime(j: any) {
    var tempSetuptime = 0;
    var setups = 0;
    var tempZeile = 0;
    if (j < 5) {
      tempZeile = j - 1;
    } else {
      tempZeile = j - 2;
    }
    Object.values(
      this.dataService.stammdatenNachArbeitsplatz[j].Artikel
    ).forEach((item: any) => {
      // wie soll mit einfließen, dass mehr oder weniger produziert wird?
      // wie soll einfließen, dass pro Staion mehr oder weniger Schritte durchgeführt werden?
      // grade einfach nur doppelte Rüstzeit pro Artikel
      if (j == 7 || j == 8 || j == 9){
        tempSetuptime = tempSetuptime + (item.Rüstzeit * 2.5);
      }
      else{
      tempSetuptime = tempSetuptime + (item.Rüstzeit * 2);
      }
      setups = setups + 1;
      // RZ aus WS einberechnet
      this.dataService.currentPeriod?.result?.waitinglistworkstations?.workplace?.forEach((itemWS:any) =>{
        const num = item.Artikelnummer.replace(/^\D+|\D+$/g, '');
        if (itemWS._id == j && itemWS._timeneed > 0 && itemWS._item == num){
          tempSetuptime = tempSetuptime + (2 * item.Rüstzeit);
          this.tempWorkingtimeDetails[j]._setuptimeOld = this.tempWorkingtimeDetails[j]._setuptimeOld + (item.Rüstzeit * 2);
        }
      });
      // RZ aus IB einberechnet
      if(this.dataService.currentPeriod?.result?.ordersinwork?.workplace instanceof Array){
        this.dataService.currentPeriod?.result?.ordersinwork?.workplace?.forEach((itemIB:any) =>{
          const num = item.Artikelnummer.replace(/^\D+|\D+$/g, '');
          if (itemIB._id == j && itemIB._timeneed > 0 && itemIB._item == num){
            tempSetuptime = tempSetuptime + (item.Rüstzeit * 2);
            this.tempWorkingtimeDetails[j]._setuptimeOld = this.tempWorkingtimeDetails[j]._setuptimeOld + item.Rüstzeit * 2;
          }
        })
      }else if(this.dataService.currentPeriod?.result?.ordersinwork?.workplace){
        const num = item.Artikelnummer.replace(/^\D+|\D+$/g, '');
        if (this.dataService.currentPeriod?.result?.ordersinwork?.workplace._id == j && this.dataService.currentPeriod?.result?.ordersinwork?.workplace._timeneed > 0 && this.dataService.currentPeriod?.result?.ordersinwork?.workplace._item == num){
          tempSetuptime = tempSetuptime + (item.Rüstzeit);
          this.tempWorkingtimeDetails[j]._setuptimeOld = this.tempWorkingtimeDetails[j]._setuptimeOld + item.Rüstzeit;
        }
      }
    });
    // braucht man da noch einen error?
    if (this.dataService.currentPeriod?.workingtime.updatedWorkingtime?.[tempZeile]?._setuptime){
      this.tempInput[tempZeile]._setuptime = this.dataService.currentPeriod?.workingtime.updatedWorkingtime?.[tempZeile]._setuptime;
      this.tempInput[tempZeile]._suggestion = Math.ceil(tempSetuptime);
    }
    else if(tempSetuptime >= 0 && tempSetuptime != null){
      this.tempInput[tempZeile]._setuptime = Math.ceil(tempSetuptime);
      this.tempInput[tempZeile]._suggestion = Math.ceil(tempSetuptime);
      var capacity = Math.ceil(tempSetuptime) + this.tempInput[tempZeile]._processingtime;
      this.addShift(tempZeile, capacity);
    }

    if(this.tempInput[tempZeile]._shift == 2){
      this.tempInput[tempZeile]._setuptime = Math.ceil(this.tempInput[tempZeile]._setuptime * 2);
    }else    if(this.tempInput[tempZeile]._shift == 3){
      this.tempInput[tempZeile]._setuptime = Math.ceil(this.tempInput[tempZeile]._setuptime * 3);
    }
    if(this.tempInput[tempZeile]._overtime != 0){
      this.tempInput[tempZeile]._setuptime = Math.ceil(this.tempInput[tempZeile]._setuptime * 1.2);
    } 

    var capacity = Math.ceil(this.tempInput[tempZeile]._setuptime) + this.tempInput[tempZeile]._processingtime;
    this.addShift(tempZeile, capacity);

    if (this.dataService.currentPeriod?.workingtime.defaultWorkingtimeDetails?.[j]._setuptimeOld)
      this.tempWorkingtimeDetails[j]._setuptimeNew = this.dataService.currentPeriod?.workingtime.defaultWorkingtimeDetails?.[j]._setuptimeOld;
    
    if (this.dataService.currentPeriod?.workingtime.defaultWorkingtimeDetails?.[j]._setuptimeNew)
      this.tempWorkingtimeDetails[j]._setuptimeNew = this.dataService.currentPeriod?.workingtime.defaultWorkingtimeDetails?.[j]._setuptimeNew;
    else
      this.tempWorkingtimeDetails[j]._setuptimeNew = this.tempInput[tempZeile]._setuptime - this.tempWorkingtimeDetails[j]._setuptimeOld;
  }

  addShift(j: any, capacity: any) {
    delete this.errors[`${this.tempInput[j]._station}.overtime`] 
    // was machen wir bei Overtime mit Nachkommastellen? - grade wird aufgerundet
    if (capacity < 3600 && capacity >= 0) {
      this.tempInput[j]._shift = 1;
      if (capacity > 2400) this.tempInput[j]._overtime = Math.ceil((capacity - 2400) / 5);
    }
    if (capacity > 3600 && capacity < 6000) {
      this.tempInput[j]._shift = 2;
      if (capacity > 4800){
        this.tempInput[j]._overtime = Math.ceil((capacity - 4800) / 5);
      }
    }
    if (capacity > 6000){
      this.tempInput[j]._shift = 3;
      this.tempInput[j]._overtime = 0

    } 
    if (capacity > 7200){
      this.errors[`${this.tempInput[j]._station}.overtime`] = $localize`:@@ERROR_MAX_KAPA:Kapazitätsgrenze erreicht, bitte verringern Sie die geplante Produktionsmenge`
      this.cdr.detectChanges();
      console.log(this.errors)
    }
  }

  updateSetuptime(a_station: any, a_setuptime: any){
    delete this.errors[`${a_station}.setuptime`] 

    console.log('updateSetupTime', a_station, a_setuptime)
    var a_station_temp = 0;
    if (a_station < 5) {
      a_station_temp = a_station - 1;
    } else {
      a_station_temp = a_station - 2;
    }
    if (a_setuptime < 0){
      this.errors[`${a_station}.setuptime`] = $localize`:@@ERROR_BUILDING_NOT_NEGATIVE:Die Rüstzeit darf nicht negativ sein!`
      this.cdr.detectChanges();
      console.log(this.errors)
    }
    if (Number.parseFloat(a_setuptime) % 1 !== 0){
      this.errors[
        a_station+'.setuptime'
      ]= `Es sind nur positive ganze Zahlen erlaubt!`;
      this.cdr.detectChanges();
    }
    if (a_setuptime > (7200 - this.tempInput[a_station_temp]._processingtime)){
    this.errors[`${a_station}.setuptime`] = $localize`:@@ERROR_BUILDING_NOT_HIGHER_KAPA:Die eingetragene Rüstzeit darf nicht über der Kapazitätsgrenze liegen!`
    this.cdr.detectChanges();
    console.log(this.errors)
    }
    if (a_setuptime < (this.tempInput[a_station_temp]._suggestion! / 2)){
    this.errors[`${a_station}.setuptime`] = $localize`:@@ERROR_CHECK_BUILDING_TIME:Vorsicht! Es wurde weniger als die Hälfte der empfohlenen Rüstzeit eingetragen!`
    this.cdr.detectChanges();
    console.log(this.errors)
    }

    if (a_setuptime == null){
      a_setuptime = 0;
    }

    if(this.dataService.currentPeriod?.workingtime.defaultWorkingtimeDetails?.[a_station]._ordersInWork != 0 || this.dataService.currentPeriod?.workingtime.defaultWorkingtimeDetails?.[a_station]._waitinglist != 0){
      this.tempWorkingtimeDetails[a_station]._setuptimeOld = a_setuptime / 2;
      this.tempWorkingtimeDetails[a_station]._setuptimeNew = a_setuptime / 2; 
    }
    else{
    this.tempWorkingtimeDetails[a_station]._setuptimeOld = 0;
    this.tempWorkingtimeDetails[a_station]._setuptimeNew = a_setuptime;
    }

    this.tempInput[a_station_temp]._setuptime = a_setuptime;
    var capacity = this.tempInput[a_station_temp]._processingtime + a_setuptime;
    this.addShift(a_station_temp, capacity);

    if (this.dataService.currentPeriod){
      this.dataService.currentPeriod.workingtime.updatedWorkingtime = this.tempInput;
    }
  }
}