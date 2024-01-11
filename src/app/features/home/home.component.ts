import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TagsService } from "../../core/services/tags.service";
import { ArticleListConfig } from "../../core/models/article-list-config.model";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { ArticleListComponent } from "../../shared/article-helpers/article-list.component";
import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { UserService } from "../../core/services/user.service";
import { LetDirective } from "@rx-angular/template/let";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { Renderer2, ElementRef } from "@angular/core";

@Component({
  selector: "app-home-page",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  imports: [
    NgClass,
    ArticleListComponent,
    AsyncPipe,
    LetDirective,
    NgForOf,
    ShowAuthedDirective,
  ],
  standalone: true,
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  listConfig: ArticleListConfig = {
    type: "all",
    filters: {},
  };
  tags$ = inject(TagsService)
    .getAll()
    .pipe(tap(() => (this.tagsLoaded = true)));
  tagsLoaded = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.addAudioElement();

    this.userService.isAuthenticated
      .pipe(
        tap((isAuthenticated) => {
          if (isAuthenticated) {
            this.setListTo("feed");
          } else {
            this.setListTo("all");
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
      );
  }

  private addAudioElement(): void {
    const audioElement = this.renderer.createElement("audio");
    this.renderer.setAttribute(audioElement, "loop", "true");
    this.renderer.setAttribute(audioElement, "autoplay", "true");

    const sourceElement = this.renderer.createElement("source");
    this.renderer.setAttribute(sourceElement, "src", "assets/CDM.mp3");
    this.renderer.setAttribute(sourceElement, "type", "audio/mp3");

    this.renderer.appendChild(audioElement, sourceElement);

    this.renderer.appendChild(this.el.nativeElement, audioElement);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setListTo(type: string = "", filters: Object = {}): void {
    // If feed is requested but user is not authenticated, redirect to login
    if (type === "feed" && !this.isAuthenticated) {
      void this.router.navigate(["/login"]);
      return;
    }

    // Otherwise, set the list object
    this.listConfig = { type: type, filters: filters };
  }
}
