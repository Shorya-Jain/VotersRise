import { reticle, install, registerCapabilities } from '@reticlehq/react';

/** Dev-only: connect Reticle. Imported from a processed page script so Vite owns the SDK graph. */
export default function connectReticle() {
  const token =
    document.querySelector('meta[name="reticle-pairing-token"]')?.getAttribute('content') ?? '';
  const root =
    document.querySelector('meta[name="reticle-pairing-root"]')?.getAttribute('content') ?? '';
  const url =
    document.querySelector('meta[name="reticle-pairing-url"]')?.getAttribute('content') ?? '';
  if (0 === token.length) {
    console.warn("[reticle] no pairing token was available when this page rendered, so the app will connect and be refused — you will see NO SESSION even though the SDK loads and the socket opens. The token is written by the Reticle daemon: start it (`reticle serve`, or let your agent start it) and reload this page.");
  }
  install();
  reticle.connect({
    projectId: 'votersrise-593e43e6',
    ...(0 < token.length ? { token } : {}),
    ...(0 < root.length ? { root } : {}),
    ...(0 < url.length ? { url } : {}),
  });
  registerCapabilities({
    testids: [], // none found; add data-testid to your key elements
    signals: [], // names you pass to reticle.signal()
    stores: [], // register a store above, then name its key here
  });
}
