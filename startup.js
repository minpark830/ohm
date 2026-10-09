// Keep the initial HTML useful while the application and its data are loading.
// Dependencies are injectable so slow networks and failed imports are testable.
export async function startWorkspace({
  document: page = globalThis.document,
  load = () => import('./app.js?v=7673f412980e7053'),
  schedule = globalThis.setTimeout,
  cancel = globalThis.clearTimeout,
  reload = () => globalThis.location.reload(),
  slowAfterMs = 12000,
} = {}) {
  const root = page?.querySelector('#app');
  const screen = page?.querySelector('[data-startup-screen]');
  const status = page?.querySelector('#startup-status');
  const detail = page?.querySelector('#startup-detail');
  const retry = page?.querySelector('#startup-retry');
  const isLoading = () => screen && page.querySelector('[data-startup-screen]') === screen;
  const retryLoading = () => { if (isLoading()) reload(); };
  retry?.addEventListener('click', retryLoading);
  const timer = schedule(() => {
    if (!isLoading()) return;
    screen.dataset.state = 'slow';
    if (status) status.textContent = 'This is taking a little longer.';
    if (detail) detail.textContent = 'We’re still connecting. You can wait a moment or try again.';
    if (retry) retry.hidden = false;
  }, slowAfterMs);
  try {
    await load();
    retry?.removeEventListener('click', retryLoading);
    return true;
  } catch {
    if (isLoading()) {
      screen.dataset.state = 'error';
      if (status) status.textContent = 'Your workspace couldn’t load.';
      if (detail) detail.textContent = 'Check your connection and try again. Retrying won’t change your saved progress.';
      if (retry) retry.hidden = false;
    } else {
      // A late module error must not replace an already rendered application.
      retry?.removeEventListener('click', retryLoading);
    }
    return false;
  } finally {
    cancel(timer);
    root?.setAttribute('aria-busy', 'false');
  }
}

if (typeof document !== 'undefined') {
  const screen = document.querySelector('[data-startup-screen]');
  let theme = 'light';
  try {
    theme = globalThis.localStorage.getItem('ohm-theme') || JSON.parse(globalThis.localStorage.getItem('ohm-progress') || '{}')?.theme || 'light';
  } catch { /* Match the application's light fallback when storage is unavailable. */ }
  if (screen) screen.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  void startWorkspace();
}
