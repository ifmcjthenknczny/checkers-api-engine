import { useSessionId } from '~/hooks/useSessionId'

export default defineNuxtRouteMiddleware(() => {
  const session = useSessionId()

  if (import.meta.client) {
    session.clearSessionId()
  }
})
