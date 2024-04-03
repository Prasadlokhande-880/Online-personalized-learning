// Safari Polyfills
window.requestIdleCallback =
    /* c8 ignore next 4 */
    window.requestIdleCallback ||
        ((cb, _, start = performance.now()) => setTimeout(cb, 0, {
            didTimeout: false,
            timeRemaining: () => Math.max(0, 5 - (performance.now() - start)),
        }));
// Safari Polyfills END
const range = document.createRange();
range.selectNodeContents(range.createContextualFragment(`<${"template" /* Placeholder.template */}>`).lastChild);
const parser = range.createContextualFragment.bind(range);
const allNodeChanges = new WeakMap(); // Maps a Node against an array of changes. An array is necessary because a node can have multiple variables for one text / attribute.
const elemEventFunctions = new WeakMap(); // Stores event functions in order to compare Elements against each other.
const reactivityMap = new WeakMap(); // Maps Proxy Objects to another Map(proxy-key, node).
const bindMap = new WeakMap(); // Bind an Element to data. If the data is being unset, the DOM Element disappears too.
const tmpSwap = new WeakMap(); // Take over keyToNodeMap if the new value is a hydro Proxy. Save old reactivityMap entry here, in case for a swap operation.
const onRenderMap = new WeakMap(); // Lifecycle Hook that is being called after rendering
const onCleanupMap = new WeakMap(); // Lifecycle Hook that is being called when unmount function is being called
const fragmentToElements = new WeakMap(); // Used to retreive Elements from DocumentFragment after it has been rendered – for diffing
const _boundFunctions = Symbol("boundFunctions"); // Cache for bound functions in Proxy, so that we create the bound version of each function only once
const reactiveSymbol = Symbol("reactive");
const keysSymbol = Symbol("keys");
let globalSchedule = true; // Decides whether to schedule rendering and updating (async)
let reuseElements = true; // Reuses Elements when rendering
let insertBeforeDiffing = false; // Makes sense in Chrome only
let shouldSetReactivity = true;
let viewElements = false;
const reactivityRegex = /\{\{([^]*?)\}\}/;
const HTML_FIND_INVALID = /<(\/?)(html|head|body)(>|\s.*?>)/g;
const newLineRegex = /\n/g;
const propChainRegex = /[\.\[\]]/;
const onEventRegex = /^on/;
// https://html.spec.whatwg.org/#attributes-3
// if value for bool attr is falsy, then remove attr
// INFO: draggable and spellcheck are actually using booleans as string! Also, hidden is not really a bool attr, but is making use of the empty string too. Might consider to add 'translate' (yes and no as string)
const boolAttrList = [
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "draggable",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
    "spellcheck",
];
let lastSwapElem = null;
let internReset = false;
function isObject(obj) {
    return obj != null && typeof obj === "object";
}
function isFunction(func) {
    return typeof func === "function" /* Placeholder.function */;
}
function isTextNode(node) {
    return node.splitText !== undefined;
}
function isNode(node) {
    return node instanceof Node;
}
function isDocumentFragment(node) {
    return node.nodeType === 11;
}
function isEventObject(obj) {
    return (isObject(obj) && "event" /* Placeholder.event */ in obj && "options" /* Placeholder.options */ in obj);
}
function isProxy(hydroObject) {
    return Reflect.get(hydroObject, "isProxy" /* Placeholder.isProxy */);
}
function isPromise(obj) {
    return isObject(obj) && typeof obj.then === "function";
}
function randomText() {
    const randomChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (var i = 0; i < 6; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
    // return Math.random().toString(32).slice(2);
}
function setGlobalSchedule(willSchedule) {
    globalSchedule = willSchedule;
    setHydroRecursive(hydro);
}
function setReuseElements(willReuse) {
    reuseElements = willReuse;
}
function setInsertDiffing(willInsert) {
    insertBeforeDiffing = willInsert;
}
function setShouldSetReactivity(willSet) {
    shouldSetReactivity = willSet;
}
function setHydroRecursive(obj) {
    Reflect.set(obj, "asyncUpdate" /* Placeholder.asyncUpdate */, globalSchedule);
    for (const value of Object.values(obj)) {
        if (isObject(value) && isProxy(value)) {
            setHydroRecursive(value);
        }
    }
}
function setAttribute(node, key, val) {
    if (boolAttrList.includes(key) && !val) {
        node.removeAttribute(key);
        return false;
    }
    node.setAttribute(key, val);
    return true;
}
function addEventListener(node, eventName, obj) {
    node.addEventListener(eventName, isFunction(obj) ? obj : obj.event, isFunction(obj) ? {} : obj.options);
}
function html(htmlArray, ...variables) {
    const eventFunctions = {}; // Temporarily store a mapping for string -> function, because eventListener have to be registered after the Element's creation
    let insertNodes = []; // Nodes, that will be added after the parsing
    const resolvedVariables = [];
    for (const variable of variables) {
        const template = `<${"template" /* Placeholder.template */} id="lbInsertNodes"></${"template" /* Placeholder.template */}>`;
        if (isNode(variable)) {
            insertNodes.push(variable);
            resolvedVariables.push(template);
        }
        else if (["number", "string" /* Placeholder.string */, "symbol", "boolean", "bigint"].includes(typeof variable) ||
            Reflect.has(variable, reactiveSymbol)) {
            resolvedVariables.push(String(variable));
        }
        else if (isFunction(variable) || isEventObject(variable)) {
            const funcName = randomText();
            Reflect.set(eventFunctions, funcName, variable);
            resolvedVariables.push(funcName);
        }
        else if (Array.isArray(variable)) {
            for (let index = 0; index < variable.length; index++) {
                const item = variable[index];
                if (isNode(item)) {
                    insertNodes.push(item);
                    variable[index] = template;
                }
            }
            resolvedVariables.push(variable.join(""));
        }
        else if (isObject(variable)) {
            let result = "";
            for (const [key, value] of Object.entries(variable)) {
                if (isFunction(value) || isEventObject(value)) {
                    const funcName = randomText();
                    Reflect.set(eventFunctions, funcName, value);
                    result += `${key}="${funcName}"`;
                }
                else {
                    result += `${key}="${value}"`;
                }
            }
            resolvedVariables.push(result);
        }
    }
    // Find elements <html|head|body>, as they cannot be created by the parser. Replace them by fake Custom Elements and replace them afterwards.
    let DOMString = String.raw(htmlArray, ...resolvedVariables).trim();
    DOMString = DOMString.replace(HTML_FIND_INVALID, `<$1$2${"-dummy" /* Placeholder.dummy */}$3`);
    const DOM = parser(DOMString);
    // Delay Element iteration and manipulation after the elements have been added to the DOM.
    if (!viewElements) {
        fillDOM(DOM, insertNodes, eventFunctions);
    }
    // Return DocumentFragment
    if (DOM.childNodes.length > 1)
        return DOM;
    // Return empty Text Node
    if (!DOM.firstChild)
        return document.createTextNode("");
    // Return Element | Text
    return DOM.firstChild;
}
function fillDOM(elem, insertNodes, eventFunctions) {
    const root = document.createNodeIterator(elem, NodeFilter.SHOW_ELEMENT, {
        acceptNode(element) {
            return element.localName.endsWith("-dummy" /* Placeholder.dummy */)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
        },
    });
    let nextNode;
    while ((nextNode = root.nextNode())) {
        const tag = nextNode.localName.replace("-dummy" /* Placeholder.dummy */, "");
        const replacement = document.createElement(tag);
        replacement.append(...nextNode.childNodes);
        /* c8 ignore next 3 */
        for (const key of nextNode.getAttributeNames()) {
            replacement.setAttribute(key, nextNode.getAttribute(key));
        }
        nextNode.replaceWith(replacement);
    }
    // Insert HTML Elements, which were stored in insertNodes
    if (!isTextNode(elem)) {
        for (const template of elem.querySelectorAll("template[id^=lbInsertNodes]"))
            template.replaceWith(insertNodes.shift());
    }
    if (shouldSetReactivity)
        setReactivity(elem, eventFunctions);
}
function h(name, props, ...children) {
    if (isFunction(name))
        return name({ ...props, children });
    const elem = typeof name === "string" /* Placeholder.string */
        ? document.createElement(name, props?.hasOwnProperty("is") ? { is: props["is"] } : undefined)
        : document.createDocumentFragment();
    for (let i in props) {
        i in elem && !boolAttrList.includes(i)
            ? //@ts-ignore
                (elem[i] = props[i])
            : setAttribute(elem, i, props[i]);
    }
    if (isDocumentFragment(elem)) {
        children = name.children;
    }
    elem.append(...(children.some((i) => Array.isArray(i))
        ? children.map(getChildren).flat()
        : children));
    if (!viewElements) {
        setReactivity(elem);
    }
    return elem;
}
function getChildren(child) {
    return isObject(child) && !isNode(child)
        ? Object.values(child)
        : child;
}
/* c8 ignore end */
function setReactivity(DOM, eventFunctions) {
    if (isTextNode(DOM)) {
        setReactivitySingle(DOM);
        return;
    }
    const elems = document.createNodeIterator(DOM, NodeFilter.SHOW_ELEMENT);
    let elem;
    while ((elem = elems.nextNode())) {
        for (const key of elem.getAttributeNames()) {
            // Set functions
            const val = elem.getAttribute(key);
            if (eventFunctions && key.startsWith("on")) {
                const eventName = key.replace(onEventRegex, "");
                const event = eventFunctions[val];
                if (!event) {
                    setReactivitySingle(elem, key, val);
                    continue;
                }
                elem.removeAttribute(key);
                if (isEventObject(event)) {
                    elem.addEventListener(eventName, event.event, event.options);
                    if (elemEventFunctions.has(elem)) {
                        elemEventFunctions.get(elem).push(event.event);
                    }
                    else {
                        elemEventFunctions.set(elem, [event.event]);
                    }
                }
                else {
                    elem.addEventListener(eventName, event);
                    if (elemEventFunctions.has(elem)) {
                        elemEventFunctions.get(elem).push(event);
                    }
                    else {
                        elemEventFunctions.set(elem, [event]);
                    }
                }
            }
            else {
                setReactivitySingle(elem, key, val);
            }
        }
        let childNode = elem.firstChild;
        while (childNode) {
            if (isTextNode(childNode) && childNode.nodeValue?.includes("{{")) {
                setReactivitySingle(childNode);
            }
            childNode = childNode.nextSibling;
        }
    }
}
function setReactivitySingle(node, key, val) {
    let attr_OR_text, match;
    if (!key) {
        attr_OR_text = node.nodeValue; // nodeValue is (always) defined on Text Nodes
    }
    else {
        attr_OR_text = val;
        if (attr_OR_text === "") {
            // e.g. checked attribute or two-way attribute
            attr_OR_text = key;
            if (attr_OR_text.startsWith("{{")) {
                node.removeAttribute(attr_OR_text);
            }
        }
    }
    while ((match = attr_OR_text.match(reactivityRegex))) {
        // attr_OR_text will be altered in every iteration
        const [hydroMatch, hydroPath] = match;
        const properties = hydroPath
            .trim()
            .replace(newLineRegex, "")
            .split(propChainRegex)
            .filter(Boolean);
        const [resolvedValue, resolvedObj] = resolveObject(properties);
        let lastProp = properties[properties.length - 1];
        const start = match.index;
        let end = start + String(resolvedValue).length;
        if (isNode(resolvedValue)) {
            node.nodeValue = attr_OR_text.replace(hydroMatch, "");
            node.after(resolvedValue);
            setTraces(start, end, resolvedValue, lastProp, resolvedObj, key);
            return;
        }
        // Set Text or set Attribute
        if (isTextNode(node)) {
            const textContent = isObject(resolvedValue)
                ? JSON.stringify(resolvedValue)
                : resolvedValue ?? "";
            attr_OR_text = attr_OR_text.replace(hydroMatch, textContent);
            if (attr_OR_text != null) {
                node.nodeValue = attr_OR_text;
            }
        }
        else {
            if (key === "bind") {
                attr_OR_text = attr_OR_text.replace(hydroMatch, "");
                node.removeAttribute(key);
                const proxy = isObject(resolvedValue) && isProxy(resolvedValue)
                    ? resolvedValue
                    : resolvedObj;
                if (bindMap.has(proxy)) {
                    bindMap.get(proxy).push(node);
                }
                else {
                    bindMap.set(proxy, [node]);
                }
                continue;
            }
            else if (key === "two-way" /* Placeholder.twoWay */) {
                if (node instanceof HTMLSelectElement) {
                    node.value = resolvedValue;
                    changeAttrVal("change" /* Placeholder.change */, node, resolvedObj, lastProp);
                }
                else if (node instanceof HTMLInputElement &&
                    node.type === "radio" /* Placeholder.radio */) {
                    node.checked = node.value === resolvedValue;
                    changeAttrVal("change" /* Placeholder.change */, node, resolvedObj, lastProp);
                }
                else if (node instanceof HTMLInputElement &&
                    node.type === "checkbox" /* Placeholder.checkbox */) {
                    node.checked = resolvedValue;
                    changeAttrVal("change" /* Placeholder.change */, node, resolvedObj, lastProp, true);
                }
                else if (node instanceof HTMLTextAreaElement ||
                    node instanceof HTMLInputElement) {
                    node.value = resolvedValue;
                    changeAttrVal("input", node, resolvedObj, lastProp);
                }
                attr_OR_text = attr_OR_text.replace(hydroMatch, "");
                node.setAttribute("two-way" /* Placeholder.twoWay */, "");
            }
            else if (isFunction(resolvedValue) || isEventObject(resolvedValue)) {
                attr_OR_text = attr_OR_text.replace(hydroMatch, "");
                node.removeAttribute(key);
                addEventListener(node, key.replace(onEventRegex, ""), resolvedValue);
            }
            else if (isObject(resolvedValue)) {
                // Case: setting attrs on Element - <p ${props}>
                for (const [subKey, subVal] of Object.entries(resolvedValue)) {
                    attr_OR_text = attr_OR_text.replace(hydroMatch, "");
                    if (isFunction(subVal) || isEventObject(subVal)) {
                        addEventListener(node, subKey.replace(onEventRegex, ""), subVal);
                    }
                    else {
                        lastProp = subKey;
                        if (setAttribute(node, subKey, subVal)) {
                            end = start + String(subVal).length;
                        }
                        else {
                            end = start;
                        }
                    }
                    setTraces(start, end, node, lastProp, resolvedValue, subKey);
                }
                continue; // As we set all Mappings via subKeys
            }
            else {
                attr_OR_text = attr_OR_text.replace(hydroMatch, resolvedValue);
                if (!setAttribute(node, key, attr_OR_text === String(resolvedValue)
                    ? resolvedValue
                    : attr_OR_text)) {
                    attr_OR_text = attr_OR_text.replace(resolvedValue, "");
                }
            }
        }
        setTraces(start, end, node, lastProp, resolvedObj, key);
    }
}
// Same behavior as v-model in https://v3.vuejs.org/guide/forms.html#basic-usage
function changeAttrVal(eventName, node, resolvedObj, lastProp, isChecked = false) {
    node.addEventListener(eventName, changeHandler);
    onCleanup(() => node.removeEventListener(eventName, changeHandler), node);
    function changeHandler({ target }) {
        Reflect.set(resolvedObj, lastProp, isChecked
            ? target.checked
            : target.value);
    }
}
function setTraces(start, end, node, hydroKey, resolvedObj, key) {
    // Set WeakMaps, that will be used to track a change for a Node but also to check if a Node has any other changes.
    const change = [start, end, key];
    const changeArr = [change];
    if (allNodeChanges.has(node)) {
        allNodeChanges.get(node).push(change);
    }
    else {
        allNodeChanges.set(node, [change]); // Use own version. Otherwise changes, will lead to incorrect changes in the DOM.
    }
    if (reactivityMap.has(resolvedObj)) {
        const keyToNodeMap = reactivityMap.get(resolvedObj);
        const nodeToChangeMap = keyToNodeMap.get(hydroKey);
        if (nodeToChangeMap) {
            if (nodeToChangeMap.has(node)) {
                nodeToChangeMap.get(node).push(change);
            }
            else {
                nodeToChangeMap.set(changeArr, node);
                nodeToChangeMap.set(node, changeArr);
            }
        }
        else {
            keyToNodeMap.set(hydroKey, 
            //@ts-ignore
            new Map([
                [changeArr, node],
                [node, changeArr],
            ]));
        }
    }
    else {
        reactivityMap.set(resolvedObj, new Map([
            [
                hydroKey,
                //@ts-ignore
                new Map([
                    [changeArr, node],
                    [node, changeArr],
                ]),
            ],
        ]));
    }
}
// Helper function to return a value and hydro obj from a chain of properties
function resolveObject(propertyArray) {
    let value, prev;
    value = prev = hydro;
    for (const prop of propertyArray) {
        prev = value;
        value = Reflect.get(prev, prop);
    }
    return [value, prev];
}
function compareEvents(elem, where, onlyTextChildren) {
    const elemFunctions = [];
    const whereFunctions = [];
    if (isTextNode(elem)) {
        if (onRenderMap.has(elem)) {
            elemFunctions.push(onRenderMap.get(elem));
        }
        if (onCleanupMap.has(elem)) {
            elemFunctions.push(onCleanupMap.get(elem));
        }
        if (onRenderMap.has(where)) {
            whereFunctions.push(onRenderMap.get(where));
        }
        if (onCleanupMap.has(where)) {
            whereFunctions.push(onCleanupMap.get(where));
        }
        if (elemFunctions.length !== whereFunctions.length)
            return false;
        if (String(elemFunctions) !== String(whereFunctions))
            return false;
        return true;
    }
    if (elemEventFunctions.has(elem)) {
        elemFunctions.push(...elemEventFunctions.get(elem));
    }
    if (elemEventFunctions.has(where)) {
        whereFunctions.push(...elemEventFunctions.get(where));
    }
    if (onRenderMap.has(elem)) {
        elemFunctions.push(onRenderMap.get(elem));
    }
    if (onCleanupMap.has(elem)) {
        elemFunctions.push(onCleanupMap.get(elem));
    }
    if (onRenderMap.has(where)) {
        whereFunctions.push(onRenderMap.get(where));
    }
    if (onCleanupMap.has(where)) {
        whereFunctions.push(onCleanupMap.get(where));
    }
    if (elemFunctions.length !== whereFunctions.length)
        return false;
    if (String(elemFunctions) !== String(whereFunctions))
        return false;
    for (let i = 0; i < elem.childNodes.length; i++) {
        if (onlyTextChildren) {
            if (isTextNode(elem.childNodes[i])) {
                if (!compareEvents(elem.childNodes[i], where.childNodes[i], onlyTextChildren)) {
                    return false;
                }
            }
        }
        else {
            if (!compareEvents(elem.childNodes[i], where.childNodes[i])) {
                return false;
            }
        }
    }
    return true;
}
function compare(elem, where, onlyTextChildren) {
    if (isDocumentFragment(elem) || isDocumentFragment(where))
        return false;
    return (elem.isEqualNode(where) && compareEvents(elem, where, onlyTextChildren));
}
function render(elem, where = "", shouldSchedule = globalSchedule) {
    /* c8 ignore next 4 */
    if (shouldSchedule) {
        schedule(render, elem, where, false);
        return unmount(elem);
    }
    // Get elem value if elem is reactiveObject
    if (Reflect.has(elem, reactiveSymbol)) {
        elem = getValue(elem);
    }
    // Store elements of documentFragment for later unmount
    let elemChildren = [];
    if (isDocumentFragment(elem)) {
        elemChildren = Array.from(elem.childNodes);
        fragmentToElements.set(elem, elemChildren); // For diffing later
    }
    if (!where) {
        document.body.append(elem);
    }
    else {
        if (typeof where === "string" /* Placeholder.string */) {
            const resolveStringToElement = $(where);
            if (resolveStringToElement) {
                where = resolveStringToElement;
            }
            else {
                return noop;
            }
        }
        if (!reuseElements) {
            replaceElement(elem, where);
        }
        else {
            if (isTextNode(elem)) {
                replaceElement(elem, where);
            }
            else if (!compare(elem, where)) {
                treeDiff(elem, where);
            }
        }
    }
    runLifecyle(elem, onRenderMap);
    for (const subElem of elemChildren) {
        runLifecyle(subElem, onRenderMap);
    }
    return unmount(isDocumentFragment(elem) ? elemChildren : elem);
}
function noop() { }
function executeLifecycle(node, lifecyleMap) {
    if (lifecyleMap.has(node)) {
        const fn = lifecyleMap.get(node);
        if (globalSchedule) {
            window.requestIdleCallback(fn);
        }
        else {
            fn();
        }
        lifecyleMap.delete(node);
    }
}
function runLifecyle(node, lifecyleMap) {
    if ((lifecyleMap === onRenderMap && !calledOnRender) ||
        (lifecyleMap === onCleanupMap && !calledOnCleanup))
        return;
    executeLifecycle(node, lifecyleMap);
    const elements = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
    let subElem;
    while ((subElem = elements.nextNode())) {
        executeLifecycle(subElem, lifecyleMap);
        let childNode = subElem.firstChild;
        while (childNode) {
            if (isTextNode(childNode)) {
                executeLifecycle(childNode, lifecyleMap);
            }
            childNode = childNode.nextSibling;
        }
    }
}
function filterTag2Elements(tag2Elements, root) {
    for (const [localName, list] of tag2Elements.entries()) {
        for (let i = 0; i < list.length; i++) {
            const elem = list[i];
            if (root.contains(elem) || root.isSameNode(elem)) {
                list.splice(i, 1);
                i--;
            }
            if (list.length === 0) {
                tag2Elements.delete(localName);
            }
        }
    }
}
function treeDiff(elem, where) {
    let elemElements = [...elem.querySelectorAll("*")];
    if (!isDocumentFragment(elem))
        elemElements.unshift(elem);
    let whereElements = [];
    if (!isTextNode(where)) {
        whereElements = [...where.querySelectorAll("*")];
        if (!isDocumentFragment(where))
            whereElements.unshift(where);
    }
    let template;
    if (insertBeforeDiffing) {
        template = document.createElement("template" /* Placeholder.template */);
        /* c8 ignore next 3 */
        if (where === document.documentElement) {
            where.append(template);
        }
        else {
            if (isDocumentFragment(where)) {
                fragmentToElements.get(where)[0].before(template);
            }
            else {
                where.before(template);
            }
        }
        template.append(elem);
    }
    // Create Mapping for easier diffing, eg: "div" -> [...Element]
    const tag2Elements = new Map();
    for (const wElem of whereElements) {
        /* c8 ignore next 2 */
        if (insertBeforeDiffing && wElem === template)
            return;
        if (tag2Elements.has(wElem.localName)) {
            tag2Elements.get(wElem.localName).push(wElem);
        }
        else {
            tag2Elements.set(wElem.localName, [wElem]);
        }
    }
    // Re-use any where Element if possible, then remove elem Element
    for (const subElem of elemElements) {
        const sameElements = tag2Elements.get(subElem.localName);
        if (sameElements) {
            for (const whereElem of sameElements) {
                if (compare(subElem, whereElem, true)) {
                    subElem.replaceWith(whereElem);
                    runLifecyle(subElem, onCleanupMap);
                    filterTag2Elements(tag2Elements, whereElem);
                    break;
                }
            }
        }
    }
    if (insertBeforeDiffing) {
        const newElems = isDocumentFragment(elem)
            ? Array.from(template.childNodes)
            : [elem];
        if (isDocumentFragment(where)) {
            const oldElems = fragmentToElements.get(where);
            for (const e of newElems)
                oldElems[0].before(e);
            for (const e of oldElems)
                e.remove();
        }
        else {
            where.replaceWith(...newElems);
        }
        template.remove();
        runLifecyle(where, onCleanupMap);
    }
    else {
        replaceElement(elem, where);
    }
    tag2Elements.clear();
}
function replaceElement(elem, where) {
    if (isDocumentFragment(where)) {
        const fragmentChildren = fragmentToElements.get(where);
        if (isDocumentFragment(elem)) {
            const fragmentElements = Array.from(elem.childNodes);
            for (let index = 0; index < fragmentChildren.length; index++) {
                const fragWhere = fragmentChildren[index];
                if (index < fragmentElements.length) {
                    render(fragmentElements[index], fragWhere);
                }
                else {
                    fragWhere.remove();
                }
            }
        }
        else {
            for (let index = 0; index < fragmentChildren.length; index++) {
                const fragWhere = fragmentChildren[index];
                if (index === 0) {
                    render(elem, fragWhere);
                }
                else {
                    fragWhere.remove();
                }
            }
        }
    }
    else {
        where.replaceWith(elem);
    }
    runLifecyle(where, onCleanupMap);
}
function unmount(elem) {
    if (Array.isArray(elem)) {
        return () => elem.forEach(removeElement);
    }
    else {
        return () => removeElement(elem);
    }
}
function removeElement(elem) {
    if (elem.isConnected) {
        elem.remove();
        runLifecyle(elem, onCleanupMap);
    }
}
/* c8 ignore next 13 */
function schedule(fn, ...args) {
    if (navigator.scheduling) {
        if (navigator.scheduling.isInputPending()) {
            setTimeout(schedule, 0, fn, ...args);
        }
        else {
            fn(...args);
        }
    }
    else {
        window.requestIdleCallback(() => fn(...args));
    }
}
function reactive(initial) {
    let key;
    do
        key = randomText();
    while (Reflect.has(hydro, key));
    Reflect.set(hydro, key, initial);
    Reflect.set(setter, reactiveSymbol, true);
    const chainKeysProxy = chainKeys(setter, [key]);
    return chainKeysProxy;
    function setter(val) {
        const keys = // @ts-ignore
         (this && Reflect.has(this, reactiveSymbol) ? this : chainKeysProxy)[keysSymbol.description];
        const [resolvedValue, resolvedObj] = resolveObject(keys);
        const lastProp = keys[keys.length - 1];
        if (isFunction(val)) {
            const returnVal = val(resolvedValue);
            const sameObject = resolvedValue === returnVal;
            if (sameObject)
                return;
            Reflect.set(resolvedObj, lastProp, returnVal ?? resolvedValue);
        }
        else {
            Reflect.set(resolvedObj, lastProp, val);
        }
    }
}
function chainKeys(initial, keys) {
    return new Proxy(initial, {
        get(target, subKey, _receiver) {
            if (subKey === reactiveSymbol.description)
                return true;
            if (subKey === keysSymbol.description) {
                return keys;
            }
            if (subKey === Symbol.toPrimitive) {
                return () => `{{${keys.join(".")}}}`;
            }
            return chainKeys(target, [...keys, subKey]);
        },
    });
}
function getReactiveKeys(reactiveHydro) {
    const keys = reactiveHydro[keysSymbol.description];
    const lastProp = keys[keys.length - 1];
    return [lastProp, keys.length === 1];
}
function unset(reactiveHydro) {
    const [lastProp, oneKey] = getReactiveKeys(reactiveHydro);
    if (oneKey) {
        Reflect.set(hydro, lastProp, null);
    }
    else {
        const [_, resolvedObj] = resolveObject(reactiveHydro[keysSymbol.description]);
        Reflect.set(resolvedObj, lastProp, null);
    }
}
function setAsyncUpdate(reactiveHydro, asyncUpdate) {
    const [_, oneKey] = getReactiveKeys(reactiveHydro);
    if (oneKey) {
        hydro.asyncUpdate = asyncUpdate;
    }
    else {
        const [_, resolvedObj] = resolveObject(reactiveHydro[keysSymbol.description]);
        resolvedObj.asyncUpdate = asyncUpdate;
    }
}
function observe(reactiveHydro, fn) {
    const [lastProp, oneKey] = getReactiveKeys(reactiveHydro);
    if (oneKey) {
        hydro.observe(lastProp, fn);
    }
    else {
        const [_, resolvedObj] = resolveObject(reactiveHydro[keysSymbol.description]);
        resolvedObj.observe(lastProp, fn);
    }
}
function unobserve(reactiveHydro) {
    const [lastProp, oneKey] = getReactiveKeys(reactiveHydro);
    if (oneKey) {
        hydro.unobserve(lastProp);
    }
    else {
        const [_, resolvedObj] = resolveObject(reactiveHydro[keysSymbol.description]);
        resolvedObj.unobserve(lastProp);
    }
}
function ternary(condition, trueVal, falseVal, reactiveHydro = condition) {
    const checkCondition = (cond) => (!Reflect.has(condition, reactiveSymbol) && isFunction(condition)
        ? condition(cond)
        : isPromise(cond)
            ? false
            : cond)
        ? isFunction(trueVal)
            ? trueVal()
            : trueVal
        : isFunction(falseVal)
            ? falseVal()
            : falseVal;
    const ternaryValue = reactive(checkCondition(getValue(reactiveHydro)));
    observe(reactiveHydro, (newVal) => {
        newVal === null
            ? unset(ternaryValue)
            : ternaryValue(checkCondition(newVal));
    });
    return ternaryValue;
}
function emit(eventName, data, who, options = { bubbles: true }) {
    who.dispatchEvent(new CustomEvent(eventName, { ...options, detail: data }));
}
let trackDeps = false;
const trackProxies = new Set();
const trackMap = new WeakMap();
const unobserveMap = new WeakMap();
function watchEffect(fn) {
    trackDeps = true;
    fn();
    trackDeps = false;
    const reRun = (newVal) => {
        if (newVal !== null)
            fn();
    };
    for (const proxy of trackProxies) {
        if (!trackMap.has(proxy))
            continue;
        for (const key of trackMap.get(proxy)) {
            proxy.observe(key, reRun);
            if (unobserveMap.has(reRun)) {
                unobserveMap.get(reRun).push({ proxy, key });
            }
            else {
                unobserveMap.set(reRun, [{ proxy, key }]);
            }
        }
        trackMap.delete(proxy);
    }
    trackProxies.clear();
    return () => unobserveMap
        .get(reRun)
        .forEach((entry) => entry.proxy.unobserve(entry.key, reRun));
}
function getValue(reactiveHydro) {
    const [resolvedValue] = resolveObject(Reflect.get(reactiveHydro, keysSymbol.description));
    return resolvedValue;
}
let calledOnRender = false;
function onRender(fn, elem, ...args) {
    calledOnRender = true;
    onRenderMap.set(elem, args.length ? fn.bind(fn, ...args) : fn);
}
let calledOnCleanup = false;
function onCleanup(fn, elem, ...args) {
    calledOnCleanup = true;
    onCleanupMap.set(elem, args.length ? fn.bind(fn, ...args) : fn);
}
// Core of the library
function generateProxy(obj) {
    const handlers = Symbol("handlers"); // For observer pattern
    const boundFunctions = new WeakMap();
    const proxy = new Proxy(obj ?? {}, {
        // If receiver is a getter, then it is the object on which the search first started for the property|key -> Proxy
        set(target, key, val, receiver) {
            if (trackDeps) {
                trackProxies.add(receiver);
                if (trackMap.has(receiver)) {
                    trackMap.get(receiver).add(key);
                }
                else {
                    trackMap.set(receiver, new Set([key]));
                }
            }
            let returnSet = true;
            let oldVal = Reflect.get(target, key, receiver);
            if (oldVal === val)
                return returnSet;
            // Reset Path - mostly GC
            if (val === null) {
                // Remove entry from reactitivyMap underlying Map
                if (reactivityMap.has(receiver)) {
                    const key2NodeMap = reactivityMap.get(receiver);
                    key2NodeMap.delete(String(key));
                    if (key2NodeMap.size === 0) {
                        reactivityMap.delete(receiver);
                    }
                }
                // Inform the Observers about null change and unobserve
                const observer = Reflect.get(target, handlers, receiver);
                if (observer.has(key)) {
                    let set = observer.get(key);
                    for (const handler of set) {
                        handler(null, oldVal);
                    }
                    set.clear();
                    receiver.unobserve(key);
                }
                // If oldVal is a Proxy - clean it
                if (isObject(oldVal) && isProxy(oldVal)) {
                    reactivityMap.delete(oldVal);
                    if (bindMap.has(oldVal)) {
                        bindMap.get(oldVal).forEach(removeElement);
                        bindMap.delete(oldVal);
                    }
                }
                else {
                    if (bindMap.has(receiver)) {
                        bindMap.get(receiver).forEach(removeElement);
                        bindMap.delete(receiver);
                    }
                }
                // Remove item from array
                /* c8 ignore next 4 */
                if (!internReset && Array.isArray(receiver)) {
                    receiver.splice(Number(key), 1);
                    return returnSet;
                }
                return Reflect.deleteProperty(receiver, key);
            }
            // Set the value
            if (isPromise(val)) {
                const promise = val;
                promise
                    .then((value) => {
                    // No Reflect in order to trigger the Getter
                    receiver[key] = value;
                })
                    .catch((e) => {
                    console.error(e);
                    receiver[key] = null;
                });
                returnSet = Reflect.set(target, key, val, receiver);
                return returnSet;
            }
            else if (isNode(val)) {
                returnSet = Reflect.set(target, key, val, receiver);
            }
            else if (isObject(val) && !isProxy(val)) {
                returnSet = Reflect.set(target, key, generateProxy(val), receiver);
                // Recursively set properties to Proxys too
                for (const [subKey, subVal] of Object.entries(val)) {
                    if (isObject(subVal) && !isProxy(subVal)) {
                        Reflect.set(val, subKey, generateProxy(subVal));
                    }
                }
            }
            else {
                if (!reuseElements &&
                    Array.isArray(receiver) &&
                    receiver.includes(oldVal) &&
                    receiver.includes(val) &&
                    /* c8 ignore start */
                    bindMap.has(val)) {
                    const [elem] = bindMap.get(val);
                    if (lastSwapElem !== elem) {
                        const [oldElem] = bindMap.get(oldVal);
                        lastSwapElem = oldElem;
                        const prevElem = elem.previousSibling;
                        const prevOldElem = oldElem.previousSibling;
                        // Move it in the array too without triggering the proxy set
                        const index = receiver.findIndex((i) => i === val);
                        receiver.splice(Number(key), 1, val);
                        receiver.splice(index, 1, oldVal);
                        prevElem.after(oldElem);
                        prevOldElem.after(elem);
                    }
                    return true;
                }
                else {
                    /* c8 ignore end */
                    returnSet = Reflect.set(target, key, val, receiver);
                }
            }
            const newVal = Reflect.get(target, key, receiver);
            // Check if DOM needs to be updated
            // oldVal can be Proxy value too
            if (reactivityMap.has(oldVal)) {
                checkReactivityMap(oldVal, key, newVal, oldVal);
            }
            else if (reactivityMap.has(receiver)) {
                checkReactivityMap(receiver, key, newVal, oldVal);
            }
            // current val (before setting) is a proxy - take over its keyToNodeMap
            if (isObject(val) && isProxy(val)) {
                if (reactivityMap.has(oldVal)) {
                    // Store old reactivityMap if it is a swap operation
                    reuseElements && tmpSwap.set(oldVal, reactivityMap.get(oldVal));
                    if (tmpSwap.has(val)) {
                        reactivityMap.set(oldVal, tmpSwap.get(val));
                        tmpSwap.delete(val);
                    }
                    else {
                        reactivityMap.set(oldVal, reactivityMap.get(val));
                    }
                }
            }
            // Inform the Observers
            if (returnSet) {
                Reflect.get(target, handlers, receiver)
                    .get(key)
                    ?.forEach((handler) => handler(newVal, oldVal));
            }
            // If oldVal is a Proxy - clean it
            !reuseElements && oldVal && cleanProxy(oldVal);
            return returnSet;
        },
        // fix proxy bugs, e.g Map
        get(target, prop, receiver) {
            if (trackDeps) {
                trackProxies.add(receiver);
                if (trackMap.has(receiver)) {
                    trackMap.get(receiver).add(prop);
                }
                else {
                    trackMap.set(receiver, new Set([prop]));
                }
            }
            const value = Reflect.get(target, prop, receiver);
            if (!isFunction(value)) {
                return value;
            }
            if (!boundFunctions.has(value)) {
                boundFunctions.set(value, value.bind(target));
            }
            return boundFunctions.get(value);
        },
    });
    Reflect.defineProperty(proxy, "isProxy" /* Placeholder.isProxy */, {
        value: true,
    });
    Reflect.defineProperty(proxy, "asyncUpdate" /* Placeholder.asyncUpdate */, {
        value: globalSchedule,
        writable: true,
    });
    Reflect.defineProperty(proxy, handlers, {
        value: new Map(),
    });
    Reflect.defineProperty(proxy, "observe" /* Placeholder.observe */, {
        value(key, handler) {
            const map = Reflect.get(proxy, handlers);
            if (map.has(key)) {
                map.get(key).add(handler);
            }
            else {
                map.set(key, new Set([handler]));
            }
        },
        configurable: true,
    });
    Reflect.defineProperty(proxy, "getObservers" /* Placeholder.getObservers */, {
        value() {
            return Reflect.get(proxy, handlers);
        },
        configurable: true,
    });
    Reflect.defineProperty(proxy, "unobserve" /* Placeholder.unobserve */, {
        value(key, handler) {
            const map = Reflect.get(proxy, handlers);
            if (key) {
                if (map.has(key)) {
                    if (handler == null) {
                        map.delete(key);
                    }
                    else {
                        const set = map.get(key);
                        if (set?.has(handler)) {
                            set.delete(handler);
                        }
                    }
                }
                /* c8 ignore next 3 */
            }
            else {
                map.clear();
            }
        },
        configurable: true,
    });
    if (!obj)
        Reflect.defineProperty(proxy, _boundFunctions, {
            value: boundFunctions,
        });
    return proxy;
}
function cleanProxy(proxy) {
    if (isObject(proxy) && isProxy(proxy)) {
        reactivityMap.delete(proxy);
        /* c8 ignore next 4 */
        if (bindMap.has(proxy)) {
            bindMap.get(proxy).forEach(removeElement);
            bindMap.delete(proxy);
        }
    }
}
function checkReactivityMap(obj, key, val, oldVal) {
    const keyToNodeMap = reactivityMap.get(obj);
    const nodeToChangeMap = keyToNodeMap.get(String(key));
    if (nodeToChangeMap) {
        /* c8 ignore next 5 */
        if (Reflect.get(obj, "asyncUpdate" /* Placeholder.asyncUpdate */)) {
            schedule(updateDOM, nodeToChangeMap, val, oldVal);
        }
        else {
            updateDOM(nodeToChangeMap, val, oldVal);
        }
    }
    if (isObject(val)) {
        for (const [subKey, subVal] of Object.entries(val)) {
            const subOldVal = (isObject(oldVal) && Reflect.get(oldVal, subKey)) || oldVal;
            const nodeToChangeMap = keyToNodeMap.get(subKey);
            if (nodeToChangeMap) {
                /* c8 ignore next 5 */
                if (Reflect.get(obj, "asyncUpdate" /* Placeholder.asyncUpdate */)) {
                    schedule(updateDOM, nodeToChangeMap, subVal, subOldVal);
                }
                else {
                    updateDOM(nodeToChangeMap, subVal, subOldVal);
                }
            }
        }
    }
}
function updateDOM(nodeToChangeMap, val, oldVal) {
    nodeToChangeMap.forEach((entry) => {
        // Circular reference in order to keep Memory low
        if (isNode(entry)) {
            /* c8 ignore next 5 */
            if (!entry.isConnected) {
                const tmpChange = nodeToChangeMap.get(entry);
                nodeToChangeMap.delete(entry);
                nodeToChangeMap.delete(tmpChange);
            }
            return; // Continue in forEach
        }
        // For each change of the node update either attribute or textContent
        for (const change of entry) {
            const node = nodeToChangeMap.get(entry);
            const [start, end, key] = change;
            let useStartEnd = false;
            if (isNode(val)) {
                replaceElement(val, node);
                if (val !== node) {
                    nodeToChangeMap.delete(node);
                    if (!isDocumentFragment(val)) {
                        nodeToChangeMap.set(val, entry);
                        nodeToChangeMap.set(entry, val);
                    }
                }
            }
            else if (isTextNode(node)) {
                useStartEnd = true;
                let text = node.nodeValue;
                node.nodeValue =
                    text.substring(0, start) + String(val) + text.substring(end);
            }
            else {
                if (key === "two-way" /* Placeholder.twoWay */) {
                    if (node instanceof HTMLInputElement &&
                        node.type === "radio" /* Placeholder.radio */) {
                        node.checked = Array.isArray(val)
                            ? val.includes(node.name)
                            : String(val) === node.value;
                    }
                    else if (node instanceof HTMLInputElement &&
                        node.type === "checkbox" /* Placeholder.checkbox */) {
                        node.checked = val;
                    }
                    else if (node instanceof HTMLTextAreaElement ||
                        node instanceof HTMLSelectElement ||
                        node instanceof HTMLInputElement) {
                        node.value = String(val);
                    }
                }
                else if (isFunction(val) || isEventObject(val)) {
                    const eventName = key.replace(onEventRegex, "");
                    node.removeEventListener(eventName, isFunction(oldVal) ? oldVal : oldVal.event);
                    addEventListener(node, eventName, val);
                }
                else if (isObject(val)) {
                    for (const [subKey, subVal] of Object.entries(val)) {
                        if (isFunction(subVal) || isEventObject(subVal)) {
                            const eventName = subKey.replace(onEventRegex, "");
                            node.removeEventListener(eventName, isFunction(oldVal[subKey])
                                ? oldVal[subKey]
                                : oldVal[subKey].event);
                            addEventListener(node, eventName, subVal);
                        }
                        else {
                            setAttribute(node, subKey, subVal);
                        }
                    }
                }
                else {
                    useStartEnd = true;
                    let attr = node.getAttribute(key);
                    if (attr) {
                        attr = attr.substring(0, start) + String(val) + attr.substring(end);
                        setAttribute(node, key, attr === String(val) ? val : attr);
                    }
                    else {
                        setAttribute(node, key, val);
                    }
                }
            }
            if (useStartEnd) {
                // Update end
                change[1] = start + String(val).length;
                // Because we updated the end, we also have to update the start and end for every other reactive change in the node, for the same key
                if (allNodeChanges.has(node)) {
                    let passedNode = false;
                    for (const nodeChange of allNodeChanges.get(node)) {
                        if (nodeChange === change) {
                            passedNode = true;
                            continue;
                        }
                        if (passedNode && (isTextNode(node) || key === nodeChange[2])) {
                            const difference = String(oldVal).length - String(val).length;
                            nodeChange[0] -= difference;
                            nodeChange[1] -= difference;
                        }
                    }
                }
            }
        }
    });
}
function view(root, data, renderFunction) {
    viewElements = true;
    const rootElem = $(root);
    const elements = getValue(data).map(renderFunction);
    rootElem.append(...elements);
    for (const elem of elements)
        runLifecyle(elem, onRenderMap);
    if (rootElem.hasChildNodes())
        setReactivity(rootElem);
    onCleanup(unset, rootElem, data);
    viewElements = false;
    observe(data, (newData, oldData) => {
        /* c8 ignore start */
        viewElements = true;
        // Reset or re-use
        if (!newData?.length ||
            (!reuseElements && newData?.length === oldData?.length)) {
            rootElem.textContent = "";
        }
        else if (reuseElements) {
            for (let i = 0; i < oldData?.length && newData?.length; i++) {
                oldData[i].id = newData[i].id;
                oldData[i].label = newData[i].label;
                newData[i] = oldData[i];
            }
        }
        // Add to existing
        if (oldData?.length &&
            newData?.length > oldData?.length &&
            newData[0] === oldData[0]) {
            const length = oldData.length;
            const slicedData = newData.slice(length);
            const newElements = slicedData.map((item, i) => renderFunction(item, i + length));
            rootElem.append(...newElements);
            for (const elem of newElements)
                runLifecyle(elem, onRenderMap);
        }
        // Add new
        else if (oldData?.length === 0 || (!reuseElements && newData?.length)) {
            if (!reuseElements && oldData?.length && rootElem.hasChildNodes()) {
                rootElem.textContent = "";
            }
            const elements = newData.map(renderFunction);
            rootElem.append(...elements);
            for (const elem of elements)
                runLifecyle(elem, onRenderMap);
        }
        if (rootElem.hasChildNodes())
            setReactivity(rootElem);
        viewElements = false;
        /* c8 ignore end */
    });
}
const hydro = generateProxy();
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const internals = {
    compare,
};
export { render, html, h, hydro, setGlobalSchedule, setReuseElements, setInsertDiffing, setShouldSetReactivity, reactive, unset, setAsyncUpdate, unobserve, observe, ternary, emit, watchEffect, internals, getValue, onRender, onCleanup, setReactivity, $, $$, view, };
