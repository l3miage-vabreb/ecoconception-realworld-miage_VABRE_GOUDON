// animation.component.ts
import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.css'],
  animations: [
    trigger('rotateImage', [
      state('rotated', style({
        transform: 'rotate(360deg)'
      })),
      state('notRotated', style({
        transform: 'rotate(0deg)'
      })),
      transition('rotated <=> notRotated', animate('500ms ease-in-out'))
    ])
  ]
})
export class AnimationComponent {
  rotateState: string = 'notRotated';

  toggleRotation() {
    this.rotateState = (this.rotateState === 'notRotated') ? 'rotated' : 'notRotated';
  }
}
