import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '../services/accountService'

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getAll,
  })
}

export const useAccount = (id) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountService.getById(id),
    enabled: !!id,
  })
}

export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => accountService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export const useTotalBalance = () => {
  return useQuery({
    queryKey: ['accounts', 'total-balance'],
    queryFn: accountService.getTotalBalance,
  })
}
