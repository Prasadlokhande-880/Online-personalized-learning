# router-dom

> A lightweight router for single-page applications with faster subsequent page-loads by prefetching links during idle time if the user is not saving data.
>
> - it helps to reduce the delay between your pages, to minimize browser HTTP requests and enhance your user's web experience.
> - library agnostic.
> - simple: define your routes, start to listen global event and to route changes.
> - base href support.
> - opt-in errorHandler and formHandler.
> - support in all modern browsers.
> - RegExp and nested Routes.

## Demo

Simple: https://codepen.io/FabianK/pen/vYxXjwv?editors=1000<br>
Advanced: https://page-transitions-router.netlify.app

## Installation

With npm:

```properties
$ npm i router-dom
```

or via CDN:

```html
<script type="module">
  import Router from "https://cdn.skypack.dev/router-dom";
  new Router(...) // see Constructor Documentation
</script>
```

## Usage

```html
<a href="/">Home</a>
<a href="/about">About</a>

<div data-outlet></div>
```

## Dependencies

[path-to-regexp](https://github.com/pillarjs/path-to-regexp): Turn a path string such as '/user/:name' into a regular expression<br>
[hydro-js](https://github.com/Krutsch/hydro-js): Renders the view. In order to pass state via an anchor element (data attribute), a mapping on the hydro object is needed.<br>

## Documentation

### Events

- window: beforeRouting & afterRouting

### Constructor

The router class takes an array with at least one entry. Only the path is mandatory.<br>
Either a template or and element will be rendered in your element with attribute `data-outlet`.<br>
You can also specifiy one-level of children.<br> One more interesting property is the `restoreScrollOnReload`.
The second argument is the optional object options: it can take a general errorHandler, a formHandler and the scrollBehavior. If there is a formHandler, form submits will handled via attributes on the form element and fetch.

```js
const router = new Router([
  {
    path: "/",
    restoreScrollOnReload: true,
  },
  {
    path: "/about",
    templateUrl: "/about.html",
    leave: ({ from, to, params, state }) => {},
  },
  {
    path: "/contact/:name",
    element: "<h2>Drop a message on [...]</h2>" // or an actual Node Element,
    beforeEnter: ({ from, to, params, state }) => {},
    afterEnter: ({ from, to, params, state }) => {},
  },
]);
```

### go

- Takes a path, a state object and optional params. Will redirect to the path.

### removeRoute

- Removes a route from the routes array.

### addRoute

- Adds a route object to the routes array.

### modifyRoute

- Replaces a route with a new one.

### changeOptions

- Replaces the router options.

### static getParams

- Returns the params as key-value pair.
