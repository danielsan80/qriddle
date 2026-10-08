export const analytics = {
  stepChanged(step: string): void {
    window.umami?.track('step-changed', { step });
  },
  downloadRequested(): void {
    window.umami?.track('download-requested');
  },
};
