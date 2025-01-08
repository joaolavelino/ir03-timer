# Ignite Timer

Project created during the React formation @Rocketseat.

This document contains some of the initial setup process that are needed on other projects and some tips that I gather during the learning process.

## React's Use Reducer

### useReducer Hook

Hook that sets the state and the dispatcher. Unlike useState, useReducer can handle with more complex state information. The reducer function (`CyclesReducer`, in this case) can change different parts of the state information with the dispatch function depending on the action you send to it. (The dispatch function of the state, the `setState` is always set to replace all the data of the state).

TLDR: useReducer is a way to deal with more complex data on a state and let you customize how the dispatch will handle it with Actions.

The structure is similar to useState. You set the name of the state and the dispatch function, call the useReducer() hook and as an argument, instead of passing only the initial information, as we'd do with the useState() hook, we pass the reducer function and the initial value of the state. In this case:

```tsx
const [cyclesState, dispatch] = useReducer(CyclesReducer, {
  cycles: [],
  activeCycleId: null,
});
```

### Reducer Function

The reducer function is a function that will handle the information contained in the state and return the updated state. It has normally a switch statement with a case for each possible Action it can perform. This function expects two arguments, the initial state and the action it will perform. At the application this reducer function will be called by the dispatcher of the useReducer hook.

Here's an example of reducer function: You can add as many cases as necessary. Just create a new action for it.

```tsx
cexport function CyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      };
    default:
      return state;
  }
}
```

### Action Types.

These are the names of each action. It can be a string or can be a reference to a enum of actions. It's better to use TS' enums to list all the action types, so can the VSCode's Intellisense suggest the action types as we use the dispatches. The code editor will also spot if an incorrect action type is called in the dispatcher:

```ts
export enum ActionTypes {
  ADD_NEW_CYCLE = "ADD_NEW_CYCLE",
  INTERRUPT_CYCLE = "INTERRUPT_CYCLE",
  MARK_CURRENT_CYCLE_AS_COMPLETE = "MARK_CURRENT_CYCLE_AS_COMPLETE",
}
```

### Dispatcher Function

The dispatcher function is the function that will trigger the reducer function. (kind of the same way it triggers the state update on the useState hook). It's argument must recieve an object with the action type, as shown below.

```tsx
dispatch({
  type: ActionTypes.MARK_CURRENT_CYCLE_AS_COMPLETE,
});
```

### Isolate actions

As the project grows, it's easy to forget the payloads for each action on the dispatch functions. So it's interesting to create functions that return exactly what each dispach action needs and give types to the parameters of the function, so the intellisense will be aware of the params.

So on this step, I created a folder for each subject and inside there is the `reducer.ts` file with the reducer function and the `actions.ts` with the action types enum and the action functions that will feed the dispatch functions (which are located on the cycles context file).

Example of an action function.

```tsx
export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.ADD_NEW_CYCLE,
    payload: { newCycle },
  };
}
```

And here is the dispatch function of the useReducer hook:

```tsx
dispatch(addNewCycleAction(newCycle));
```

Instead of the object with type and payload, only the action function and the function param will feed the payload of the action.

### Initializer Function

The `useReducer` hook has a third parameter (just to remember: 1st param is the reducer function, the second is the initial state). This third parameter is the _initializer function_. This is the first action to be performed by the reducer. Normally used to fetch data from somewhere. (in this case, from the Local Storage).

It's possible to pass `initialState` as an argument on the initializer funciton, so we can return this initial value, if there is no data found.

Example:

```tsx
const [cyclesState, dispatch] = useReducer(
  CyclesReducer,
  {
    cycles: [],
    activeCycleId: null,
  },
  //initializer - initial state is what was declared on the second param of the useReducer
  (initialState) => {
    const storedStateAsJson = localStorage.getItem(
      "@ignite-timer:cycles-state-1.0.0"
    );
    return storedStateAsJson ? JSON.parse(storedStateAsJson) : initialState;
  }
);
```

## Immer

Immer is a lib that will handle with immutability of data. Normally used alongside with useReducer.

### Produce function

To do so, we use the `produce` function of the library. This function creates a draft that will accept mutable interactions on it, like `ARRAY.push()` or `variable=NEW_VARIABLE_VALUE` and the produce function will create a immutable interaction to the state.

#### Use case #1

The first use will be on the first case of the reducer function:

Original version:

```tsx
case ActionTypes.ADD_NEW_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      };
```

With the produce function:

```tsx
case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, draft=>{
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId=action.payload.newCycle.id
      })
```

Note that we could deal with the array without destructuring it on a new array. The new cycle was simply pushed into the cycles array.

#### Use case #2

In cases that we need to find an instance on an array on the state, we can find the index of this instance and then on the draft of the produce function, we can simply change the value of it on the original array.

Original version:

```tsx
return {
  ...state,
  activeCycleId: null,
  cycles: state.cycles.map((cycle) => {
    if (cycle.id === state.activeCycleId) {
      return { ...cycle, interruptedDate: new Date() };
    } else {
      return cycle;
    }
  }),
};
```

With the produce function:

```tsx
const currentCycleIndex = state.cycles.findIndex(cycle=>{return cycle.id===state.activeCycleId})
if (currentCycleIndex>0){
  return state
}
return produce(state, draft=>{
  draft.activeCycleId=null
  draft.cycles[currentCycleIndex].interruptedDate= new Date()
})}
```

With the produce function it's not needed to map the entire array and then find the correct instance and then edit it.
We can simply find the index and edit.

## React's Context API

### 1 - CreateContext() and UseContext()

Create context will store an object with information that will be available to many components inside a context variable.

```tsx
export const CyclesContext = createContext({
  activeCycleId: "abc",
});
```

_Note that the context is Capitalized because it will be soon a component_

Use context is used to import a context inside a component

```tsx
const { activeCycleId } = useContext(CyclesContext);
```

This information is immutable into the context and cannot be changed from outside with, for instance, a simple `activeCycleId='xyz'`.
If this information needs to be changed, it has to be stored in a state on the parent component and the state (as well as it's dispatch function) will be stored in a context.

In order to keep everything in order, one can use TS interfaces to create an specific typing to the context:

```tsx
interface CyclesContextData {
  activeCycleId: string | null;
}

export const CyclesContext = createContext({
  activeCycleId: "abc",
} as CyclesContextData);
```

### Context Provider

Inside the created context there is a 'sub-component'that is native from React's Context API: the provider. Like the `ThemeProvider` it encapsules the components that will need this information:

```jsx
const [activeCycleId,setActiveCycleId]=useState(0)

<CyclesContext.Provider value={{activeCycleId,setActiveCycleId}}>
   children components
</CyclesContext.Provider>
```

### Context Isolation

It's possible to relocate the data and the functions of the context on it's own component. It will not return anything visible, onlu the context provider with the children prop inside.

```jsx
const [activeCycleId,setActiveCycleId]=useState(0)

<CyclesContext.Provider value={{activeCycleId,setActiveCycleId}}>
   {children}
</CyclesContext.Provider>
```

In this case, all the cycles states information will be stored inside of this context component.
To do so, it's important to have the types and interfaces declarations well organized, so we don't have an _entanglement_ of imports between interface components and context components. All of those can read the type declarations from the same source, independent of a component.

## React Rook Form

Lib documentation: https://react-hook-form.com/get-started

### 1 - Start the useForm hook

Destruct the returning object of the hook `useForm` to get our methods and variables from the library. This hook creates a 'new form' that can interact with the DOM and provides the tools for this integration.

### 2 - Integrate the form inputs with the form

Use the `register()` from RHF as a function brought by the rest operator on the props.

```tsx
{...register('task')}
```

It's possible to send other settings for the input as an object. TS` intellisense will suggest the possible settings. One of those is the format setters.

```tsx
{...register('task'),  { valueAsNumber: true } }
```

This function sets a new input inside the form created by RHF. It gets the name on the forma as a prop. It's used as a spread operator, because it returns a series of parameters for the input. If they need a value, it will be the name of the input, passed as a parameter.

### 3 - Submit function

Inside the tag `form`, on the `onSubmit` parameter, pass the `handleSubmit` function imported with the `useForm()` hook. As a argument of this function, pass the actual submit function you created.

```tsx
<form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
```

On the submit function, you can pass the data recieved from the form to be handled by the function. The data will be an object and the keys will be the names given on the `register` function on the inputs.

```tsx
function handleCreateNewCycle(data) {
    ...
  }
```

### 4 - Data Types:

Create an interface for the form data with the information format that the form will gather:

```ts
interface newCycleFormData {
  task: string;
  taskMinutesAmount: number;
}
```

It's possible to create this interface automatically from the validation scheme . To do so, create a new `Type` (in this case, use type instead of interface, because it's created from data from other sources) using `zod.infer` and send the schema as a generic (remember to use typeof), This allow more conformity of the form information. As a new key is added on the scheme, the form will automatically expect this information.

```ts
const newCycleFormSchema = zod.object({
  task: zod.string().min(1, "Informe o nome da tarefa"),
  taskMinutesAmount: zod
    .number()
    .min(5, "O ciclo deve ter no mínumo 5 minutos")
    .max(60, "O ciclo deve ter no máximo 60 minutos"),
});

type newCycleFormData = zod.infer<typeof newCycleFormSchema>;
```

Assign this format on the `useForm` hook _as a generic_ just after the hook name.:

```tsx
const { register, handleSubmit, watch } = useForm<newCycleFormData>();
```

Assign this format to the `data` argument on the submit function:

```tsx
function handleCreateNewCycle(data: newCycleFormData) {
  console.log(data);
}
```

### 5 - Set the initial values for the form

NOTE: This is particularly usefull on update forms

It's possible to send different settings as an object on the useForm hook call argument. One of those is the default values. The value of this setting is an object with the initial values of each input. The hook call will be like this:

```tsx
const { register, handleSubmit, watch } = useForm<newCycleFormData>({
  defaultValues: { task: "", taskMinutesAmount: 0 },
});
```

### 6 - Reset a form:

It's possible to get a reset form function from the useForm hook call.

```tsx
const { register, handleSubmit, watch, reset } = useForm<newCycleFormData>({
  defaultValues: { task: "", taskMinutesAmount: 0 },
});

function handleCreateNewCycle(data: newCycleFormData) {
  console.log(data);
  reset();
}
```

This function will restore the default values of the form (set as an argument on the useForm hook call). It's possible to call this function anywhere. So creating a reset button for the form is very simple.

### 7 - Form Provider

If you need to pass the functions from RHF into different components, RHF provides (pun intended) a context provider. To use this FormProvider, it's needed to store the useForm() into a variable.

```tsx
const newCycleForm = useForm<newCycleFormData>({...});

const { handleSubmit, watch, reset } = newCycleForm;
<FormProvider {...newCycleForm}>
  <NewCycleForm />
</FormProvider>;
```

Then, inside the child component, just call the context provided (pun intended, again) by RHF'

```tsx
const { register } = useFormContext();
```

## Zod - Form Validation

### 1 - Install Zod and the Hook Form Resolver

`npm i zod`
Zod documentation: https://zod.dev/

`npm i @hookform/resolvers` - This will allow integration between RHF and validation libraries.

### 2 - Import items on the form component

On the form component, import the zod resolver. `import {zodResolver} from "@hookform/resolvers/zod"`

### 3 - useForm hook setup

Pass an object with the resolver as a argument of `useForm` hook. The value is the `zodResolver` function imported from @hookform/resolvers. The argument of this function is the validation schema.

```tsx
const { register, handleSubmit, watch } = useForm<newCycleFormData>({
  defaultValues: { task: "", taskMinutesAmount: 0 },
  resolver: zodResolver(newCycleFormSchema),
});
```

### 4 - Create a schema

NOTE: This can be done on a separate validation file on the component folder

Import zod on the form - `import \* as zod from 'zod'`

Create a validation schema using what we imported from `zod`. This schema will validate the data sent by the submit function (on the data argument).

```tsx
const newCycleFormSchema = zod.object({
  task: zod.string().min(1, "Informe o nome da tarefa"),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo deve ter no mínumo 5 minutos")
    .max(60, "O ciclo deve ter no máximo 60 minutos"),
});
```

### 5 - Display the errors

To do so, get `formState` from the `useForm` hook. This will display the validation errors from the form. The useForm hook call will be something like:

```tsx
const { register, handleSubmit, watch, formState } = useForm({
  resolver: zodResolver(newCycleFormSchema),
});
```

It's possible to use the error messages (even send it to other components such as the input or toasts) using the formState variable:

```ts
console.log(formState.errors[--keyName--]);
```

## Absolute Imports on Vite

To use Absolute Imports on a Vite React project, you need to make some changes to the vite.config.js file, which is found at the root of your project directory.

Add the code below to the `vite.config.js` file

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
```

Then Create a `jsconfig.json` file on the root directory of the progress and add the following to set the VSCode intelliSense to recognize the absolute paths:
(On the vite project, you can add to the existing `tsconfig.json` file)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "src/*": ["./src/*"]
    }
  }
}
```

- Complete article: https://dev.to/andrewezeani/how-to-create-absolute-imports-in-vite-react-app-a-step-by-step-guide-28co#setting-up-the-vite-react-project-for-absolute-imports

## React Router Initial Setup

### Install React Router Dom

Documentation:
https://reactrouter.com/en/6.28.0/start/tutorial

Install the main Styled Components package

```
  npm i react-router-dom
```

### Create a `Router.tsx` file on the /src folder

This is a component that will manage the routes of the application

### Wrap the application in a BrowserRouter

On the `App.ts` file, wrap the entire aplication with the BrowserRouter component, imported from React Router Dom.

This component can be outside or inside the ThemeProvider component. I'm putting it inside the ThemeProvider, without including the GlobalStyle component.

### Manage Routes and Layouts

Inside the Router Component is possible to manage different routes (public and private) and their respective layouts by stacking different <Route/> components.

It's important not to forget the <Outlet/> component inside the layout components, as it will act like the `children` of react components. It will load the element that is inside a nested route.

## Styled Components Initial Setup

### Install Styled Components

Install the main Styled Components package

```
  npm i styled-components
```

### Create Themes

- On a src>themes folder, create themes with the color variables
- Create a @types folder with the type definition file styles.d.ts
- On this file create a type based on the default theme
- declarar o modulo para o style-components para sobrescrever o DefaulTheme padrão do Styled Components (dentro da pasta node modules). By doing so, the types from the themes will be totally integrated on the default theme type and the components will recognize this typing.

### Create a Theme Provider

On the App component, insert the theme provider around the component tree with a theme prop. The themes can me managed by a state of the App component.

### Using Themes on the styled components

Themes, like props are used like functions on the components. Check the components on this app to see how the correct syntax.

### Set Global Theme

- Create a Global.ts file on the src>styles folder
- import createGlobalStyle
- export a GlobalStyle variable - construction is similar as a styled component with template literals.
- Import and insert the GlobalStyle inside the theme provider component (so it can use the theme variables)

### ESLint Config

Define code standards that will be automatically converted by saving

- I used the standard vite eslit configs, but added a rule for the styled components:
- On the eslint.config.js, insert the following inside the rules object:

```js
{
 "extends": ["next/core-web-vitals", "next/typescript"],
 "rules": { "@typescript-eslint/no-empty-object-type": "off" }
}
```

## Vite Notes

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
