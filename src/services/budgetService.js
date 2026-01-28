import { supabase } from '../lib/supabase'

export const budgetService = {
  async getAll(year = null, month = null) {
    let query = supabase
      .from('budgets')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false })

    if (year) {
      query = query.eq('year', year)
    }
    if (month) {
      query = query.eq('month', month)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(budget) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('budgets')
      .insert([{ ...budget, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, budget) {
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getBudgetProgress(year, month) {
    const { data: { user } } = await supabase.auth.getUser()

    // Get budgets for the month
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('user_id', user.id)
      .eq('year', year)
      .eq('month', month)

    if (budgetError) throw budgetError

    // Calculate spending for each budget
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]

    const progress = await Promise.all(
      budgets.map(async (budget) => {
        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('category_id', budget.category_id)
          .eq('type', 'expense')
          .gte('transaction_date', startDate)
          .lte('transaction_date', endDate)

        const spent = transactions
          ? transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)
          : 0

        const budgetAmount = parseFloat(budget.amount) || 0
        const remaining = budgetAmount - spent
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0

        return {
          ...budget,
          spent,
          remaining,
          percentage: Math.min(percentage, 100),
          isOverBudget: spent > budgetAmount,
        }
      })
    )

    return progress
  },

  async getTotalBudget(year, month) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('budgets')
      .select('amount')
      .eq('user_id', user.id)
      .eq('year', year)
      .eq('month', month)

    if (error) throw error

    const total = data.reduce((sum, budget) => {
      return sum + parseFloat(budget.amount || 0)
    }, 0)

    return total
  },
}
