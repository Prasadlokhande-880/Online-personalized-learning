declare global {
    interface Window {
        $: Document["querySelector"];
        $$: Document["querySelectorAll"];
    }
    interface Number {
        setter(val: any): void;
    }
    interface String {
        setter(val: any): void;
    }
    interface Symbol {
        setter(val: any): void;
    }
    interface Boolean {
        setter(val: any): void;
    }
    interface BigInt {
        setter(val: any): void;
    }
    interface Object {
        setter(val: any): void;
    }
    interface Navigator {
        scheduling: {
            isInputPending(IsInputPendingOptions?: isInputPendingOptions): boolean;
        };
    }
}
type isInputPendingOptions = {
    includeContinuous: boolean;
};
interface hydroObject extends Record<PropertyKey, any> {
    isProxy: boolean;
    asyncUpdate: boolean;
    observe: (key: PropertyKey, fn: Function) => any;
    getObservers: () => Map<string, Set<Function>>;
    unobserve: (key?: PropertyKey, handler?: Function) => undefined;
}
interface EventObject {
    event: EventListener;
    options: AddEventListenerOptions;
}
type reactiveObject<T> = T & hydroObject & ((setter: any) => void);
type eventFunctions = Record<string, EventListener | EventObject>;
declare function setGlobalSchedule(willSchedule: boolean): void;
declare function setReuseElements(willReuse: boolean): void;
declare function setInsertDiffing(willInsert: boolean): void;
declare function setShouldSetReactivity(willSet: boolean): void;
declare function html(htmlArray: TemplateStringsArray, ...variables: Array<any>): Element | DocumentFragment | Text;
type FragmentCase = {
    children: ReturnType<typeof h>[];
};
declare function h(name: string | ((...args: any[]) => ReturnType<typeof h>) | FragmentCase, props: Record<keyof any, any> | null, ...children: Array<any>): ReturnType<typeof html>;
declare function setReactivity(DOM: ReturnType<typeof html>, eventFunctions?: eventFunctions): void;
declare function compare(elem: Element | DocumentFragment, where: Element | DocumentFragment | Text, onlyTextChildren?: boolean): boolean;
declare function render(elem: ReturnType<typeof html> | reactiveObject<any>, where?: ReturnType<typeof html> | string, shouldSchedule?: boolean): ChildNode["remove"];
declare function reactive<T>(initial: T): reactiveObject<T>;
declare function unset(reactiveHydro: reactiveObject<any>): void;
declare function setAsyncUpdate(reactiveHydro: reactiveObject<any>, asyncUpdate: boolean): void;
declare function observe(reactiveHydro: reactiveObject<any>, fn: Function): void;
declare function unobserve(reactiveHydro: reactiveObject<any>): void;
declare function ternary(condition: Function | reactiveObject<any>, trueVal: any, falseVal: any, reactiveHydro?: reactiveObject<any>): any;
declare function emit(eventName: string, data: any, who: EventTarget, options?: object): void;
declare function watchEffect(fn: Function): () => void;
declare function getValue<T extends object>(reactiveHydro: T): T;
declare function onRender(fn: Function, elem: ReturnType<typeof html>, ...args: Array<any>): void;
declare function onCleanup(fn: Function, elem: ReturnType<typeof html>, ...args: Array<any>): void;
declare function view(root: string, data: reactiveObject<Array<any>>, renderFunction: (value: any, index: number) => Node): void;
declare const hydro: hydroObject;
declare const $: <T extends string>(query: T) => MatchEachElement<GetEachElementName<Split<T, ",">, []>, null>;
declare const $$: <T extends string>(query: T) => [] | NonNullable<MatchEachElement<GetEachElementName<Split<T, ",">, []>, null>>[];
type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];
type TakeLast<V> = V extends [] ? never : V extends [string] ? V[0] : V extends [string, ...infer R] ? TakeLast<R> : never;
type TrimLeft<V extends string> = V extends ` ${infer R}` ? TrimLeft<R> : V;
type TrimRight<V extends string> = V extends `${infer R} ` ? TrimRight<R> : V;
type Trim<V extends string> = TrimLeft<TrimRight<V>>;
type StripModifier<V extends string, M extends string> = V extends `${infer L}${M}${infer A}` ? L : V;
type StripModifiers<V extends string> = StripModifier<StripModifier<StripModifier<StripModifier<V, ".">, "#">, "[">, ":">;
type TakeLastAfterToken<V extends string, T extends string> = StripModifiers<TakeLast<Split<Trim<V>, T>>>;
type GetLastElementName<V extends string> = TakeLastAfterToken<TakeLastAfterToken<V, " ">, ">">;
type GetEachElementName<V, L extends string[] = []> = V extends [] ? L : V extends [string] ? [...L, GetLastElementName<V[0]>] : V extends [string, ...infer R] ? GetEachElementName<R, [...L, GetLastElementName<V[0]>]> : [];
type GetElementNames<V extends string> = GetEachElementName<Split<V, ",">>;
type ElementByName<V extends string> = V extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[V] : V extends keyof SVGElementTagNameMap ? SVGElementTagNameMap[V] : Element;
type MatchEachElement<V, L extends Element | null = null> = V extends [] ? L : V extends [string] ? L | ElementByName<V[0]> : V extends [string, ...infer R] ? MatchEachElement<R, L | ElementByName<V[0]>> : L;
type QueryResult<T extends string> = MatchEachElement<GetElementNames<T>>;
declare const internals: {
    compare: typeof compare;
};
export { render, html, h, hydro, setGlobalSchedule, setReuseElements, setInsertDiffing, setShouldSetReactivity, reactive, unset, setAsyncUpdate, unobserve, observe, ternary, emit, watchEffect, internals, getValue, onRender, onCleanup, setReactivity, $, $$, view, };
