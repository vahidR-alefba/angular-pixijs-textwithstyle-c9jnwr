import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AfterViewInit } from '@angular/core/src/metadata';
import * as PIXI from 'pixi.js';
@Component({
  selector: 'app-rect',
  templateUrl: './rect.component.html',
  styleUrls: ['./rect.component.css'],
})
export class RectComponent implements AfterViewInit {
  @ViewChild('svgRect') canvas!: ElementRef<any>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const app = new PIXI.Application({
      width: 200,
      height: 200,
      backgroundColor: 0xBBBffa,
      resolution: devicePixelRatio,
      autoDensity: true,
    });
    const rect = new PIXI.Graphics();
    rect.beginFill(0xffffff);
    rect.lineStyle(4, 0x0fffff);
    rect.drawRect(10, 10, 100, 100);
    rect.endFill();

    rect.interactive = true;
    rect.buttonMode = true;
    app.stage.addChild(rect);

    this.renderer.appendChild(this.canvas.nativeElement, app.view);
  }
}
