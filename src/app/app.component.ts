import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as PIXI from 'pixi.js';
import '@pixi/graphics-extras';
import { DiagramService } from './diagram.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('canvas') canvas!: ElementRef<any>;
  app;
  lastPos: any = null;
  private startPont: any;
  constructor(private renderer: Renderer2, private diagram: DiagramService) {
    this.app = new PIXI.Application({
      width: window.innerWidth * 1,
      height: window.innerHeight * 1,
      backgroundColor: 0x63916,
      resolution: devicePixelRatio,
      autoDensity: true,
    });
this.diagram.setApp(this.app);

  }
  ngOnInit(): void {
    this.renderer.appendChild(this.canvas.nativeElement, this.app.view);

    this.canvas.nativeElement.addEventListener('mousemove', (e: any) => {
      if (this.startPont && this.diagram.getGrabbedState()) {
        this.diagram.moveNode(e.x , e.y );
      }
    });

    this.canvas.nativeElement.addEventListener('mouseup', (e: any) => {
      this.diagram.removeGrabbed();
    });
    this.canvas.nativeElement.addEventListener('mousedown', (e: any) => {
      this.startPont = { x: e.x, y: e.y };
    });

   
    ///////////////////////////////LINE////////////////
    const graphic = new PIXI.Graphics();
    graphic.lineStyle(
      4,
      0x000000,
      0.5 //opacity
    );
    graphic.moveTo(100, 100);
    // graphic.lineTo(200, 200);
    graphic.bezierCurveTo(100, 100, 100, 200, 300, 150);

    graphic.lineStyle(
      4,
      0xffffff,
      1 //opacity
    );
    graphic.moveTo(0, 210);
    graphic.lineTo(500, 210);
    this.app.stage.addChild(graphic);
    //////////////////////
  }

  isCollision(r1: any, r2: any) {
    //Define the variables we'll need to calculate
    let hit;
    let combinedHalfWidths;
    let combinedHalfHeights;
    let vx;
    let vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        //There's definitely a collision happening
        hit = true;
      } else {
        //There's no collision on the y axis
        hit = false;
      }
    } else {
      //There's no collision on the x axis
      hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
  }
  zoom(s: any, x: any, y: any) {
    s = s < 0 ? 2 : 0.5;

    let worldPos = {
      x: (x - this.app.stage.x) / this.app.stage.scale.x,
      y: (y - this.app.stage.y) / this.app.stage.scale.y,
    };
    let newScale = {
      x: this.app.stage.scale.x * s,
      y: this.app.stage.scale.y * s,
    };

    let newScreenPos = {
      x: worldPos.x * newScale.x + this.app.stage.x,
      y: worldPos.y * newScale.y + this.app.stage.y,
    };

    this.app.stage.x -= newScreenPos.x - x;
    this.app.stage.y -= newScreenPos.y - y;
    this.app.stage.scale.x = newScale.x;
    this.app.stage.scale.y = newScale.y;
  }

  onPointerUp = (rect: any, s: number) => {
    console.log('onPointerUp');
    rect.y = rect.y + s;
  };
  onPointerdown() {
    console.log('down');
  }
  onPointerover() {
    console.log('over');
  }
  onPointerout() {
    console.log('out');
  }

 

  createEllips(x: number, y: number, width: number, height: number) {
    const elips = new PIXI.Graphics();
    elips.beginFill(0xffffff);
    elips.drawEllipse(x, y, width, height);
    // elips.filters = [new PIXI.filters.repeatEdgePixels()];
    elips.endFill();
    return elips;
  }
  createStar(x: number, y: number) {
    const ex = new PIXI.Graphics();
    ex.beginFill(0x000000);
    ex?.drawStar?.(x, y, 20, 100, 11);
    return ex;
  }

  createTorus(x: number, y: number, endArc: number) {
    const ex = new PIXI.Graphics();
    ex.beginFill(0x000000);
    ex.drawTorus?.(x, y, 118, 120, 0, endArc);
    ex.endFill();
    return ex;
  }
}
