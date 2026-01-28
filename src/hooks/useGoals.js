import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { goalService } from '../services/goalService'

export const useGoals = (status = null) => {
  return useQuery({
    queryKey: ['goals', status],
    queryFn: () => goalService.getAll(status),
  })
}

export const useGoal = (id) => {
  return useQuery({
    queryKey: ['goals', id],
    queryFn: () => goalService.getById(id),
    enabled: !!id,
  })
}

export const useCreateGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goalStats'] })
    },
  })
}

export const useUpdateGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => goalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goalStats'] })
    },
  })
}

export const useDeleteGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: goalService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goalStats'] })
    },
  })
}

export const useAddContribution = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, amount }) => goalService.addContribution(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goalStats'] })
    },
  })
}

export const useGoalStats = () => {
  return useQuery({
    queryKey: ['goalStats'],
    queryFn: goalService.getStats,
  })
}
