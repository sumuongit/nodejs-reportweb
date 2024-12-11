import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    files: ["**/*.{mjs,cjs,ts,vue}"],
    ignores: [
      "**/.vitepress/cache/deps/*.js",    // Ignore .js files in .vitepress/cache/deps
      "**/server/.vitepress/cache/deps/*.js" // Ignore .js files in server/.vitepress/cache/deps
    ]    
  },
  {
    languageOptions: { 
      globals: {...globals.browser, ...globals.node} 
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"], 
    languageOptions: {
      parserOptions: {}
    }
  },
];