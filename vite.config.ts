import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [react(), svgr()],
    base: '/react-app/',  // <-- Add this line
    assetsInclude: ["**/*.svg", "**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.otf"],
    resolve: {
        alias: {
            '@': '/resources/js/src', // Adjust the path as per your project structure
        },
    },
    server: {
        host: "127.0.0.1",
        port: 3000,
    },
    build: {
        outDir: './public/build',  // Ensure the output directory matches Laravel's expectation
        manifest: true,          // Generates manifest.json in the correct location
        emptyOutDir: true,       // Clears the output directory before each build
    },
});
