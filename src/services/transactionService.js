import { supabase } from '../lib/supabase'

export const transactionService = {
  async getAll(filters = {}) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*),
        account:accounts(*)
      `)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('transaction_date', filters.endDate)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }
    if (filters.accountId) {
      query = query.eq('account_id', filters.accountId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*),
        account:accounts(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(transaction) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.id }])
      .select()
      .single()

    if (error) throw error

    // Update account balance
    if (transaction.account_id) {
      await transactionService.updateAccountBalance(
        transaction.account_id,
        transaction.amount,
        transaction.type,
        'add'
      )
    }

    return data
  },

  async update(id, transaction) {
    // Get old transaction to revert balance
    const oldTransaction = await transactionService.getById(id)

    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Revert old balance
    if (oldTransaction.account_id) {
      await transactionService.updateAccountBalance(
        oldTransaction.account_id,
        oldTransaction.amount,
        oldTransaction.type,
        'subtract'
      )
    }

    // Apply new balance
    const newAccountId = transaction.account_id || oldTransaction.account_id
    const newAmount = transaction.amount || oldTransaction.amount
    const newType = transaction.type || oldTransaction.type

    if (newAccountId) {
      await transactionService.updateAccountBalance(
        newAccountId,
        newAmount,
        newType,
        'add'
      )
    }

    return data
  },

  async delete(id) {
    // Get transaction to revert balance
    const transaction = await transactionService.getById(id)

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Revert balance
    if (transaction.account_id) {
      await transactionService.updateAccountBalance(
        transaction.account_id,
        transaction.amount,
        transaction.type,
        'subtract'
      )
    }
  },

  async updateAccountBalance(accountId, amount, type, operation) {
    if (!accountId) return

    const { data: account } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', accountId)
      .single()

    if (!account) return

    let newBalance = parseFloat(account.balance || 0)
    const transactionAmount = parseFloat(amount)

    if (operation === 'add') {
      // When adding a transaction
      newBalance = type === 'income'
        ? newBalance + transactionAmount
        : newBalance - transactionAmount
    } else {
      // When removing/reverting a transaction
      newBalance = type === 'income'
        ? newBalance - transactionAmount
        : newBalance + transactionAmount
    }

    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId)
  },

  async getStats(startDate, endDate) {
    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)

    if (error) throw error

    const income = data
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const expense = data
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    return { income, expense, balance: income - expense }
  },
}
