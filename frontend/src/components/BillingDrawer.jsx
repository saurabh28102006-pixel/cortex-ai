import { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Crown, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { createOrder } from '../features/createOrder'
import { verifyPayment } from '../features/verifyPayment'
import getCurrentUser from '../features/getCurrentUser'
import { setUserdata } from '../redux/userSlice'

function BillingDrawer({ open, onClose }) {
    const { userData } = useSelector(state => state.user)
    const [isProcessing, setIsProcessing] = useState(false)
    const dispatch = useDispatch()

    const handleUpgrade = async (plan) => {
        try {
            setIsProcessing(true)
            const data = await createOrder(plan)
            if (!data || !data.order) {
                alert("Failed to initiate payment. Please try again.")
                setIsProcessing(false)
                return
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data?.order?.amount,
                currency: data?.order?.currency || "INR",
                name: "CortexAI",
                description: `${data?.plan?.name || plan} Plan Subscription`,
                order_id: data?.order?.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await verifyPayment(response)
                        if (verifyRes && verifyRes.message === "Payment Verified") {
                            const updatedUser = await getCurrentUser()
                            if (updatedUser) {
                                dispatch(setUserdata(updatedUser))
                            }
                            alert("Payment successful! Your credits have been updated.")
                            onClose()
                        } else {
                            alert("Payment verification failed. Please contact support.")
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error)
                        alert("Error verifying payment.")
                    } finally {
                        setIsProcessing(false)
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false)
                    }
                },
                theme: {
                    color: "#4F46E5"
                }
            }

            if (typeof window.Razorpay !== "undefined") {
                const razorpay = new window.Razorpay(options)
                razorpay.open()
            } else {
                alert("Razorpay SDK is not loaded. Please check your internet connection.")
                setIsProcessing(false)
            }
        } catch (error) {
            console.error("Upgrade error:", error)
            alert("Payment error occurred.")
            setIsProcessing(false)
        }
    }

    const currentCredits = userData?.credits ?? 0
    const totalCredits = userData?.totalCredits ?? 100
    const percent = Math.min(100, Math.max(0, (currentCredits / (totalCredits || 1)) * 100))

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.25 }}
                        className="fixed right-0 top-0 z-50 h-screen w-full max-w-[380px] bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        <div className='flex items-center justify-between p-5 border-b border-white/10'>
                            <div>
                                <div className='text-white text-lg font-semibold'>Billing</div>
                                <div className='text-slate-400 text-sm'>Plans & Credits</div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer border-none"
                                title="Close"
                            >
                                <X size={18} className="text-slate-300" />
                            </button>
                        </div>

                        <div className='p-5'>
                            <div className='rounded-xl bg-white/[0.04] border border-white/10 p-4'>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className='text-slate-400 text-sm'>Current Plan</p>
                                        <h3 className='text-white text-xl font-bold capitalize'>
                                            {userData?.plan || "Free"}
                                        </h3>
                                    </div>
                                    <Crown className='text-yellow-400' />
                                </div>

                                <div className='mt-5'>
                                    <div className='flex justify-between text-xs text-slate-400 mb-2'>
                                        <span>Credits</span>
                                        <span>{currentCredits} / {totalCredits}</span>
                                    </div>

                                    <div className='h-2 rounded-full bg-white/10 overflow-hidden'>
                                        <div
                                            className="h-full bg-indigo-500 transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='px-5 flex-1 overflow-auto space-y-4 pb-6'>
                            <div className='rounded-xl border border-white/10 p-4 bg-white/[0.02]'>
                                <h3 className='text-white font-semibold'>Starter Plan</h3>
                                <p className='text-indigo-400 text-2xl font-bold mt-2'>₹199</p>
                                <p className='text-slate-400 text-sm mt-1'>500 Credits / 30 Days</p>
                                <button
                                    disabled={isProcessing}
                                    className='mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2.5 text-white font-medium cursor-pointer border-none transition-colors duration-150 disabled:opacity-50'
                                    onClick={() => handleUpgrade("starter")}
                                >
                                    {isProcessing ? "Processing..." : "Upgrade to Starter"}
                                </button>
                            </div>

                            <div className='rounded-xl border border-white/10 p-4 bg-white/[0.02]'>
                                <h3 className='text-white font-semibold'>Pro Plan</h3>
                                <p className='text-indigo-400 text-2xl font-bold mt-2'>₹499</p>
                                <p className='text-slate-400 text-sm mt-1'>1000 Credits / 30 Days</p>
                                <button
                                    disabled={isProcessing}
                                    className='mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2.5 text-white font-medium cursor-pointer border-none transition-colors duration-150 disabled:opacity-50'
                                    onClick={() => handleUpgrade("pro")}
                                >
                                    {isProcessing ? "Processing..." : "Upgrade to Pro"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default BillingDrawer
