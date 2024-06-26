// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "vue/first-attribute-linebreak": "off",
        "vue/max-attributes-per-line": "off",
        "vue/html-closing-bracket-newline": "off",
        "@stylistic/indent": "off",
        "vue/html-indent": "off",
        "@stylistic/member-delimiter-style": "off",
        "@stylistic/quotes": "off",
        "@stylistic/semi": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@stylistic/keyword-spacing": "off",
        "prefer-const": "off",
        "vue/html-quotes": "off",
        "vue/block-tag-newline": "off"
    }
});
