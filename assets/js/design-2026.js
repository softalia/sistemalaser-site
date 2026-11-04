(function () {
  // Deep links remain useful even when the target is inside a closed disclosure.
  function revealTarget() {
    var id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch (_) {
      return;
    }
    var target = id && document.getElementById(id);
    if (!target) return;
    var ancestor = target;
    while (ancestor) {
      if (ancestor.tagName === 'DETAILS') ancestor.open = true;
      ancestor = ancestor.parentElement;
    }
    var detail =
      target.classList.contains('product-detail') &&
      target.querySelector('details');
    if (detail) detail.open = true;
    window.requestAnimationFrame(function () {
      target.scrollIntoView({ block: 'start' });
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    revealTarget();
    window.addEventListener('hashchange', revealTarget);
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (link.hash === window.location.hash) revealTarget();
      });
    });
  });
})();
