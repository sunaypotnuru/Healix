import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';

export type Role = 'patient' | 'doctor' | 'admin' | null;

interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (role?: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        const initAuth = async () => {
            setIsLoading(true);

            // @ts-ignore
            if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
                const mockRole = (localStorage.getItem('bypassRole') as Role) || 'patient';
                const mockEmail = localStorage.getItem('bypassEmail') || 'test@netraai.com';
                setUser({
                    id: '00000000-0000-0000-0000-000000000000',
                    email: mockEmail,
                    name: `Demo User (Bypassed)`,
                    role: mockRole,
                });
                setIsLoading(false);
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    await fetchAndSetUser(session.user);
                } else {
                    setUser(null);
                    useAuthStore.getState().signOut();
                }
            } catch (err) {
                console.error("Auth init error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchAndSetUser = async (supabaseUser: any) => {
            const userId = supabaseUser.id;
            const email = supabaseUser.email || '';

            // 1. Determine Role
            // Prioritize user_metadata (which we set during signup/confirm)
            let role: Role = (supabaseUser.user_metadata?.role || supabaseUser.app_metadata?.role) as Role;
            let name = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || email;

            // 2. Fallback check if role is missing in metadata
            if (!role) {
                // Check profiles_patient
                const { data: pData } = await supabase.from('profiles_patient').select('name').eq('id', userId).maybeSingle();
                if (pData) {
                    role = 'patient';
                    name = pData.name;
                } else {
                    // Check profiles_doctor
                    const { data: dData } = await supabase.from('profiles_doctor').select('name').eq('id', userId).maybeSingle();
                    if (dData) {
                        role = 'doctor';
                        name = dData.name;
                    } else if (email.includes('admin') || supabaseUser.user_metadata?.role === 'admin' || supabaseUser.app_metadata?.role === 'admin') {
                        role = 'admin';
                    } else {
                        role = 'patient';
                    }
                }
            }

            // 3. Fetch Full Profile Data for Zustand
            let profileData = null;
            if (role === 'patient') {
                const { data } = await supabase.from('profiles_patient').select('*').eq('id', userId).maybeSingle();
                if (data) {
                    profileData = data;
                    if (data.name) name = data.name;
                }
            } else if (role === 'doctor') {
                const { data } = await supabase.from('profiles_doctor').select('*').eq('id', userId).maybeSingle();
                if (data) {
                    profileData = data;
                    if (data.name) name = data.name;
                }
            }

            const finalUser = {
                id: userId,
                email: email,
                name: name,
                role: role,
            };

            setUser(finalUser);
            useAuthStore.getState().setUser(finalUser);
            if (profileData) useAuthStore.getState().setProfile(profileData);
        };

        initAuth();

        // Listen for Auth changes dynamically
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
            if (session?.user) {
                await fetchAndSetUser(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                useAuthStore.getState().signOut();
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    const login = async () => {
        // This is a legacy method, login should be handled in login pages using useAuthStore or authAPI
        console.warn("Legacy AuthContext.login() called. Use PatientLoginPage or DoctorLoginPage.");
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authAPI.logout();
            setUser(null);
            useAuthStore.getState().signOut();
        } catch (e) {
            console.error("Logout failed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
