/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Point } from './nodes.directive';

@Injectable({
  providedIn: 'root',
})
export class DiagramService {
  private grabbedNodesSubject: BehaviorSubject<Point[]> = new BehaviorSubject<
    Point[]
  >([]);

  private viewboxSubject = new BehaviorSubject({
    top: 0,
    left: 0,
    tX: 0,
    tY: 0,
    scale: 1,
  });
  private PIXI_APP = null;
  constructor() {}

  grabNode(node: Point): void {
    this.grabbedNodesSubject.next([node]);
  }
  selectGrabbedNode() {
    return this.grabbedNodesSubject.asObservable();
  }
  getGrabbedState() {
    return this.grabbedNodesSubject.getValue().length > 0;
  }
  removeGrabbed() {
    this.grabbedNodesSubject.next([]);
  }

  moveNode(dx: number, dy: number): void {
    const { scale } = this.viewboxSubject.value;
    const oldGrab = this.grabbedNodesSubject.getValue();
    if (oldGrab.length > 0) {
      this.grabbedNodesSubject.next([]);
      oldGrab[0].x = dx;
      oldGrab[0].y = dy;
      this.grabbedNodesSubject.next(oldGrab);
    }
  }
  syncViewBox(newViewBox: any): void {
    this.viewboxSubject.next(newViewBox);
  }

  setApp(app: PIXI.Application) {
    this.PIXI_APP = app;
  }
  getApp() {
    return this.PIXI_APP;
  }
}
