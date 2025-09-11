import { defineConfig } from 'vite'

export default defineConfig({
    root: './src',
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                main: './src/index.html',
                about: './src/about.html',
                contacts: './src/contacts.html',
                projects: './src/projects.html',
            }
        }
    }
})