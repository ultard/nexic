import { defineConfig } from 'vite'

export default defineConfig({
    base: '/nexic/',
    root: './src',
    build: {
        rollupOptions: {
            input: {
                main: './src/index.html',
                about: './src/about.html',
                contacts: './src/contacts.html',
            }
        }
    }
})