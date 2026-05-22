function fadeOut(el) {
  el.style.opacity = 1;
  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity - (new Date() - last) / 80;
    last = +new Date();
    if (el.style.opacity > 0) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    } else {
      el.style.display='none';
    }
  };
  tick();
}

function setupImageCaptions() {
  var elements = document.querySelectorAll("img");
  Array.prototype.forEach.call(elements, function(el, i) {
    if (el.getAttribute("alt")) {
      const caption = document.createElement('figcaption');
      var node = document.createTextNode(el.getAttribute("alt"));
      caption.appendChild(node);
      const wrapper = document.createElement('figure');
      wrapper.className = 'image';
      el.parentNode.insertBefore(wrapper, el);
      el.parentNode.removeChild(el);
      wrapper.appendChild(el);
      wrapper.appendChild(caption);
    }
  });
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    var el = document.getElementById('loadingMask');
    if (el) fadeOut(el);
    setupImageCaptions();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
window.onload = ready;
