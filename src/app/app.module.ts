import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { NodesDirective } from './nodes.directive';
import { NodeZoomableDirective } from './node.zoomable.directive';
import { RectComponent } from './rect/rect.component';
import { SpriteComponent } from './sprite/sprite.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    SpriteComponent,
    HelloComponent,
    RectComponent,
    NodesDirective,
    NodeZoomableDirective,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
