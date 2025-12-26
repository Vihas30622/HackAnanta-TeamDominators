import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Loader2 } from 'lucide-react';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { total } = location.state || { total: 0 };
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment delay
        setTimeout(() => {
            setIsProcessing(false);
            // Generate a random token
            const token = Math.floor(1000 + Math.random() * 9000);
            navigate('/order-success', { state: { token, total } });
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col p-6">
            <header className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-card hover:bg-muted transition-colors">
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h1 className="text-xl font-bold text-foreground">Checkout</h1>
            </header>

            <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="glass-card p-6 rounded-2xl">
                        <p className="text-sm text-muted-foreground mb-1">To Pay</p>
                        <h2 className="text-4xl font-black text-primary">₹{total?.toFixed(2)}</h2>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-foreground">Payment Method</h3>

                        <button
                            onClick={() => setPaymentMethod('upi')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-foreground">UPI</p>
                                    <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary' : 'border-muted-foreground'}`}>
                                {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                        </button>

                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-foreground">Card</p>
                                    <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-muted-foreground'}`}>
                                {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                        </button>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full h-14 bg-primary text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-80 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Pay ₹{total?.toFixed(2)}
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
