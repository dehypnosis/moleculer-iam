import { OIDCProps } from "./types";

export function sendRequest(
  action: {
    url: string,
    method: string,
    data?: any,
  },
  mergeData: any = {},
  asUrlEncoded = false,
): Promise<OIDCProps> {
  const {url, method, data = {}} = action;

  // as application/x-www-form-urlencoded
  if (asUrlEncoded) {
    const form = document.createElement("form");
    form.action = url;
    form.method = method;
    form.style.display = "none";
    // tslint:disable-next-line:forin
    for (const k in data) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = data[k];
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
    return new Promise<any>(resolve => {});
  }

  // as ajax
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: typeof data !== "undefined" && method !== "GET" ? JSON.stringify({...data, ...mergeData}) : undefined,
    credentials: "same-origin",
  })
    .then(res => res.json())
    .catch(error => ({error}));
}
