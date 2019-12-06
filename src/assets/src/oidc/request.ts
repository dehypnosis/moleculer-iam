import { OIDCProps } from "./types";

export function request(
  action: {
    url: string,
    method: string,
    data?: any,
    urlencoded?: boolean,
  },
  mergeData: any = {},
): Promise<OIDCProps> {
  const {url, method, data = {}, urlencoded = false} = action;
  const payload = {...data, ...mergeData};

  // as application/x-www-form-urlencoded
  if (urlencoded) {
    const form = document.createElement("form");
    form.action = url;
    form.method = method;
    form.style.display = "none";
    // tslint:disable-next-line:forin
    for (const k in payload) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = payload[k];
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
    body: method !== "GET" ? JSON.stringify(payload) : undefined,
    credentials: "same-origin",
  })
    .then(res => res.json())
    .catch(error => ({error}));
}
