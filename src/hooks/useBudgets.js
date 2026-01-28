import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetService } from '../services/budgetService'

export const useBudgets = (year = null, month = null) => {
  return useQuery({
    queryKey: ['budgets', year, month],
    queryFn: () => budgetService.getAll(year, month),
  })
}

export const useBudget = (id) => {
  return useQuery({
    queryKey: ['budgets', id],
    queryFn: () => budgetService.getById(id),
    enabled: !!id,
  })
}

export const useCreateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: budgetService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useUpdateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => budgetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: budgetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useBudgetProgress = (year, month) => {
  return useQuery({
    queryKey: ['budgets', 'progress', year, month],
    queryFn: () => budgetService.getBudgetProgress(year, month),
    enabled: !!year && !!month,
  })
}

export const useTotalBudget = (year, month) => {
  return useQuery({
    queryKey: ['budgets', 'total', year, month],
    queryFn: () => budgetService.getTotalBudget(year, month),
    enabled: !!year && !!month,
  })
}
