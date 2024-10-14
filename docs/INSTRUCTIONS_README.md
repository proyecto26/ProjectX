# Instructions

## FrontEnd

### Commands used to create this project structure

- Create web project:
```sh
npx create-nx-workspace@latest projectx --preset=apps
cd projectx
npx nx add @nx/remix
npx nx g @nx/remix:app apps/web
```

More details [here](https://nx.dev/recipes/react/remix).

- Install Tailwind CSS:
```sh
npm add -D tailwindcss postcss autoprefixer postcss-import
npx nx g setup-tailwind --project=web
```

- Create a UI lib to be able to publish to a npm registry
```sh
npx nx g @nx/react:lib libs/ui --publishable --importPath=@projectx/ui
npx nx add @nx/storybook
npx nx g storybook-configuration --project=ui
```

- Create some UI components with Storybook stories
```sh
npx nx g @nx/react:component button --project=ui --path=libs/ui/src/lib/button/Button --verbose
npx nx g @nx/react:component header --project=ui --path=libs/ui/src/lib/header/Header --verbose
npx nx g @nx/react:component footer --project=ui --path=libs/ui/src/lib/footer/Footer --verbose
npx nx g @nx/react:stories --project=ui
```

- Create the styles/theme with TailwindCSS
```sh
npx nx g setup-tailwind --project=ui
npm add -D @tailwindcss/aspect-ratio @tailwindcss/forms @tailwindcss/line-clamp @tailwindcss/typography
```

- Update the `libs/ui/project.json` to export the `tailwind.config` file as a preset:
```sh
"build": {
    "executor": "nx:run-commands",
    "outputs": ["{options.outputPath}"],
    "options": {
    "commands": [
        {
        "command": "nx run ui:build:lib"
        },
        {
        "command": "npx tsc -p libs/ui/tsconfig.tailwind.json"
        }
    ],
    "parallel": false
    }
},
"build:lib": {
...
```
