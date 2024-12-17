import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppWriteService } from '../services/app-write.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private appWriteService = inject(AppWriteService);
  private platformId = inject(PLATFORM_ID);

  async canActivate(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const user = await this.appWriteService.getCurrentUser();
      if (user) {
        return true;
      } else {
        this.router.navigateByUrl('/login');
        return false;
      }
    }
    return false;
  }
}
