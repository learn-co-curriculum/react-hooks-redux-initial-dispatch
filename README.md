# Dispatching an Initial Action for Setup

## Objectives

In this lesson, you will learn the following:

* How dispatching an initial action gives an initial render of the view.
* How dispatching an initial action gives an initial setup of the store's state.

To follow along in this code-along, use the `js/reducer.js` file and update
according to the Readme. Open `index.html` and try running `dispatch({type:
"INCREASE_COUNT"})` in the browser console. You should see a `1` appear on the
otherwise blank page.

## Dispatch an Initial Action to Render the View

Currently, we have built our `changeState()` reducer, and the `dispatch()` and
`render()` functions.  Remember that we built the `dispatch()` function such that
each time we execute it, we call the `render()` function:

```javascript
let state = {count: 0};

function changeState(state, action){
  switch (action.type) {
    case 'INCREASE_COUNT':
      return {count: state.count + 1}
    default:
      return state;
  }
}

function dispatch(action){
    state = changeState(state, action)
    render()
}

function render(){
    document.body.textContent = state.count
}
```

Notice that by calling `dispatch()` with an action as an argument, we do render
something on the page. We dispatch an action of `"INCREASE_COUNT"` and we see
the number `1` in our HTML, but **we never see the number zero displayed**.  One
easy way to fix this is to simply call the `render()` function at the bottom of
our JavaScript code, like the previous lesson. We'll choose a different
approach, though, and use the `dispatch()` function we already have.  

Remember that our `dispatch()` function also calls our `render()` function.  So, if
we dispatch a meaningless action, our reducer will simply return the existing
state (the `default` case in our `switch`), and then our `render()` function will
be called.  Let's try it by dispatching an action of type `@@INIT`.
If you already have `index.html` open in browser, refresh the page
and enter the following into the browser console:

```javascript
dispatch({ type: '@@INIT' })
```

Cool, now our HTML starts off at zero.  And each time we call dispatch, the HTML
is appropriately updated.  

Note that we can dispatch an action of any type, so long as it doesn't hit our
switch statement.  We dispatch an action of type `@@INIT` by convention, but you
could just as well choose something else and get the same result:

```javascript
dispatch({ type: 'beef' })
```

The `switch` will return whatever state was passed into the `changeState()`
function. Then `render()` will be called and that updated state will get applied
to the DOM.

Now, if we want our page to display `0` when it first loads, we can just add `dispatch({ type: '@@INIT' })` at the end of the file.

## Dispatch an Initial Action to Set up our Initial State

Now that we've seen a simple fix for setting up the initial render of HTML,
let's see if there's a simple fix for setting up our state.  Notice that
currently we set the initial value of the state at the very first line of our
JavaScript with the following:

```js
let state = { count: 0 };
```

The problem here is that we would prefer to look to our reducer to see how to
manage the state.  After all, our reducer returns the new state every time we
dispatch a new action. Perhaps our reducer can also return our initial state?  

Let's begin by simply declaring our state, but not assigning it to equal
anything.  So, we accordingly change the first line of our JavaScript:

```javascript
let state;
```

```javascript
function changeState(state, action) {

    switch (action.type) {

      case 'INCREASE_COUNT':
        return { count: state.count + 1 }

      default:
        return state;
    }
  }

  function dispatch(action){
  state = changeState(state, action)
  render()
}

function render(){
  document.body.textContent = state.count
}

dispatch({ type: '@@INIT' })
```

But, we find that dispatching the action of type `@@INIT` gives us an error:

```text
Uncaught TypeError: Cannot read property 'count' of undefined(…)
```

See that?  Our `render()` function is breaking because now state starts off as
undefined.  When we dispatch our action, it calls the reducer, which passes
through our state whose value is undefined, and then returns the default value
of our switch statement, which is just our undefined state.  

What would be really nice is if we could say when you pass a state of
`undefined` to our reducer, assign a value to our initial state. Luckily, ES6
allows us to pass default arguments to functions and we can give our `changeState()`
reducer a default argument to do just that.  Let's change our reducer to the
following:

```javascript
function changeState(state = { count: 0 }, action) {

    switch (action.type) {

      case 'INCREASE_COUNT':
        return { count: state.count + 1 }

      default:
        return state;
    }
  }
```

Now notice what happens:

```javascript
  dispatch({ type: '@@INIT' })
    -> { count: 0 }
  dispatch({type: 'INCREASE_COUNT'})
    -> { count: 1 }
```

Ok, pretty elegant.  How did that work?  Let's take it from the top.

```javascript
let state;

function changeState(state = { count: 0 }, action) {
    switch (action.type) {

      case 'INCREASE_COUNT':
        return { count: state.count + 1 }

      default:
        return state;
    }
  }

  function dispatch(action){
  state = changeState(state, action)
  render()
}

function render(){
  document.body.textContent = state.count
}

dispatch({type: '@@INIT'})
```

At the top of the file, we declare but do not assign our state, so it starts off
undefined.  Then at the bottom the file, we dispatch an action of `'@@INIT'`.
This calls our `dispatch()` function and passes through our initial action.
`dispatch()` calls the `changeState()` reducer.  `changeState()` is executed, passing
through two local variables: state and action.  `action` is defined because we
passed `{ type: '@@INIT' }` into dispatch. `state` is currently **undefined**, so, with 
that initial dispatch we are really calling:

```js
changeState(undefined, { type: '@@INIT' })
```

Because `changeState()` now has a default argument, the `state` argument is set to 
`{ count: 0 }`.

When `changeState()` executes, the `switch` statement executes the `default` case,
returning the value of `state`. The code `changeState(undefined, { type: '@@INIT' })` 
_returns_  `{ count: 0 }`, 

In `dispatch()`, when the `changeState()` reducer returns, dispatch assigns the
return value to `state`, thus updating our state to the initial value of
`{ count: 0 }`. On the next line, `render()` is called, displaying `0` in our HTML.

Essentially, we take advantage of our state starting off as undefined, and never
being undefined again.  This means the reducer's default argument can be used to
set up the initial state and never be used again.

## Summary

We learned that by dispatching an initial action of type `'@@INIT'` we get two
benefits: an initial rendering of the state, and the ability to set our initial
state in our reducer.  We set our initial state in our reducer by using a
default argument for the state parameter.  Because state is not initially
defined, dispatching an action assigns our state to that default value, and then
sets state as the default.

<p class='util--hide'>View <a href='https://learn.co/lessons/redux-initial-dispatch'>Redux Initial Dispatch</a> on Learn.co and start learning to code for free.</p>
