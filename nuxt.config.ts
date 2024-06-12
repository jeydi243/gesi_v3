// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    extends: [process.env.NUXT_UI_PRO_PATH || "@nuxt/ui-pro"],
    runtimeConfig: {
        // The private keys which are only available within server-side
        base_url: "http://127.0.0.1:4000",
        // Keys within public, will be also exposed to the client-side
        public: {
            apiBase: "http://127.0.0.1:4000"
        }
    },
    modules: [
        "@nuxt/eslint",
        "@nuxt/ui",
        "@nuxt/fonts",
        "@vueuse/nuxt",
        "nuxt-security"
    ],
    ui: {
        icons: ["heroicons", "simple-icons"],
        safelistColors: ["primary", "red", "orange", "green"]
    },
    colorMode: {
        disableTransition: true
    },
    devtools: {
        enabled: true
    },
    typescript: {
        strict: false
    },
    eslint: {
        config: {
            stylistic: {
                commaDangle: "never",
                braceStyle: "1tbs",
                indent: 4

            }
        }
    },
    security: {
        headers: {
            crossOriginResourcePolicy: "cross-origin",
            crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
            contentSecurityPolicy: {
                'connect-src': ["'self'", 'https:', 'http:'],
                'img-src': ["'self'", "data:", "https:"],
                'frame-src': ["'self'"]
            }
        }
    }
});
