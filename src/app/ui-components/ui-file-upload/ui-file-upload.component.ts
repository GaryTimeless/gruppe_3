import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { tuiPure } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, of, timer } from 'rxjs';
import { map, mapTo, share, startWith, switchMap, tap } from 'rxjs/operators';

class RejectedFile {
  constructor(readonly file: TuiFileLike, readonly reason: string) {}
}

function convertRejected({ file, reason }: RejectedFile): TuiFileLike {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    content: reason,
  };
}

@Component({
  selector: 'app-ui-file-upload',
  templateUrl: './ui-file-upload.component.html',
  styleUrls: ['./ui-file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFileUploadComponent {
  readonly control = new FormControl();

  @Output() fileChange = new EventEmitter();

  @tuiPure
  get loading$(): Observable<ReadonlyArray<File>> {
    return this.requests$.pipe(
      map((file) => (file instanceof File ? [file] : [])),
      startWith([])
    );
  }

  @tuiPure
  get rejected$(): Observable<ReadonlyArray<TuiFileLike>> {
    return this.requests$.pipe(
      map((file) =>
        file instanceof RejectedFile ? [convertRejected(file)] : []
      ),
      tap(({ length }) => {
        if (length) {
          this.control.setValue(null);
        }
      }),
      startWith([])
    );
  }

  @tuiPure
  private get requests$(): Observable<RejectedFile | File | null> {
    return this.control.valueChanges.pipe(
      switchMap((file) =>
        file ? this.serverRequest(file).pipe(startWith(file)) : of(null)
      ),
      share()
    );
  }

  private serverRequest(file: File): Observable<RejectedFile | File | null> {
    const delay = 500;
    const result = null;
    file.text().then((res) => {
      this.fileChange.next(res)
    });
    return timer(delay).pipe(mapTo(result));
  }
}
