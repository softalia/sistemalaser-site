(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var menu = document.getElementById('siteMenu');
    var toggle = document.querySelector('.menu-toggle');
    if (!menu || !toggle) return;
    document.documentElement.classList.add('menu-ready');
    function closeMenu() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
      dropdown.addEventListener('toggle', function () {
        if (!dropdown.open) return;
        document.querySelectorAll('.nav-dropdown').forEach(function (other) {
          if (other !== dropdown) other.open = false;
        });
      });
    });
    document.addEventListener('click', function (event) {
      document.querySelectorAll('.nav-dropdown[open]').forEach(function (item) {
        if (!item.contains(event.target)) item.open = false;
      });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      var open = document.querySelector('.nav-dropdown[open]');
      if (open) {
        open.open = false;
        open.querySelector('summary').focus();
      } else if (menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  });
})();
