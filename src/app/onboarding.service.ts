import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private ONBOARDING_KEY = 'user_onboarding_progress'; // Chave no localStorage

  constructor() {}

  getOnboardingProgress(): { step1: boolean; step2: boolean; step3: boolean } {
    const progress = localStorage.getItem(this.ONBOARDING_KEY);
    console.log(progress ? JSON.parse(progress) : { step1: false, step2: false, step3: false });
    return progress ? JSON.parse(progress) : { step1: false, step2: false, step3: false };
  }

  completeStep(step: 'step1' | 'step2' | 'step3'): void {
    const progress = this.getOnboardingProgress();
    progress[step] = true;
    localStorage.setItem(this.ONBOARDING_KEY, JSON.stringify(progress));
  }

  // Verificar se um passo já foi concluído
  hasCompletedStep(step: 'step1' | 'step2' | 'step3'): boolean {
    return this.getOnboardingProgress()[step];
  }
}
