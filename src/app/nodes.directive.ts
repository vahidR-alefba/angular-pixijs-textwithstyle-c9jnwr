import { DiagramService } from './diagram.service';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Subscription } from 'rxjs';

import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
export class Point {
  public originX: number;
  public originY: number;
  constructor(public id: number, public x: number, public y: number) {
    this.originX = x;
    this.originY = y;
  }
}

export interface ViewBox {
  top: number;
  left: number;
  tX: number;
  tY: number;
  scale: number;
}
@Directive({
  selector: '[Node]',
})
export class NodesDirective implements OnInit, OnDestroy {
  @Input('Node')
  public set node(value: Point) {
    if (value !== this._node) {
      this._node = value;
      this._node.originX = this._node.x;
      this._node.originY = this._node.y;
      this.setPosition(value.x, value.y);
    }
  }
  public get node(): Point {
    return this._node;
  }
  private _node!: Point;
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private diagram: DiagramService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
    this.diagram.selectGrabbedNode().subscribe((nodes: Point[]) => {
      const n: Point = nodes.filter((f) => f.id === this._node.id)[0];
      if (n?.x && n?.y) {
        this.setPosition(n.x, n.y);
      }
    });
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e: MouseEvent): void {
    this.renderer.removeStyle(this.el.nativeElement, 'z-index');
  }

  @HostListener('mousedown', ['$event']) onKeyDown(event: MouseEvent): void {
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '1000');
    this.diagram.grabNode(this.node);
  }

  private setPosition(x: number, y: number, scale = 0): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `translate3d(${x}px,${y}px,${scale}px)`
    );
  }
}
