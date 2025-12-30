import { supabase } from './supabase'

/**
 * Sign up a new user (business owner)
 */
export async function signUp(email: string, password: string, fullName: string, businessName: string) {
  // Create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'owner',
      },
    },
  })

  if (authError) {
    return { data: null, error: authError }
  }

  if (!authData.user) {
    return { data: null, error: new Error('Failed to create user') }
  }

  // Create the business
  const { data: businessData, error: businessError } = await supabase
    .from('businesses')
    .insert({
      name: businessName,
      owner_id: authData.user.id,
    })
    .select()
    .single()

  if (businessError) {
    return { data: null, error: businessError }
  }

  // Update the profile with the business_id
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ business_id: businessData.id })
    .eq('id', authData.user.id)

  if (profileError) {
    return { data: null, error: profileError }
  }

  return { data: authData, error: null }
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Get the current user's profile (includes business_id and role)
 */
export async function getCurrentProfile() {
  const { user, error: userError } = await getCurrentUser()

  if (userError || !user) {
    return { profile: null, error: userError }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, businesses(*)')
    .eq('id', user.id)
    .single()

  return { profile, error: profileError }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const { user } = await getCurrentUser()
  return !!user
}
