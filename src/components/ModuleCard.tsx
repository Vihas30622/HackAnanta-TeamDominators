import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  gradient?: 'primary' | 'accent' | 'destructive' | 'success';
  badge?: string;
}

const gradientClasses = {
  primary: 'from-primary to-secondary',
  accent: 'from-secondary to-highlight',
  destructive: 'from-destructive to-destructive/70',
  success: 'from-success to-success/70',
};

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon: Icon,
  to,
  gradient = 'primary',
  badge,
}) => {
  return (
    <Link to={to}>
      <motion.div
        className="module-card relative overflow-hidden"
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradientClasses[gradient]}`} />
        
        <div className="flex items-start gap-3 pl-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradientClasses[gradient]}`}>
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{title}</h3>
              {badge && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-secondary/20 text-secondary rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{description}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ModuleCard;
