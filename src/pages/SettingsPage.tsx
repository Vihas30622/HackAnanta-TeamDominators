import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, BellOff, Moon, Shield, LogOut, Plus, Trash2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { showLocalNotification } from '@/lib/notifications';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Fetch Emergency Contacts
  useEffect(() => {
    if (!user || !db) return;
    const q = query(collection(db, `users/${user.id}/emergency_contacts`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EmergencyContact[];
      setContacts(items);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddContact = async () => {
    if (!newContactName || !newContactPhone) {
      toast.error("Please enter name and phone number");
      return;
    }
    if (!db || !user) return;

    try {
      await addDoc(collection(db, `users/${user.id}/emergency_contacts`), {
        name: newContactName,
        phone: newContactPhone,
        createdAt: new Date().toISOString()
      });
      toast.success("Emergency contact added");
      setNewContactName('');
      setNewContactPhone('');
      setIsAddingContact(false);
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Failed to add contact");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!db || !user) return;
    try {
      await deleteDoc(doc(db, `users/${user.id}/emergency_contacts`, id));
      toast.success("Contact removed");
    } catch (error) {
      toast.error("Failed to remove contact");
    }
  };

  const handleTestNotification = () => {
    showLocalNotification({
      title: 'Test Notification',
      body: 'This is how your alerts will appear!',
      type: 'general'
    });
    toast.success("Sent test popup!");
  };

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

        {/* Appearance */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Appearance</h3>
          <div className="glass-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground">Dark Mode</h4>
                  <p className="text-xs text-muted-foreground">Adjust display theme</p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>
        </section>

        {/* Support & Grievances */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Support</h3>
          <div className="glass-card divide-y divide-border">
            <Link to="/grievance" className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Grievance Redressal</h4>
                  <p className="text-xs text-muted-foreground">Report bullying or issues</p>
                </div>
              </div>
              <Plus className="w-4 h-4 text-muted-foreground rotate-45" />
            </Link>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Emergency Contacts</h3>
            <button
              onClick={() => setIsAddingContact(!isAddingContact)}
              className="text-xs font-bold text-primary flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add New
            </button>
          </div>

          <div className="space-y-3">
            {isAddingContact && (
              <div className="glass-card p-4 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <input
                    placeholder="Contact Name (e.g., Mom)"
                    value={newContactName}
                    onChange={e => setNewContactName(e.target.value)}
                    className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm outline-none border focus:border-primary"
                  />
                  <input
                    placeholder="Phone Number (+91...)"
                    type="tel"
                    value={newContactPhone}
                    onChange={e => setNewContactPhone(e.target.value)}
                    className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm outline-none border focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddContact} className="flex-1">Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsAddingContact(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            {contacts.map(contact => (
              <div key={contact.id} className="glass-card p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{contact.name}</h4>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {contacts.length === 0 && !isAddingContact && (
              <div className="text-center py-6 glass-card border-dashed">
                <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No emergency contacts added.</p>
                <p className="text-xs text-muted-foreground/60">Add contacts to alert them via SOS.</p>
              </div>
            )}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Notifications</h3>
            <button onClick={handleTestNotification} className="text-xs text-primary font-bold">
              Test Popup
            </button>
          </div>
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

        {/* Account Actions */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Account</h3>
          <div className="space-y-3">
            <Button
              variant="destructive"
              className="w-full justify-start gap-2 h-12 text-base font-medium bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
              onClick={() => logout()}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </section>

        {/* About */}
        <section className="pt-4 text-center">
          <p className="text-xs text-muted-foreground">Campus360 v1.0.1</p>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
