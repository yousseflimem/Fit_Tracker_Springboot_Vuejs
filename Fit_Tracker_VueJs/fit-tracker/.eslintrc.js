module.exports = {
    plugins: ['vue'],  // Enable the Vue plugin
    parserOptions: {
        parser: 'babel-eslint',  // Use Babel parser for modern JS (install if needed)
        ecmaVersion: 6,          // Support ES6 syntax
        sourceType: 'module',    // Allow import/export
    },
    extends: [
        'plugin:vue/essential',  // Basic Vue linting rules
    ],
    rules: {
        'vue/multi-word-component-names': 'off',  // Allow multi-word component names
        'vue/no-unused-vars': 'warn',  // Warn on unused variables in Vue components
        'vue/no-multiple-template-root': 'off',  // Allow multiple root nodes in Vue 2.x
        'vue/require-v-for-key': 'warn',  // Warn if v-for lacks a key attribute
        'vue/valid-v-slot': 'error',  // Error if v-slot is invalid
        'vue/no-v-html': 'off',  // Disable warning for v-html (use with caution)
    }
};