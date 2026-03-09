export function authErrorMiddleware(context) {
  if (context.response.status === 401 && !context.errorMessage) {
    return {
      ...context,
      errorMessage: 'Session expired or invalid token',
    }
  }

  return context
}

export function applyResponseMiddlewares(context, middlewares = []) {
  return middlewares.reduce((current, middleware) => middleware(current) ?? current, context)
}
