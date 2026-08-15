import { useEffect, useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc"
import { useDispatch, useSelector } from 'react-redux'
import { setUserdata } from '../redux/userSlice'
import getCurrentUser from '../features/getCurrentUser'
import SideBar from '../components/SideBar'
import ChatArea from '../components/ChatArea'
import Artifact from '../components/Artifact'

function Home() {
    const { userData } = useSelector(state => state.user)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        const checkSession = async () => {
            try {
                const user = await getCurrentUser()
                if (user) {
                    dispatch(setUserdata(user))
                }
            } catch (err) {
                console.error("Session restoration error:", err)
            } finally {
                setIsCheckingAuth(false)
            }
        }
        checkSession()
    }, [dispatch])

    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [loginError, setLoginError] = useState("")

    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data))
        } catch (error) {
            console.error("Login failed:", error)
            setLoginError(error?.response?.data?.message || "Login failed. Please try again.")
        } finally {
            setIsLoggingIn(false)
        }
    }

    const googleLogin = async () => {
        try {
            setIsLoggingIn(true)
            setLoginError("")
            const data = await signInWithPopup(auth, googleProvider)
            const token = await data.user.getIdToken()
            await handleLogin(token)
        } catch (err) {
            console.error("Google sign in failed:", err)
            setLoginError(err.message || "Google Sign-in failed.")
            setIsLoggingIn(false)
        }
    }

    return (
        <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>
            <SideBar onOpenLogin={googleLogin} />
            <ChatArea />
            <Artifact />

            {!isCheckingAuth && !userData && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur'>
                    <div className='w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5 shadow-2xl'>
                        <div className='flex flex-col gap-1'>
                            <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to CortexAI</h2>
                            <p className='text-[13px] text-slate-500'>Please login to continue using the app.</p>
                        </div>

                        {loginError && (
                            <p className='text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg'>
                                {loginError}
                            </p>
                        )}

                        <button
                            disabled={isLoggingIn}
                            className='w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200 disabled:opacity-50 transition-all duration-150 cursor-pointer'
                            onClick={googleLogin}
                        >
                            <FcGoogle size={16} />
                            {isLoggingIn ? "Signing in..." : "Continue With Google"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
