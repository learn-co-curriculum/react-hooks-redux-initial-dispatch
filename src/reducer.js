let state;

function changeState(state = { count: 0 }, action) {
  switch (action.type) {
    case "counter/increment":
      return { count: state.count + 1 };

    default:
      return state;
  }
}

function dispatch(action) {
  state = changeState(state, action);
  render();
}

function render() {
  document.body.textContent = state.count;
}

dispatch({ type: "@@INIT" });
