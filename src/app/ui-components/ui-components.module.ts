import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFileUploadComponent } from './ui-file-upload/ui-file-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputFileModule } from '@taiga-ui/kit';
import { TuiScrollbarModule } from '@taiga-ui/core';

@NgModule({
  declarations: [UiFileUploadComponent],
  exports: [UiFileUploadComponent],
  imports: [CommonModule, TuiInputFileModule, ReactiveFormsModule, TuiScrollbarModule],
})
export class UiComponentsModule {}
