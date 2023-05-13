import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { DataService } from 'src/app/data.service';
import { Item } from 'src/app/_models/input-data.model';

@Component({
  selector: 'app-selldirect',
  templateUrl: './selldirect.component.html',
  styleUrls: ['./selldirect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelldirectComponent implements OnInit {
  p1:Item = {_article:1, _penalty: 0, _price: 0,_quantity:0}
  p2:Item = {_article:2, _penalty: 0, _price: 0,_quantity:0}
  p3:Item = {_article:3, _penalty: 0, _price: 0,_quantity:0}

  constructor(
    public dataService: DataService,
    private router:Router,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    private cdr:ChangeDetectorRef
    ) {}
    errors?: any = {}

  ngOnInit(): void {
    if(!this.dataService.currentPeriod){
      this.router.navigate(['/steps/upload'])
    }

    this.dataService.currentPeriodObservable.subscribe(res => {
      if(this.dataService.currentPeriod?.input.selldirect?.item && this.dataService.currentPeriod?.input.selldirect?.item.length == 3){
      this.p1 = this.dataService.currentPeriod?.input.selldirect?.item[0]
      this.p2 = this.dataService.currentPeriod?.input.selldirect?.item[1]
      this.p3 = this.dataService.currentPeriod?.input.selldirect?.item[2]
      console.log(this.p1, this.p2, this.p3)
      this.cdr.detectChanges()
      }
    })
  }

back = () => this.router.navigate(['/steps/upload']);
next = () => {
  console.log(this.p1,this.p2,this.p3)
  if (this.dataService.currentPeriod && this.dataService.currentPeriod.input) {
  this.errors = false;

  this.checkError('_quantity', 'p1');
  this.checkError('_quantity', 'p2');
  this.checkError('_quantity', 'p3');
  this.checkErrorQuantity('_quantity', 'p1');
  this.checkErrorQuantity('_quantity', 'p2');
  this.checkErrorQuantity('_quantity', 'p3');
  this.checkError('_price', 'p1');
  this.checkError('_price', 'p2');
  this.checkError('_price', 'p3');
  this.checkError('_penalty', 'p1');
  this.checkError('_penalty', 'p2');
  this.checkError('_penalty', 'p3');

  if (this.errors) {
    this.notificationsService
      .show(this.errors, {
        status: TuiNotification.Error,
      })
      .subscribe();
    return;
  }

  this.dataService.currentPeriod.input.selldirect = {item :[this.p1, this.p2, this.p3]}
 console.log( this.dataService.currentPeriod.input.selldirect.item)
      this.dataService.updatePeriod(this.dataService.currentPeriod, 'selldirect');


  this.router.navigate(['/steps/sellwish']);
}
}

checkError(
column: '_quantity' | '_price' | '_penalty',
element: 'p1' | 'p2' | 'p3'
) {
  if (
    (this[element][column]) < 0 || (this[element][column] == undefined)
  ) {
    this.errors = $localize `:@@ERROR_MUST_BE_POSITIVE_AND_FILLED:Es müssen alle Felder ausgefüllt und positiv sein!`
   }
}
checkErrorQuantity(
  column: '_quantity' | '_price' | '_penalty',
  element: 'p1' | 'p2' | 'p3'
  ) {
    if (
        this[element][column] % 10 !== 0
    ) {
      this.errors = $localize `:@@ERROR_MUST_BE_POSITIVE_AND_TENS:Es sind nur positive ganze Zahlen in 10er Blöcken als Menge erlaubt!`
     }
  }
};