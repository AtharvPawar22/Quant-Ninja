import { supabase } from '../lib/supabase.js'

/**
 * Email Service for QuantNinja
 * Handles storing emails to Supabase for future product notifications.
 */

const EMAILS_TABLE = 'emails'

/**
 * Save email to waitlist
 * @param {string} email - The email to save
 * @param {Object} metadata - Optional metadata (source, utm params, etc.)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const saveEmailToWaitlist = async (email, metadata = {}) => {
    if (!supabase) {
        return { success: false, error: 'Supabase not configured. Please check your environment variables.' }
    }

    try {
        const normalizedEmail = email.toLowerCase().trim()

        const { data, error } = await supabase
            .from(EMAILS_TABLE)
            .upsert(
                {
                    email: normalizedEmail,
                    source: metadata.source || 'website',
                    page: metadata.page || window.location.pathname,
                    user_agent: navigator.userAgent,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    ...metadata
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

/**
 * Check if email already exists in waitlist
 * @param {string} email - The email to check
 * @returns {Promise<{exists: boolean, data?: any, error?: string}>}
 */
export const checkEmailExists = async (email) => {
    if (!supabase) {
        return { exists: false, error: 'Supabase not configured' }
    }

    try {
        const normalizedEmail = email.toLowerCase().trim()

        const { data, error } = await supabase
            .from(EMAILS_TABLE)
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

/**
 * Get all emails (for admin use - requires proper RLS policies)
 * @returns {Promise<{success: boolean, data?: any[], error?: string}>}
 */
export const getAllEmails = async () => {
    if (!supabase) {
        return { success: false, error: 'Supabase not configured' }
    }

    try {
        const { data, error } = await supabase
            .from(EMAILS_TABLE)
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

/**
 * Delete email from waitlist
 * @param {string} email - The email to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteEmail = async (email) => {
    if (!supabase) {
        return { success: false, error: 'Supabase not configured' }
    }

    try {
        const normalizedEmail = email.toLowerCase().trim()

        const { error } = await supabase
            .from(EMAILS_TABLE)
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
