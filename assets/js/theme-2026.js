(function () {
  var key = 'sl-theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function preference() {
    return localStorage.getItem('theme') || localStorage.getItem(key) || 'auto';
  }
  function resolved(value) {
    return value === 'auto' ? (media.matches ? 'dark' : 'light') : value;
  }
  function apply(value) {
    document.documentElement.setAttribute('data-bs-theme', resolved(value));
    document.documentElement.setAttribute('data-theme-preference', value);
  }
  function update() {
    var value = preference();
    document.querySelectorAll('[data-theme-set]').forEach(function (button) {
      var active = button.getAttribute('data-theme-set') === value;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
  apply(preference());
  media.addEventListener('change', function () {
    if (preference() === 'auto') apply('auto');
  });
  document.addEventListener('DOMContentLoaded', function () {
    update();
    document.querySelectorAll('[data-theme-set]').forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-theme-set');
        localStorage.setItem(key, value);
        localStorage.setItem('theme', value);
        apply(value);
        update();
      });
    });
  });
})();
