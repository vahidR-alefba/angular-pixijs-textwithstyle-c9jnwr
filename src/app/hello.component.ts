import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>Hello </h1>`,
  styles: [
    `:host 
  { font-family: Lato;color:red; border:1px solid red }`,
  ],
})
export class HelloComponent {
 
}
