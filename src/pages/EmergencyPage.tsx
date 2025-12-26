import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Phone, MapPin, AlertTriangle, Users, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmergencyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Emergency & Safety</h1>
            <p className="text-sm text-muted-foreground">Quick help when you need it</p>
          </div>
        </div>
      </header>

      {/* SOS Info */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-5 bg-destructive/10 border-destructive/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-destructive">
              <Shield className="w-6 h-6 text-destructive-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">SOS Emergency</h2>
              <p className="text-sm text-muted-foreground">Hold the button for 3 seconds</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            When activated, the SOS button will:
          </p>
          
          <ul className="space-y-2">
            {[
              { icon: Phone, text: 'Call emergency services automatically' },
              { icon: MapPin, text: 'Share your live GPS location' },
              { icon: Users, text: 'Alert your emergency contacts' },
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-sm text-foreground">
                <div className="p-1.5 rounded-lg bg-destructive/20">
                  <item.icon className="w-4 h-4 text-destructive" />
                </div>
                {item.text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Emergency Contacts */}
      <div className="px-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Contacts</h3>
        <div className="space-y-3">
          {[
            { name: 'Campus Security', number: '1800-XXX-XXXX', available: '24/7' },
            { name: 'Police', number: '100', available: '24/7' },
            { name: 'Medical Emergency', number: '102', available: '24/7' },
            { name: 'Fire Department', number: '101', available: '24/7' },
            { name: 'Women Helpline', number: '1091', available: '24/7' },
          ].map((contact, index) => (
            <motion.a
              key={contact.name}
              href={`tel:${contact.number}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="module-card flex items-center gap-3"
            >
              <div className="p-2.5 rounded-xl bg-secondary">
                <Phone className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{contact.name}</h4>
                <p className="text-sm text-secondary font-mono">{contact.number}</p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {contact.available}
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="px-4 mt-6">
        <div className="glass-card p-4 bg-primary/10">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Safety Tips</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Keep your phone charged at all times</li>
                <li>• Share your location with trusted contacts</li>
                <li>• Be aware of your surroundings</li>
                <li>• Save emergency numbers in your phone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
