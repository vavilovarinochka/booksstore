// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    parserOptions: {
        ecmaVersion: "latest",
    },
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": "warn",
        // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
};
