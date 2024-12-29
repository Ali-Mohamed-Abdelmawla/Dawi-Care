import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  build: {
    outDir: 'dist',  // Changed to 'dist' for Netlify
    manifest: true,
    emptyOutDir: true,
  },
})


// to build for deployment on xampp
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/react-app/',  // <-- Add this line
//   server: {
//     host: "127.0.0.1",
//     port: 3000,
//   },
//   build: { 
//     outDir: './public/build',  // Ensure the output directory matches Laravel's expectation
//     manifest: true,          // Generates manifest.json in the correct location
//     emptyOutDir: true,       // Clears the output directory before each build
//   },
// })