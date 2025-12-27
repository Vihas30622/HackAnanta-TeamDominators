import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.campus360.app',
    appName: 'Campus360',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;
