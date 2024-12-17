import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppWriteService } from '../services/app-write.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UnAuthGuard implements CanActivate {
  private router = inject(Router);
  private appWriteService = inject(AppWriteService);
  private platformId = inject(PLATFORM_ID);

  async canActivate(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const user = await this.appWriteService.getCurrentUser();
      if (user) {
        this.router.navigateByUrl('/dashboard');
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
}
