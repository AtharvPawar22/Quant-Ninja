import { supabase } from '../lib/supabase.js'

const WAITLIST_TABLE = 'waitlist'

function extractNameFromEmail(email) {
    const localPart = email.split('@')[0]
    return localPart
        .replace(/[._-]/g, ' ')
        .replace(/\d+/g, '')
        .trim() || 'Anonymous'
}

export const saveEmailToWaitlist = async (email, metadata = {}) => {
    if (!supabase) {
        return { success: false, error: 'Supabase not configured. Please check your environment variables.' }
    }

    try {
        const normalizedEmail = email.toLowerCase().trim()
        const name = metadata.name || extractNameFromEmail(normalizedEmail)

        const { data, error } = await supabase
            .from(WAITLIST_TABLE)
            .upsert(
                {
                    name: name,
                    email: normalizedEmail,
                    source: metadata.source || 'website',
                    created_at: new Date().toISOString(),
                },
                {
                    onConflict: 'email',
                    ignoreDuplicates: false
                }
            )
            .select()

        if (error) {
            console.error('Error saving email:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (err) {
        console.error('Unexpected error saving email:', err)
        return { success: false, error: err.message }
    }
}

export const checkEmailExists = async (email) => {
    if (!supabase) {
        return { exists: false, error: 'Supabase not configured' }
    }

    try {
        const normalizedEmail = email.toLowerCase().trim()

        const { data, error } = await supabase
            .from(WAITLIST_TABLE)
            .select('email, created_at')
            .eq('email', normalizedEmail)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return { exists: false }
            }
            return { exists: false, error: error.message }
        }

        return { exists: true, data }
    } catch (err) {
        console.error('Error checking email:', err)
        return { exists: false, error: err.message }
    }
}

export const getAllEmails = async () => {
    if (!supabase) {
        return { success: false, error: 'Supabase not configured' }
    }

    try {
        const { data, error } = await supabase
            .from(WAITLIST_TABLE)
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching emails:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (err) {
        console.error('Unexpected error fetching emails:', err)
        return { success: false, error: err.message }
    }
}

export const deleteEmail = async (email) => {
    if (!supabase) {
        return { success: false, error: 'Supabase not configured' }
    }

    try {
        const normalizedEmail = email.toLowerCase().trim()

        const { error } = await supabase
            .from(WAITLIST_TABLE)
            .delete()
            .eq('email', normalizedEmail)

        if (error) {
            console.error('Error deleting email:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error('Unexpected error deleting email:', err)
        return { success: false, error: err.message }
    }
}

export default {
    saveEmailToWaitlist,
    checkEmailExists,
    getAllEmails,
    deleteEmail
}
