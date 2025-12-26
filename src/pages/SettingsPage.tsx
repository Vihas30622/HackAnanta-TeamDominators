import React from 'react';
import { ArrowLeft, Bell, BellOff, Moon, Shield, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link to="/more" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Customize your experience</p>
          </div>
        </div>
      </header>

      {/* Settings List */}
      <div className="px-4 space-y-6">
        {/* Notifications */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Notifications</h3>
          <div className="glass-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">Push Notifications</h4>
                  <p className="text-xs text-muted-foreground">Receive alerts and updates</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellOff className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">Do Not Disturb</h4>
                  <p className="text-xs text-muted-foreground">Mute all notifications</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Appearance</h3>
          <div className="glass-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">Dark Mode</h4>
                  <p className="text-xs text-muted-foreground">Always enabled</p>
                </div>
              </div>
              <Switch defaultChecked disabled />
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Privacy & Security</h3>
          <div className="glass-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">Location Access</h4>
                  <p className="text-xs text-muted-foreground">For SOS and transport features</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">About</h3>
          <div className="glass-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">App Version</h4>
                  <p className="text-xs text-muted-foreground">1.0.0 (Build 1)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
