(function () {
  var key = 'sl-theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function preference() {
    return localStorage.getItem('theme') || localStorage.getItem(key) || 'auto';
  }
  function resolved(value) {
    return value === 'auto' ? (media.matches ? 'dark' : 'light') : value;
  }
  function sendThemeToPublicForm(iframe) {
    var targetOrigin = iframe.getAttribute('data-sll-public-form-origin');
    if (!targetOrigin || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      {
        type: 'sll-public-form:set-theme',
        version: 1,
        theme:
          document.documentElement.getAttribute('data-bs-theme') || 'light',
      },
      targetOrigin,
    );
  }
  function syncPublicFormThemes() {
    document
      .querySelectorAll('iframe[data-sll-public-form]')
      .forEach(sendThemeToPublicForm);
  }
  function apply(value) {
    document.documentElement.setAttribute('data-bs-theme', resolved(value));
    document.documentElement.setAttribute('data-theme-preference', value);
    syncPublicFormThemes();
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
    document
      .querySelectorAll('iframe[data-sll-public-form]')
      .forEach(function (iframe) {
        iframe.addEventListener('load', function () {
          sendThemeToPublicForm(iframe);
        });
      });
    syncPublicFormThemes();
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
  window.addEventListener('message', function (event) {
    var data = event.data || {};
    if (data.type !== 'sll-public-form:ready' || data.version !== 1) return;
    document
      .querySelectorAll('iframe[data-sll-public-form]')
      .forEach(function (iframe) {
        if (iframe.contentWindow === event.source)
          sendThemeToPublicForm(iframe);
      });
  });
})();
