import { useSessionId } from './useSessionId'

const GAME_PATH = '/play'

const shouldSendSessionId = (routePath: string, sessionId?: string): sessionId is string => {
  return Boolean(sessionId) && routePath === GAME_PATH
}

export const useShouldLog = () => {
  const sessionId = useSessionId().getSessionId()
  const route = useRoute()

  const isOk = shouldSendSessionId(route.path, sessionId)

  return { isOk, sessionId }
}
