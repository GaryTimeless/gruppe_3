import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsComponent } from './steps.component';
import { SellwishComponent } from './sellwish/sellwish.component';
import { SelldirectComponent } from './selldirect/selldirect.component';
import { UploadComponent } from './upload/upload.component';
import { PlanningComponent } from './planning/planning.component';
import { ProductionComponent } from './production/production.component';
import { WorkingtimeComponent } from './workingtime/workingtime.component';
import { OrderComponent } from './order/order.component';
import { SummaryComponent } from './summary/summary.component';
import { RouterModule, Routes } from '@angular/router';
import { TuiCheckboxModule, TuiInputCountModule, TuiInputModule, TuiInputNumberModule, TuiIslandModule, TuiStepperModule, TuiTagModule } from '@taiga-ui/kit';
import { UiComponentsModule } from '../ui-components/ui-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiGroupModule, TuiHintModule, TuiSvgModule, TuiTooltipModule } from '@taiga-ui/core';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiTabsModule } from '@taiga-ui/kit';
import { Disposition1Component } from './planning/disposition1/disposition1.component';
import { Disposition2Component } from './planning/disposition2/disposition2.component';
import { Disposition3Component } from './planning/disposition3/disposition3.component';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiScrollbarModule } from '@taiga-ui/core';
import {TuiToggleModule} from '@taiga-ui/kit';


const routes: Routes = [
  {
    path: '',
    component: StepsComponent,
    children: [
      {
        path: 'upload',
        component: UploadComponent,
      },
      { path: 'sellwish', component: SellwishComponent },
      { path: 'selldirect', component: SelldirectComponent },
      { path: 'planning', component: PlanningComponent },
      { path: 'production', component: ProductionComponent },
      { path: 'workingtime', component: WorkingtimeComponent },
      { path: 'order', component: OrderComponent },
      { path: 'summary', component: SummaryComponent },
    ],
  },
];

@NgModule({
  declarations: [
    StepsComponent,
    SellwishComponent,
    SelldirectComponent,
    UploadComponent,
    PlanningComponent,
    ProductionComponent,
    WorkingtimeComponent,
    OrderComponent,
    SummaryComponent,
    Disposition1Component,
    Disposition2Component,
    Disposition3Component,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    TuiButtonModule,
    TuiIslandModule,
    TuiInputNumberModule,
    TuiStepperModule,
    TuiGroupModule,
    TuiSvgModule,
    UiComponentsModule,
    TuiTabsModule,
    TuiSvgModule,
    TuiInputCountModule,
    TuiCheckboxModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiScrollbarModule,
    TuiTooltipModule, 
    TuiHintModule,
    TuiTagModule,
    TuiToggleModule,
  ],
})
export class StepsModule {}
