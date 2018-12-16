import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Observer, Subject, Subscription, timer } from 'rxjs';
import { filter, map, scan, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DoeverythingService } from './doeverything.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'obstut';

  private observableSync = Observable.create(this.subscribe1);
  private observableAsync = Observable.create(this.subscribe2);
  private observableMixed = Observable.create(this.subscribe3);
  private subscription: Subscription;
  private subject = new Subject<number>();

  public clickCount: number;

  public v: string;

  // per spiegare async pipe
  public time = new Observable(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });

  public observer1: Observer<number> = {
    next: (x) => console.log(`Observer1: ${x}`),
    error: (err) => console.log(`Error 1: ${err}`),
    complete: () => console.log(`Observer1: finito`),
  };

  public observer2: Observer<number> = {
    next: (x) => console.log(`Observer2: ${x}`),
    error: (err) => console.log(`Error 2: ${err}`),
    complete: () => console.log(`Observer2: finito`),
  };

  public observer3: Observer<void> = {
    next: () => console.log(`Observer3: clicked`),
    error: (err) => console.log(`Error 2: ${err}`),
    complete: () => console.log(`Observer3: finito`),
  };

  constructor(private des: DoeverythingService) { }

  public ngOnInit() {
    const fastClickButton = document.getElementById('fastClick') as HTMLButtonElement;
    this.subscription = fromEvent(fastClickButton, 'click')
      .pipe(
        map(e => 1),
        scan((c: number) => c + 1, 0)
      )
      .subscribe(c => {
        this.clickCount = c;
        console.log('clicked' + c);
      });
  }

  public click(): void {
    console.log('Prima di subscribe');
    this.subscription = this.observableAsync.subscribe((msg) => console.log(msg));
    console.log('Dopo subscribe');
  }

  public click3(): void {
    console.log('Prima di subscribe');
    this.subscription = this.observableSync.subscribe({
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    });
    console.log('Dopo subscribe');
  }

  public click4(): void {
    console.log('Prima di subscribe');
    this.subscription = this.observableMixed.subscribe({
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    });
    console.log('Dopo subscribe');
  }

  public click2(): void {
    this.subscription.unsubscribe();
  }

  public click5(): void {
    this.subject.subscribe(this.observer1);
    this.subject.subscribe(this.observer2);
    this.subject.next(4);
    this.subject.next(5);
    this.subject.next(6);
    this.subject.next(7);
  }

  public startNumberGeneration() {
    const randomObservable = Observable.create(this.randomGenerator);
    this.subscription = randomObservable.pipe(
      takeUntil(timer(4000)),
      tap(n => console.log(`Before filter ${n}`)),
      filter(n => n > 40)
    ).subscribe(n => console.log(n));
  }

  public fakeHttp0() {
    this.des.fakeHttp('FAKE1', 3500).subscribe(x =>
      console.log(x));
    this.des.fakeHttp('FAKE2', 500).subscribe(x => console.log(x));
  }

  public fakeHttp() {
    const f1 = this.des.fakeHttp('FAKE1', 3500);
    const f2 = f1.pipe(switchMap(
      v => {
        return this.des.fakeHttp(`FAKE2 ${v}`, 500);
      }
    ));
    // f2.subscribe(console.log);
    // f2.subscribe(v => this.v = v);
  }

  private randomGenerator(observer): Function {
    const i = setInterval(() => {
      const r = Math.floor(Math.random() * 100);
      observer.next(r);
    }, 500);

    return function unsubscribe() {
      clearInterval(i);
    };
  }

  private subscribe1(observer): void {
    observer.next('Primo');
    observer.next('Secondo');
    observer.next('Terzo');
    observer.complete();
  }

  private subscribe2(observer): Function {
    const id = setInterval(() => {
      console.log('sub2');
      observer.next('ciao');
    }, 1000);
    return function unsubscribe() {
      clearInterval(id);
    };
  }

  private subscribe3(observer): void {
    observer.next('Primo');
    observer.next('Secondo');
    observer.next('Terzo');
    setTimeout(() => {
      observer.next('Quarto');
      observer.complete();
    }, 4000);
  }
}
