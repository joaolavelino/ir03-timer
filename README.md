# Ignite Timer

Project created during the React formation @Rocketseat.

This document contains some of the initial setup process that are needed on other projects and some tips that I gather during the learning process.

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
