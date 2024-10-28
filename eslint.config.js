export default [
    {
        files: ["**.ts"],
        rules: {
            "strict": "error", // Doesnt't matter because modules but still
            "no-var": "error",
            "no-implicit-globals": "error", // Doesnt't matter because strict mode
            "eqeqeq": "error",
            "no-new-wrappers": "error",
            "prefer-rest-params": "error",
        }
    }
];