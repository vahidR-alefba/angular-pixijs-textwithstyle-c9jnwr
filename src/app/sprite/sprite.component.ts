import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-sprite',
  templateUrl: './sprite.component.html',
  styleUrls: ['./sprite.component.css']
})
export class SpriteComponent implements AfterViewInit {
  @ViewChild('svg') canvas!: ElementRef<any>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const app = new PIXI.Application({
      width: 200,
      height: 200,
      backgroundColor: 0xBBBffa,
      resolution: devicePixelRatio,
      autoDensity: true,
    });
    const loader = PIXI.Loader.shared;
    loader.add('image1', '../assets/pics/vahid.JPEG');
    loader.add('image2', '../assets/pics/a.png');

    loader.load((loaderRef, resource) => {
      const sprite = new PIXI.Sprite(resource.image1.texture);

      sprite.width = 100;
      sprite.height = 100;
      // sprite.scale.set(0.2, 0.2);
      sprite.position.set(50, 50);
      // sprite.anchor.x = 0.5;
      // sprite.anchor.y = 0.5;
      sprite.anchor.set(0.5, 0.5);
      sprite.interactive = true;
      sprite.on('mousedown', () => {
        sprite.scale.x += 0.2;
        sprite.scale.y += 0.2;
      });
      app.ticker.add(() => {
        sprite.rotation += 0.01;
      });

     
      const texure: any = resource.image2.texture;
      const rect = new PIXI.Rectangle(80, 400, 500, 100);
      texure.frame = rect;
      const sprite1 = new PIXI.Sprite(texure);
      // sprite1.position.set(100, 100);
      sprite1.width = 600;
      sprite1.height = 600;
      app.stage.addChild(sprite1);
      app.stage.addChild(sprite);
    });

    this.renderer.appendChild(this.canvas.nativeElement, app.view);
  }
}