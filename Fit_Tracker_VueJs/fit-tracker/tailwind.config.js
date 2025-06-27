module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                primary: '#1E40AF',
                secondary: '#3B82F6',
                accent: '#10B981',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};