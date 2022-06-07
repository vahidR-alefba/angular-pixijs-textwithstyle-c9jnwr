import { DiagramService } from './diagram.service';
/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Point {
  x: number;
  y: number;
}
interface Box {
  width: number;
  height: number;
}
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[nodeZoomable]',
})
export class NodeZoomableDirective implements OnInit, AfterViewInit {
  @Input() canvasElement!: HTMLElement;

  private isPanning = false;
  private startPoint: Point = { x: 0, y: 0 };
  private endPoint: Point = { x: 0, y: 0 };

  private element: HTMLElement;
  private zoomStep = 0.05;
  private viewboxSubject = new BehaviorSubject({
    top: 0,
    left: 0,
    tX: 0,
    tY: 0,
    scale: 1,
  });
  constructor(
    private renderer: Renderer2,
    elementRef: ElementRef,
    private diagram: DiagramService
  ) {
    this.element = elementRef.nativeElement;
  }
  ngAfterViewInit(): void {
    const rect = this.element.getBoundingClientRect();

    this.viewboxSubject.next({
      ...this.viewboxSubject.value,
      top: rect.top,
      left: rect.left,
    });
    this.diagram.syncViewBox(this.viewboxSubject.value);
  }

  ngOnInit(): void {}

  @HostListener('mousewheel', ['$event'])
  onMouseWheel(e: WheelEvent): void {
    const hRef = this.canvasElement.clientHeight;
    const wRef = this.canvasElement.clientWidth;

    const viewbox = this.viewboxSubject.value;
    const { top, left, tX: tXold, tY: tYold, scale: oldScale } = viewbox;

    const mx = e.x - left;
    const my = e.y - top;

    let newScale = oldScale - Math.sign(e.deltaY) * this.zoomStep;
    newScale = newScale < 0.1 ? 0.1 : newScale > 1.5 ? 1.5 : newScale;

    // tXnew
    const cXold = wRef / 2 + tXold;
    const dMxToCold = cXold - mx;
    const dMxToCnew = dMxToCold * (newScale / oldScale);
    const cXnew = dMxToCnew + mx;
    const tXnew = cXnew - wRef / 2;

    // tYnew
    const cYold = hRef / 2 + tYold;
    const dMyToCold = cYold - my;
    const dMyToCnew = dMyToCold * (newScale / oldScale);
    const cYnew = dMyToCnew + my;
    const tYnew = cYnew - hRef / 2;

    this.viewboxSubject.next({
      ...viewbox,
      tX: tXnew,
      tY: tYnew,
      scale: newScale,
    });
    this.diagram.syncViewBox(this.viewboxSubject.value);
    this.focusViewbox(
      this.viewboxSubject.value.tX,
      this.viewboxSubject.value.tY,
      this.viewboxSubject.value.scale
    );
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (this.isPanning) {
      this.endPoint = { x: e.x, y: e.y };
      const dx = this.endPoint.x - this.startPoint.x;
      const dy = this.endPoint.y - this.startPoint.y;

      const viewbox = this.viewboxSubject.value;
      this.focusViewbox(viewbox.tX + dx, viewbox.tY + dy, viewbox.scale);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e: MouseEvent): void {
    if (this.isPanning) {
      const viewbox = this.viewboxSubject.value;

      this.endPoint = { x: e.x, y: e.y };
      const dx = this.endPoint.x - this.startPoint.x;
      const dy = this.endPoint.y - this.startPoint.y;
      this.viewboxSubject.next({
        ...viewbox,
        tX: viewbox.tX + dx,
        tY: viewbox.tY + dy,
      });
      this.diagram.syncViewBox(this.viewboxSubject.value);
      this.focusViewbox(
        this.viewboxSubject.value.tX,
        this.viewboxSubject.value.tY,
        this.viewboxSubject.value.scale
      );
      this.isPanning = false;
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.diagram.getGrabbedState()) {
      this.isPanning = true;
      this.startPoint = { x: event.x, y: event.y };
    }
  }

  private focusViewbox(dx: number, dy: number, scale: number): void {
    this.renderer.setStyle(
      this.canvasElement,
      'transform',
      `translate3d(${dx}px,${dy}px,0px) scale(${scale})`
    );
  }
}
