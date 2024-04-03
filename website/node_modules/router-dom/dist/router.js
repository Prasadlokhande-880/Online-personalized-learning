import { pathToRegexp, match } from "path-to-regexp";
import { render, html, hydro, $, $$, setReuseElements } from "hydro-js";
let router;
const storageKey = "router-scroll";
const outletSelector = "[data-outlet]";
const reactivityRegex = /\{\{([^]*?)\}\}/;
const fetchCache = new WeakMap();
let base = $("base")?.getAttribute("href") || "";
if (base.endsWith("/")) {
    base = [...base].slice(0, -1).join("");
}
addEventListener("popstate", async (e) => {
    //@ts-expect-error
    router.doRouting(location.pathname + location.search, e);
});
// Reload -> store scrollPosition
addEventListener("beforeunload", () => sessionStorage.setItem(storageKey, `${scrollX} ${scrollY}`));
export default class Router {
    options;
    routes;
    oldRoute;
    constructor(routes, options = {}) {
        // Handle nested routes
        const length = routes.length - 1;
        for (let i = length; i >= 0; i--) {
            const route = routes[i];
            if (route.children) {
                route.children.forEach((child, idx) => {
                    routes.splice(i + idx, 0, {
                        ...child,
                        path: `${route.path}/${child.path}`,
                        isChildOf: route,
                    });
                });
                Reflect.deleteProperty(route, "children");
            }
        }
        const newRoutes = routes.map((route) => {
            return {
                ...route,
                path: pathToRegexp(base + route.path),
                originalPath: base + route.path,
            };
        });
        this.routes = newRoutes;
        this.options = options;
        router = this;
        // Prefetch resources
        this.routes.forEach((route) => {
            //@ts-expect-error
            if (route.templateUrl && !navigator.connection?.saveData) {
                const controller = new AbortController();
                const cache = { promise: null, controller };
                fetchCache.set(route, cache);
                setTimeout(() => {
                    requestIdleCallback(() => {
                        cache.promise = fetch(route.templateUrl, {
                            signal: controller.signal,
                        });
                        cache.promise
                            .then((res) => res.text())
                            .then((_html) => {
                            cache.html = _html;
                        })
                            .catch(async (err) => {
                            await this.options.errorHandler?.(err);
                        });
                    });
                });
            }
        });
        this.doRouting();
    }
    getMatchingRoute(path) {
        if (path.startsWith(".")) {
            path = path.replace(".", "");
        }
        return this.routes.find((route) => route.path.exec(path));
    }
    async doRouting(to = location.pathname + location.search, e) {
        dispatchEvent(new Event("beforeRouting"));
        const from = this.oldRoute ?? to;
        const route = this.getMatchingRoute(to);
        if (route) {
            try {
                const { params } = match(route.originalPath, {
                    decode: decodeURIComponent,
                })(to);
                const allParams = {
                    ...Router.getParams(),
                    ...Object.fromEntries(Object.entries(params)
                        .map((pair) => Number.isNaN(Number(pair[0])) && pair)
                        .filter(Boolean)),
                };
                const props = {
                    from: from.replace(base, ""),
                    to: to.replace(base, ""),
                    ...(Object.keys(allParams).length ? { params: allParams } : {}),
                    ...(history.state && Object.keys(history.state).length
                        ? { state: history.state }
                        : {}),
                };
                // Reset Scroll, just like Browser
                scrollTo({
                    top: 0,
                    left: 0,
                    behavior: this.options.scrollBehavior || "auto",
                });
                // Trigger leave
                if (this.oldRoute) {
                    const oldRoute = this.routes.find((route) => route.path.exec(this.oldRoute));
                    if (oldRoute) {
                        await oldRoute["leave" /* cycles.leave */]?.(props);
                        this.oldRoute = route.originalPath;
                    }
                }
                // Trigger beforeEnter
                await route["beforeEnter" /* cycles.beforeEnter */]?.(props);
                // Handle template / element
                if (!!route.isChildOf) {
                    setReuseElements(false);
                    const parent = route.isChildOf;
                    if (parent.templateUrl) {
                        await handleTemplate(parent, $(outletSelector));
                    }
                    else if (parent.element) {
                        const copy = $(outletSelector).cloneNode();
                        copy.append(html `${parent.element}`);
                        render(copy, outletSelector, false);
                    }
                    setReuseElements(true);
                }
                if (route?.templateUrl) {
                    await handleTemplate(route, $(outletSelector).querySelector(outletSelector) ??
                        $(outletSelector));
                }
                else if (route?.element) {
                    const where = $(outletSelector).querySelector(outletSelector) ??
                        $(outletSelector);
                    const copy = where.cloneNode();
                    copy.append(html `${route.element}`);
                    render(copy, where, false);
                }
                else {
                    // Clear outlet
                    $(outletSelector).textContent = null;
                }
                // Trigger afterEnter
                await route["afterEnter" /* cycles.afterEnter */]?.(props);
            }
            catch (err) {
                if (this.options.errorHandler) {
                    await this.options.errorHandler(err, e);
                }
                else {
                    console.error(err, e);
                }
            }
            finally {
                dispatchEvent(new Event("afterRouting"));
                // Reload -> restore scroll position
                if (!this.oldRoute &&
                    route.restoreScrollOnReload &&
                    sessionStorage.getItem(storageKey)) {
                    const [left, top] = sessionStorage
                        .getItem(storageKey)
                        .split(" ")
                        .map(Number);
                    sessionStorage.removeItem(storageKey);
                    scrollTo({
                        top,
                        left,
                        behavior: this.options.scrollBehavior || "auto",
                    });
                }
            }
        }
    }
    go(path, state, params = "") {
        this.oldRoute = location.pathname + location.search;
        const newPath = base + path + params;
        // Only navigate when the path differs
        if (newPath !== this.oldRoute) {
            history.pushState({ ...state }, "", newPath);
            this.doRouting(newPath);
        }
    }
    removeRoute(path) {
        const idx = this.routes.findIndex((route) => String(route.path) === String(pathToRegexp(path)));
        if (idx > -1) {
            this.routes.splice(idx, 1);
        }
    }
    addRoute(route) {
        this.routes.push({
            ...route,
            path: pathToRegexp(base + route.path),
            originalPath: base + route.path,
        });
    }
    modifyRoute(path, newRoute) {
        const idx = this.routes.findIndex((route) => String(route.path) === String(pathToRegexp(path)));
        if (idx > -1) {
            this.routes[idx] = {
                ...newRoute,
                path: pathToRegexp(base + newRoute.path),
                originalPath: base + path,
            };
        }
    }
    changeOptions(options) {
        this.options = options;
    }
    static getParams(search = location.search) {
        return Object.fromEntries(new URLSearchParams(search));
    }
}
function registerAnchorEvent(anchor) {
    if (anchor.getAttribute("href")?.startsWith("http"))
        return;
    anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const hasData = anchor.getAttribute("data");
        const hydroProp = replaceBars(hasData);
        const href = anchor.getAttribute("href") || "";
        router.go(href, hasData ? hydro[hydroProp] : void 0);
    });
}
function registerFormEvent(form) {
    form.addEventListener("submit", (e) => {
        if (!router.options.formHandler)
            return;
        e.preventDefault();
        const action = form.getAttribute("action");
        const method = form.getAttribute("method");
        fetch(action, {
            method,
            ...(!["HEAD", "GET"].includes(method.toUpperCase())
                ? { body: new FormData(form) }
                : {}),
        })
            .then((res) => router.options.formHandler(res, e))
            .catch(async (err) => {
            if (router.options.errorHandler) {
                await router.options.errorHandler(err, e);
            }
            else {
                console.error(err, e);
            }
        });
    });
}
function replaceBars(hydroTerm) {
    if (hydroTerm === null || !hydroTerm.includes("{{"))
        return hydroTerm;
    const [_, hydroPath] = hydroTerm.match(reactivityRegex) || [];
    return hydroPath;
}
// Add EventListener for every added anchor and form Element
$$("a").forEach(registerAnchorEvent);
$$("form").forEach(registerFormEvent);
new MutationObserver((entries) => {
    for (const entry of entries) {
        for (const node of entry.addedNodes) {
            const nodes = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT, {
                acceptNode(elem) {
                    return ["form", "a"].includes(elem.localName)
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                },
            });
            let formOrA;
            while ((formOrA = nodes.nextNode())) {
                if (formOrA.localName === "a") {
                    registerAnchorEvent(formOrA);
                }
                else {
                    registerFormEvent(formOrA);
                }
            }
        }
    }
}).observe(document.body, { childList: true, subtree: true });
async function handleTemplate(route, where) {
    let cacheObj = fetchCache.get(route);
    if (!fetchCache.has(route) || cacheObj?.promise === null) {
        cacheObj.controller?.abort();
        const data = await fetch(route.templateUrl);
        if (!cacheObj) {
            cacheObj = {
                html: await data.text(),
            };
            fetchCache.set(route, cacheObj);
        }
        else {
            cacheObj.html = await data.text();
        }
    }
    Reflect.deleteProperty(cacheObj, "controller");
    const copy = where.cloneNode();
    copy.append(window.isHMR
        ? html `${await (await fetch(route.templateUrl)).text()}`
        : html `${(await cacheObj.html) || ""}`);
    render(copy, where, false);
}
