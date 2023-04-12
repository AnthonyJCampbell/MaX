# Redux Refinement

This article provides some info on some of the recent changes in the way the application handles Redux and the associated store. This was prompted by some issues we had with implementing Typescript in Redux as part of DUIR-2011. As a result, we found a couple of areas that were incorrectly/suboptimally implemented. This doc aims to explain what the issues were and how they were adjusted.

rmation on how our builds process works. The builds process should rarely need to be changed, so this is mostly for understanding what happens currently rather than how to extend it.

## Summary

There are 3 key parts to the build process, in this order:

- What we previously called `action-creators` should more accurately be called `action-types`
- What we used to call `actions` are more accurately called `action-creators`, whereas `actions` refer to the object sent out be said `action-creator`
- An `Action` itself is defined as simply the object sent out by an `action-creator`, containing `type` and `payload`
- `action-creators.ts` has been renamed to `action-types.ts`, `store/actions` has been renamed to `store/action-creators`
- We were using thunks incorrectly on synchronous operations, whereas thunks should only be used for asynchronous operations.

## Details

### Problem #1

We'd mixed up our naming conventions in Redux, leading to confusion about what paradigms to use. To be clear:

- `Actions` are JS objects containing two keys: a `payload and a type`. Simply put, this is what's actually being sent from somewhere in the application to Redux. They're NOT the functions themselves.
- `Action-Creators` are the functions which execute some arbitrary logic and then generate an `action`, which then gets sent on to the Redux store.
- What we previously called `Action-Creators` should more correctly be called `Action-Types`. After all, it refers to the `type`-key inside of an `action` object. You'll also note that we've renamed `action-creators.ts` to the more correct `action-types.ts`.

### Problem #2

We were using thunks where we shouldn't have. Simply put, thunks are a way to execute asynchronous logic inside of a Redux Action Creator, which is normally not allowed. (Normally, an `Action Creator` needs to return a plain object - an `Action`) However, for synchronous operations (such as pretty much all the logic found in `navigation/actions.ts`), this is superfluous and makes the operations be executed asynchronously whereas they should've been executed synchronously. This wasn't causing huge issues in the app, but did cause the TS compiler to throw a fair number of errors.

## Rules of Thumb Going Forward

- When creating an `Action Creator` that just deals with the UI and doesn't need to send anything over WISPA, just create a normal function that returns a plain object (with `payload` and `type`).
- When creating an `Action Creator` that sends out signals to WISPA (in actions/ipc-outgoing), you will need to nest two functions inside the `Action Creators`.
- When creating an `Action Creator` that sends out an `Action` as a response to a WISPA message, you can just create a normal function - as per usual.
- Nothing changes in the way we call actions inside of a React component (by using `const dispatch = useDispatch()`, followed by `dispatch(BestActionCreatorEver()`).

Note: As you can see, I've liberally strewn around the Action, Action Creator, and Action Type labels. This was done to hopefully make it a bit clearer which is which and what does what. My apologies for any confusion this change might cause going forward.
