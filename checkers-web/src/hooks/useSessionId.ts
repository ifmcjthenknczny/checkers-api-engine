export const useSessionId = () => {
  const sessionId = useCookie('session_id', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  })

  const getSessionId = () => {
    return sessionId.value
  }

  const generateSessionId = () => {
    sessionId.value = crypto.randomUUID()
    return sessionId.value
  }

  const clearSessionId = () => {
    sessionId.value = null
  }

  return {
    sessionId,
    getSessionId,
    generateSessionId,
    clearSessionId,
  }
}
