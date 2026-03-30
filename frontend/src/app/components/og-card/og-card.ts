import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SeoResult } from '../../models/seo.models';

@Component({
  selector: 'app-og-card',
  template: `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <h2 class="text-sm font-semibold text-slate-700">Extended Info</h2>

      <div class="divide-y divide-slate-100">
        <!-- Canonical URL -->
        <div class="py-2.5 flex items-start justify-between gap-4">
          <span class="text-xs text-slate-500 shrink-0 pt-0.5">Canonical URL</span>
          @if (result().canonicalUrl) {
            <span class="text-xs text-slate-700 text-right truncate max-w-xs">{{ result().canonicalUrl }}</span>
          } @else {
            <span class="text-xs text-red-400">Missing</span>
          }
        </div>

        <!-- OG Title -->
        <div class="py-2.5 flex items-start justify-between gap-4">
          <span class="text-xs text-slate-500 shrink-0 pt-0.5">OG Title</span>
          @if (result().ogTitle) {
            <span class="text-xs text-slate-700 text-right truncate max-w-xs">{{ result().ogTitle }}</span>
          } @else {
            <span class="text-xs text-red-400">Missing</span>
          }
        </div>

        <!-- OG Description -->
        <div class="py-2.5 flex items-start justify-between gap-4">
          <span class="text-xs text-slate-500 shrink-0 pt-0.5">OG Description</span>
          @if (result().ogDescription) {
            <span class="text-xs text-slate-700 text-right line-clamp-2 max-w-xs">{{ result().ogDescription }}</span>
          } @else {
            <span class="text-xs text-red-400">Missing</span>
          }
        </div>

        <!-- OG Image -->
        @if (result().ogImage) {
          <div class="py-2.5">
            <span class="text-xs text-slate-500 block mb-1.5">OG Image</span>
            <img
              [src]="result().ogImage"
              alt="OG preview"
              class="w-full h-28 object-cover rounded-xl border border-slate-100"
              onerror="this.style.display='none'"
            />
          </div>
        } @else {
          <div class="py-2.5 flex items-start justify-between gap-4">
            <span class="text-xs text-slate-500 shrink-0 pt-0.5">OG Image</span>
            <span class="text-xs text-red-400">Missing</span>
          </div>
        }

        <!-- Images -->
        <div class="py-2.5 flex items-center justify-between">
          <span class="text-xs text-slate-500">Images</span>
          <span class="text-xs text-slate-700 tabular-nums">
            {{ result().imageCount }} total
            @if (result().imagesWithoutAlt > 0) {
              · <span class="text-amber-500">{{ result().imagesWithoutAlt }} missing alt</span>
            } @else if (result().imageCount > 0) {
              · <span class="text-emerald-600">all have alt</span>
            }
          </span>
        </div>

        <!-- Word count -->
        <div class="py-2.5 flex items-center justify-between">
          <span class="text-xs text-slate-500">Word Count</span>
          <span
            class="text-xs font-medium tabular-nums"
            [class]="result().wordCount >= 300 ? 'text-emerald-600' : 'text-amber-500'"
          >
            {{ result().wordCount | number }}
            <span class="font-normal text-slate-400">words</span>
          </span>
        </div>
      </div>
    </div>
  `,
  imports: [DecimalPipe],
})
export class OgCard {
  result = input.required<SeoResult>();
}
