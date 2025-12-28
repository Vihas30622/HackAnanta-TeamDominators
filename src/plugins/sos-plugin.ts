import { registerPlugin } from '@capacitor/core';

export interface SOSPluginRef {
    triggerSOS(options: { phone: string; contacts: string[]; message: string }): Promise<void>;
    askForPermissions(): Promise<void>;
}

const SOSPlugin = registerPlugin<SOSPluginRef>('SOSPlugin');

export default SOSPlugin;
