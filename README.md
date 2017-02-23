Dispatch an initial action for setup
==============

In this lesson, you will learn the following:

* How dispatching an initial action gives an initial render of the view.
* How dispatching an initial action gives an initial setup of the store's state.

## Dispatch an initial action to initially render the view

Currently we have built our `changeState` reducer, and the `dispatch` and `render` functions.  Remember that we built the `dispatch` function such that each time we execute it, we call the `render` function.  

```javascript
let state = {count: 0};

function changeState(state, action){
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
	document.setInnerHTML = state.counter
}
```


Notice that by calling `dispatch` with an action as an argument, we do render something on the page.  However, currently, we dispatch an action of `"INCREASE"` and we see the number one in our HTML, but we never see the number zero displayed.  One easy way to fix this is to simply call the `render` function at the bottom of our JavaScript. We'll choose a different approach, though, which is to call our `dispatch` function.  


Remember that our `dispatch` function also calls our `render` function.  So, if we dispatch a meaningless action, our reducer will simply return the existing state, and then our `render` function will be called.  Let's try it by dispatching an action of type `@@INIT`.

```javascript
dispatch({ type: '@@INIT' })
```



Cool, now our HTML starts off at zero.  And each time we call dispatch, the HTML is appropriately updated.  


Note that we can dispatch an action of any type, so long as it doesn't hit our switch statement.  We dispatch an action of type `@@INIT` by convention.

## Dispatch an initial action to set up our initial state


Now that we've seen a simple fix for setting up the view, let's see if there's a simple fix for setting up our state.  Notice that currently we set the initial value of the state at the very first line of our JavaScript with the following:


	let state = { count: 0 };

The problem with this is that we like to look to our reducer to see how to manage the state.  After all, our reducer returns the new state every time we dispatch a new action.  Perhaps our reducer can also return our initial state.  

Let's begin by simply declaring our state, but not assigning it to equal anything.  So we accordingly change the first line of our JavaScript.
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
	document.setInnerHTML = state.count
}

dispatch({ type: '@@INIT' })
```

We find that dispatching the action of type `@@INIT` gives us an error.

`Uncaught TypeError: Cannot read property 'count' of undefined(…)`


See that?  Our `render` function is breaking because now state starts off as undefined.  When we dispatch our action, it calls the reducer, which passes through our state whose value is undefined, and then returns the default value of our switch statement, which is just our undefined state.  


What would be really nice is if we could say when you pass a state of `undefined` to our reducer, assign that value to our initial state. Luckily, ES6 allows us to pass default arguments to functions. We can give our `changeState` reducer a default argument to do just that.  Let's change our reducer to the following:

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
		-> { counter: 0 }
	dispatch({type: 'INCREASE'})
		-> { counter: 1 }
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
	document.setInnerHTML = state.count
}

dispatch({type: '@@INIT'})
```

At the top of the file, we declare but do not assign our state, so it starts off as undefined.  Then at the bottom the file, we dispatch an action of `'@@INIT'`.  This calls our `dispatch` function, and passes it through our initial action.  Dispatch calls the `changeState` reducer.  `changeState` is executed, passing through two local variables: state and action.  Action is defined because we passed `{ type: '@@INIT' }` into dispatch.  And the second argument, `state`, comes from the first line of our file.  However, it's not defined.

So, with that initial dispatch we are really calling

	changeState(undefined, { type: 'INIT' })


And when we look to our `changeState` reducer, its default argument means that when state is undefined, it sets the state argument to `{ count: 0 }`.  Then we hit the last line of our reducer's switch statement, and return this state.  Finally, when the change state reducer returns, dispatch assigns the return value to equal state, thus updating our state to the initial value of `{ count: 0 }`, and the next line in dispatch renders this state in our HTML.

Essentially, we take advantage of our state starting off as undefined, and never being undefined again.  This means the reducer's default argument can be used to set up the initial state and never be used again.


## Summary

We learned that by dispatching an initial action of type `'@@INIT'` we get two benefits: an initial rendering of the state, and the ability to set our initial state in our reducer.  We set our initial state in our reducer by using a default argument for the state parameter.  Because state is not initially defined, dispatching an action assigns our state to that default value, and then sets state as the default.

<p class='util--hide'>View <a href='https://learn.co/lessons/redux-initial-dispatch'>Redux Initial Dispatch</a> on Learn.co and start learning to code for free.</p>
