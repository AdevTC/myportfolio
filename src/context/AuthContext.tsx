"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
    User,
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    signOut, 
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/login", "/admin"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && !currentUser.emailVerified) {
                // If they are not email verified, treat them as logged out in the UI context
                setUser(null);
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Route protection logic
    useEffect(() => {
        if (loading) return;

        const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

        if (!user && !isPublicRoute) {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        } else if (user && pathname === "/login") {
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        }
    }, [user, loading, pathname]);

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            if (!userCredential.user.emailVerified) {
                // Resend verification email and log them out
                await sendEmailVerification(userCredential.user);
                await signOut(auth);
                throw new Error("verify-email-first");
            }
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, pass: string, name: string) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            await updateProfile(userCredential.user, {
                displayName: name
            });
            // Send email verification
            await sendEmailVerification(userCredential.user);
            // Sign out immediately so they must verify and log in
            await signOut(auth);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            setLoading(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
