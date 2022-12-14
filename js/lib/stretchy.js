/*
 * Stretchy: Form element autosizing, the way it should be.
 * by Lea Verou http://lea.verou.me
 * MIT license
 */
function $$(expr) {
  var con = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return expr instanceof Node || expr instanceof Window ? [expr] : Array.from(typeof expr == "string" ? con.querySelectorAll(expr) : expr || []);
}

var selectors = {
  base: 'textarea, select:not([size]), input:not([type]), input[type="' + "text number url email tel".split(" ").join('"], input[type="') + '"]',
  filter: "*"
}; // Autosize one element. The core of Stretchy.

function resize(element) {
  if (!resizes(element)) {
    return;
  }

  var cs = getComputedStyle(element);
  var offset = 0;
  var empty;

  if (!element.value && element.placeholder) {
    empty = true;
    element.value = element.placeholder;
  }

  var type = element.nodeName.toLowerCase();

  if (type == "textarea") {
    element.style.height = "0";

    if (cs.boxSizing == "border-box") {
      offset = element.offsetHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    } else if (cs.boxSizing == "content-box") {
      offset = -element.clientHeight + parseFloat(cs.minHeight);
    }

    element.style.height = element.scrollHeight + offset + "px";
  } else if (type == "input") {
    // First test that it is actually visible, otherwise all measurements are off
    element.style.width = "1000px";

    if (element.offsetWidth) {
      element.style.width = "0";

      if (cs.boxSizing == "border-box") {
        offset = element.offsetWidth;
      } else if (cs.boxSizing == "padding-box") {
        offset = element.clientWidth;
      } else if (cs.boxSizing == "content-box") {
        offset = parseFloat(cs.minWidth);
      }

      var width = Math.max(offset, element.scrollWidth - element.clientWidth);
      element.style.width = width + "px"; // To bulletproof, we will set scrollLeft to a
      // huge number, and read that back to see what it was clipped to
      // and increment width by that much, iteratively

      for (var i = 0; i < 10; i++) {
        // max iterations
        element.scrollLeft = 1e+10;

        if (element.scrollLeft == 0) {
          break;
        }

        width += element.scrollLeft;
        element.style.width = width + "px";
      }
    } else {
      // Element is invisible, just set to something reasonable
      element.style.width = element.value.length + 1 + "ch";
    }
  } else if (type == "select") {
    // if select element is empty, do nothing
    if (element.selectedIndex == -1) {
      return;
    }

    var selectedIndex = element.selectedIndex > 0 ? element.selectedIndex : 0; // Need to use dummy element to measure :(

    var option = document.createElement("_");
    option.textContent = element.options[selectedIndex].textContent;
    element.parentNode.insertBefore(option, element.nextSibling); // The name of the appearance property, as it might be prefixed

    var appearance;

    for (var property in cs) {
      var value = cs[property];

      if (!/^(width|webkitLogicalWidth|length)$/.test(property) && typeof value == "string" && property in option.style) {
        option.style[property] = value;

        if (/appearance$/i.test(property)) {
          appearance = property;
        }
      }
    }

    option.style.width = "";

    if (option.offsetWidth > 0) {
      element.style.width = option.offsetWidth + "px";

      if (!cs[appearance] || cs[appearance] !== "none") {
        // Account for arrow
        element.style.width = "calc(" + element.style.width + " + var(--arrow-width, 2.1em))";
      }
    }

    option.parentNode.removeChild(option);
    option = null;
  }

  if (empty) {
    element.value = "";
  }
}

var active = true; // Autosize multiple elements

function resizeAll(elements) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.documentElement;
  $$(elements || selectors.base, root).forEach(function (element) {
    var _element$matches;

    if ((_element$matches = element.matches) !== null && _element$matches !== void 0 && _element$matches.call(element, selectors.filter)) {
      resize(element);
    }
  });
} // Will stretchy do anything for this element?


function resizes(element) {
  return element && element.parentNode && element.matches && element.matches(selectors.base) && element.matches(selectors.filter);
}

function onchange(evt) {
  if (evt.target.matches(selectors.base) && evt.target.matches(selectors.filter)) {
    resize(evt.target);
  }
}

var observer;

function init() {
  var _document$currentScri;

  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.documentElement;
  selectors.filter = ((_document$currentScri = document.currentScript) === null || _document$currentScri === void 0 ? void 0 : _document$currentScri.getAttribute("data-filter")) || ($$("[data-stretchy-filter]").pop() || document.body).getAttribute("data-stretchy-filter") || selectors.filter; // Listen for changes

  root.addEventListener("input", onchange); // Firefox fires a change event instead of an input event

  root.addEventListener("change", onchange); // Resize all

  resizeAll(undefined, root); // Listen for new elements

  if (!observer) {
    observer = new MutationObserver(function (mutations) {
      {
        mutations.forEach(function (mutation) {
          if (mutation.type == "childList") {
            resizeAll(mutation.addedNodes);
          }
        });
      }
    });
  }

  observer.observe(root, {
    childList: true,
    subtree: true
  });
}

var ready = new Promise(resolve => {
  if (document.readyState == "complete") {
    resolve();
  } else {
    document.addEventListener("DOMContentLoaded", resolve);
  }

  document.addEventListener("load", resolve); // failsafe
});

if (document.currentScript) {
  // If loaded from a module, don't do anything
  // Autosize whatever is currently available
  init(); // Autosize all elements once the DOM is loaded
  // DOM already loaded?

  ready.then(_ => init()); // Autosize again on load

  window.addEventListener("load", () => init());
}

export { $$, active, init, ready, resize, resizeAll, resizes, selectors };
