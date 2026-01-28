import { supabase } from '../lib/supabase'

export const goalService = {
  async getAll(status = null) {
    let query = supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(goal) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('goals')
      .insert([{
        ...goal,
        user_id: user.id,
        status: 'active',
        current_amount: 0,
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, goal) {
    const { data, error } = await supabase
      .from('goals')
      .update(goal)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async addContribution(id, amount) {
    // Get current goal
    const { data: goal } = await supabase
      .from('goals')
      .select('current_amount, target_amount')
      .eq('id', id)
      .single()

    const newAmount = parseFloat(goal.current_amount) + parseFloat(amount)
    const status = newAmount >= parseFloat(goal.target_amount) ? 'completed' : 'active'

    // Update goal
    const { data, error } = await supabase
      .from('goals')
      .update({
        current_amount: newAmount,
        status: status,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getStats() {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error

    const totalGoals = goals.length
    const activeGoals = goals.filter(g => g.status === 'active').length
    const completedGoals = goals.filter(g => g.status === 'completed').length
    const totalTarget = goals.reduce((sum, g) => sum + parseFloat(g.target_amount || 0), 0)
    const totalSaved = goals.reduce((sum, g) => sum + parseFloat(g.current_amount || 0), 0)
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      totalTarget,
      totalSaved,
      overallProgress,
    }
  },
}
