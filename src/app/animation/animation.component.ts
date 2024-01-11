import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.css'],
  animations: [
    trigger('rotate', [
      style({ transform: 'rotate(0deg)' }),
      animate('2000ms', style({ transform: 'rotate(360deg)' }))
    ])
  ]
})

export class AnimationComponent {


}
