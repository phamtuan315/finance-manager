import { supabase } from '../lib/supabase'

export const accountService = {
  async getAll() {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(account) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('accounts')
      .insert([{
        ...account,
        user_id: user.id,
        balance: account.balance || 0
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, account) {
    const { data, error } = await supabase
      .from('accounts')
      .update(account)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getTotalBalance() {
    const { data, error } = await supabase
      .from('accounts')
      .select('balance')

    if (error) throw error

    const total = data.reduce((sum, account) => {
      return sum + parseFloat(account.balance || 0)
    }, 0)

    return total
  },
}
