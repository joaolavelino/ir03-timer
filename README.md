## Styled Components Init

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
