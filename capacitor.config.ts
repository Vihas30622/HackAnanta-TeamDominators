import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.campus360.app',
    appName: 'Campus360',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        GoogleAuth: {
            scopes: ['profile', 'email'],
            serverClientId: '976578538742-8d935t75n2am9opeqf9dd13dprhubanh.apps.googleusercontent.com',
            forceCodeForRefreshToken: false
        }
    }
};

export default config;
