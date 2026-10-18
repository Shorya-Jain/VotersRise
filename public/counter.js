// Form-click counter. Records clicks on official-form buttons (data-track) and
// fills the home page ticker (#form-ticker). Sends no personal data.
(function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[data-track]');
    if (link && navigator.sendBeacon) navigator.sendBeacon('/api/clicks', link.dataset.track);
  });

  var ticker = document.getElementById('form-ticker');
  if (!ticker) return;
  fetch('/api/clicks')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !(data.total > 0)) return;
      ticker.querySelector('[data-count]').textContent = new Intl.NumberFormat('en-IN').format(data.total);
      ticker.classList.remove('pending');
    })
    .catch(function () {});
})();
