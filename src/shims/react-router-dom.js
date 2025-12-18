import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext({ path: '/', navigate: () => {} })
const ParamsContext = createContext({ params: {} })

const getPathname = () => (typeof window !== 'undefined' && window.location?.pathname ? window.location.pathname : '/')

const matchPath = (pattern = '*', pathname) => {
  if (pattern === '*') return {}
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) return null

  const params = {}
  for (let i = 0; i < patternParts.length; i += 1) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]
    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart)
    } else if (patternPart !== pathPart) {
      return null
    }
  }
  return params
}

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(getPathname())

  useEffect(() => {
    const handler = () => setPath(getPathname())
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handler)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handler)
      }
    }
  }, [])

  const navigate = useCallback((to, options = {}) => {
    if (typeof to !== 'string') return
    setPath(to)
    if (typeof window !== 'undefined' && window.history) {
      const method = options.replace ? 'replaceState' : 'pushState'
      window.history[method]({}, '', to)
    }
  }, [])

  const contextValue = useMemo(() => ({ path, navigate }), [path, navigate])

  return (
    <RouterContext.Provider value={contextValue}>
      <ParamsContext.Provider value={{ params: {} }}>{children}</ParamsContext.Provider>
    </RouterContext.Provider>
  )
}

export function Routes({ children }) {
  const { path } = useContext(RouterContext)
  const childArray = React.Children.toArray(children)
  let match = null

  for (const child of childArray) {
    if (!React.isValidElement(child)) continue
    const params = matchPath(child.props.path || '*', path)
    if (params !== null) {
      match = { element: child.props.element, params }
      break
    }
  }

  if (!match) return null

  return <ParamsContext.Provider value={{ params: match.params }}>{match.element}</ParamsContext.Provider>
}

export function Route() {
  return null
}

export function Navigate({ to, replace }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to, { replace })
  }, [navigate, replace, to])
  return null
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext)
  return navigate
}

export function useLocation() {
  const { path } = useContext(RouterContext)
  return { pathname: path }
}

export function useParams() {
  const { params } = useContext(ParamsContext)
  return params
}
