import ReactDOM from "react-dom";
import { useTheme } from "@ui-kitten/components";
import { ApplicationThemePalette } from "../../common";

/* for DOM manipulation */
export function withElements(callback: (elems: Element[]) => void, selector: string) {
  return (ref: React.Component) => {
    const node = ReactDOM.findDOMNode(ref);
    if (!node) return;

    if (typeof node === "object") {
      callback(Array.prototype.slice.call((node as Element).querySelectorAll(selector)));
      return;
    }
  };
}

export function withElement(callback: (elem: Element) => void, selector?: string, ignoreNotFound = false) {
  return (ref: React.Component | null) => {
    if (!ref) return;
    const node = ReactDOM.findDOMNode(ref);
    if (!node) return;

    let found: Element|null = null;
    if (typeof node === "object") {
      found = node as Element;
      if (selector) {
        found = found.querySelector(selector);
      }
    }
    if (!found) {
      if (!ignoreNotFound) {
        console.warn("cannot find element with", selector, ref);
      }
      return;
    }
    callback(found!);
  };
}

export function withAttrs(attrs: {[key: string]: string|number|boolean|null} = {}, selector?: string, ignoreNotFound = false) {
  return withElement(elem => {
    for (const [k,v] of Object.entries(attrs)) {
      if (typeof v === "string") {
        elem.setAttribute(k, v);
      } else if (typeof v === "number") {
        elem.setAttribute(k, v.toString());
      } else if (typeof v === "boolean") {
        elem.setAttribute(k, v ? "true" : "false");
      } else {
        elem.removeAttribute(k);
      }
    }
  }, selector, ignoreNotFound);
}

// workaround to make autofocus works
export function activateAutoFocus(ref: React.Component) {
  withElements(elems => {
    elems.find(elem => {
      if (!(elem as any).focus) {
        return false;
      }

      if ((elem as any).offsetParent === null) { // check visibility
        console.debug("autofocus DOM element focus failed", elem);
        return false;
      }

      (elem as any).focus();
      // console.debug("autofocus DOM element focused", elem);
      return true;
    });
  }, "[autofocus]")(ref);
}

export const isTouchDevice = (() => {
  if (("ontouchstart" in window) || ((window as any).DocumentTouch && document instanceof (window as any).DocumentTouch)) {
    return true;
  }
  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
  return window.matchMedia && window.matchMedia(query).matches;
})();

/* for typing */
export function useThemePalette(): ApplicationThemePalette {
  return useTheme() as any;
}
