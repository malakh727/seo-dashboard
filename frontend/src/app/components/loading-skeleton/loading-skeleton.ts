import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  template: `
    <div class="animate-pulse space-y-5">
      <!-- Score + Meta row -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        @for (i of [1, 2, 3]; track i) {
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
            <div class="h-8 bg-slate-200 rounded w-2/3"></div>
            <div class="h-3 bg-slate-200 rounded w-full"></div>
            <div class="h-3 bg-slate-200 rounded w-3/4"></div>
          </div>
        }
      </div>

      <!-- Checklist -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div class="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
        @for (i of [1, 2, 3, 4, 5, 6, 7]; track i) {
          <div class="flex items-center gap-3">
            <div class="h-4 w-4 bg-slate-200 rounded-full shrink-0"></div>
            <div class="h-3 bg-slate-200 rounded flex-1"></div>
            <div class="h-3 bg-slate-200 rounded w-12"></div>
          </div>
        }
      </div>

      <!-- Headings row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        @for (i of [1, 2]; track i) {
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
            @for (j of [1, 2, 3]; track j) {
              <div class="h-3 bg-slate-200 rounded w-full"></div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class LoadingSkeleton {}
