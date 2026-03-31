import http from '@/utils/HttpsAxios'

export function getDashboardInit(envRangeType = 'MONTH', pressureRangeType = 'TODAY') {
  return http.get('/api/dashboard/init', {
    params: {
      envRangeType,
      pressureRangeType
    }
  })
}
