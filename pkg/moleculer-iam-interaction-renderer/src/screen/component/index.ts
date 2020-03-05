import ReactDOM from "react-dom";
import { useTheme } from "@ui-kitten/components";
import { ApplicationThemePalette } from "../../../theme";
export * from "@ui-kitten/components";

/* for DOM manipulation */
export function withElement(update: (elem: Element) => void, selector?: string) {
  return (ref: React.Component) => {
    const node = ReactDOM.findDOMNode(ref);
    if (typeof node === "object" && node !== null) {
      const elem = node as Element;
      if (selector) {
        const childElem = elem.parentElement && elem.parentElement.querySelector(selector);
        if (childElem) {
          update(childElem);
        } else {
          console.warn(`cannot find closest ${selector} from parent elem of`, elem);
        }
      } else {
        update(elem);
      }
    }
  };
}

export function withAttrs(attrs: {[key: string]: string|number|boolean|null} = {}, selector?: string) {
  return withElement(elem => {
    for (const [k,v] of Object.entries(attrs)) {
      if (k === "class" && typeof v === "string") {
        elem.classList.add(v);
      } else if (typeof v === "string") {
        elem.setAttribute(k, v);
      } else if (typeof v === "number") {
        elem.setAttribute(k, v.toString());
      } else if (typeof v === "boolean") {
        elem.setAttribute(k, v ? "true" : "false");
      } else {
        elem.removeAttribute(k);
      }
    }
  }, selector);
}

export function useThemePalette(): ApplicationThemePalette {
  return useTheme() as any;
}

export { Separator } from "./separator";
