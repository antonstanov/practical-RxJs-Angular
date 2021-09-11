import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'practical-RxJs-Angular';

  timer$ = timer(1000, 1000).pipe(map(data => data + 1), tap(console.log), tap(_ => {}))
}
