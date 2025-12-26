import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Home, Clock } from 'lucide-react';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = location.state || { token: '0000' };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Success Animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-success rounded-full flex items-center justify-center mb-6 shadow-xl shadow-success/30"
            >
                <Check className="w-12 h-12 text-white" />
            </motion.div>

            <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
                <h2 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h2>
                <p className="text-muted-foreground mb-8">Show this token at the counter.</p>

                <div className="bg-muted/50 rounded-2xl p-6 mb-8 border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Your Token</p>
                    <h1 className="text-5xl font-black text-primary tracking-wider font-mono">{token}</h1>
                </div>

                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8 bg-muted/30 py-2 px-4 rounded-full w-fit mx-auto">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Estimated Time: 10 mins</span>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
