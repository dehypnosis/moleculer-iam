import ReactDOM from "react-dom";
import { useTheme } from "@ui-kitten/components";
import { ApplicationThemePalette } from "../../../theme";

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
  return (ref: React.Component) => {
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
export function activeAutoFocus(ref: React.Component) {
  withElements(elems => {
    const found = elems.find(elem => {
      return elem.getAttribute("autofocus") !== "false"
        || (elem as any).offsetParent !== null; // check visible
    });
    if (found && (found as any).focus) {
      setTimeout(() => {
        if (found) {
          // console.debug("autofocus DOM element focused", found);
          (found as any).focus();
        } else {
          console.warn("autofocus DOM element missing");
        }
      }, 50);
    }
  }, "[autofocus]")(ref);
}

/* for typing */
export function useThemePalette(): ApplicationThemePalette {
  return useTheme() as any;
}