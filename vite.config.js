export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server: {
        host: '0.0.0.0', // This allows external access
        port: 5173, // Default Vite port
    },
    build: {
        outDir: '../dist',
        assetsDir: 'assets',
        // Optimize for mobile
        rollupOptions: {
            output: {
                manualChunks: {
                    'three': ['three'],
                    'vendor': ['dat.gui']
                }
            }
        }
    }
}