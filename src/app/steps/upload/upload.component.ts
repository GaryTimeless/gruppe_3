import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Planning } from 'src/app/_models/planning.model';
import { Results } from 'src/app/_models/result-data.model';
import { ResultDataParseService } from 'src/app/_services/result-data-parse.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent implements OnInit {
  public parsed?: Results;
  public periods?: Planning[];
  loading = false;
  error?:string

  constructor(
    private resultDataParseService: ResultDataParseService,
    private dataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService.loadPeriods().subscribe((res) => {
      this.periods = res;
      console.log('periods', this.periods)
      this.cdr.detectChanges();
    });
  }

  createPeriod() {
    if (this.parsed) {
      this.loading = true;
      this.dataService
        .addPeriod(this.parsed._period + 1, this.parsed)
        .then((res) => {
          this.loading = false;

          this.router.navigate(['/steps/selldirect']);
        });
    }
  }

  selectPeriod(period:Planning){
    this.dataService.selectPeriod(period)
    this.router.navigate(['/steps/selldirect']);
  }

  deletePeriod(periodId:string){
    console.log(periodId)
    this.dataService.deletePeriod(periodId.toString())
  }

  fileLoaded(content: string) {
    delete this.error
    const res = this.resultDataParseService.parseFromXML(content);
    console.log('RES', res)
    if (res) {
      this.parsed = res;
      console.log(this.parsed);
      if(!res._period){
        this.error="Diese Datei ist keine Ergebnis-Datei."
      }
      this.cdr.detectChanges();
    }else{
      this.error="Diese Datei ist keine Ergebnis-Datei."
    }
  }
}
