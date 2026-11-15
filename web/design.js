"use strict";
(() => {
  const workspace = document.getElementById("profileWorkspace");
  const refresh = () => document.body.classList.toggle("profile-open", !workspace.hidden);
  new MutationObserver(refresh).observe(workspace, {attributes: true, attributeFilter: ["hidden"]});
  refresh();
  function revealTarget() {
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    const disclosure = target?.closest(".resource-panel");
    if (disclosure) disclosure.open = true;
  }
  window.addEventListener("hashchange", revealTarget);
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
      const target = document.getElementById(link.hash.slice(1));
      const disclosure = target?.closest(".resource-panel");
      if (disclosure) disclosure.open = true;
    });
  });
  revealTarget();
})();