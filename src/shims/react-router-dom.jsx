import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext({ pathname: '/', navigate: () => {}, params: {}, setParams: () => {} })

function normalizePath(to) {
  if (to == null) return '/'

  if (to instanceof URL) {
    return to.pathname || '/'
  }

  if (typeof to === 'object') {
    const pathname = typeof to.pathname === 'string' ? to.pathname : '/'
    const search = typeof to.search === 'string' ? to.search : ''
    const hash = typeof to.hash === 'string' ? to.hash : ''
    const full = `${pathname}${search}${hash}`
    return full.startsWith('/') ? full : `/${full}`
  }

  if (typeof to !== 'string') return '/'

  const path = to.trim()
  if (!path) return '/'

  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      return new URL(path).pathname || '/'
    } catch {
      return '/'
    }
  }

  return path.startsWith('/') ? path : `/${path}`
}

const matchPath = (pattern, current) => {
  const patternParts = normalizePath(pattern).split('/')
  const pathParts = normalizePath(current).split('/')
  if (patternParts.length !== pathParts.length) return { matched: false, params: {} }
  const params = {}
  for (let i = 0; i < patternParts.length; i += 1) {
    const segment = patternParts[i]
    const value = pathParts[i]
    if (segment.startsWith(':')) params[segment.slice(1)] = value
    else if (segment !== value) return { matched: false, params: {} }
  }
  return { matched: true, params }
}

export function BrowserRouter({ children }) {
  const [pathname, setPathname] = useState(() => normalizePath(window.location?.pathname))
  const [params, setParams] = useState({})

  useEffect(() => {
    const onPopState = () => setPathname(normalizePath(window.location?.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (to, options = {}) => {
    const target = normalizePath(to)
    if (options.replace) {
      window.history.replaceState({}, '', target)
    } else {
      window.history.pushState({}, '', target)
    }
    setPathname(target.split('?')[0].split('#')[0])
  }

  const value = useMemo(() => ({ pathname, navigate, params, setParams }), [pathname, params])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useNavigate() {
  return useContext(RouterContext).navigate
}

export function useLocation() {
  const router = useContext(RouterContext)
  return { pathname: router.pathname, state: window.history.state || {}, search: window.location.search }
}

export function useParams() {
  return useContext(RouterContext).params
}

export function Navigate({ to = '/', replace = false }) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace }) }, [navigate, to, replace])
  return null
}

export function Routes({ children }) {
  const router = useContext(RouterContext)
  const location = useLocation()
  let fallback = null
  let match = null

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const { path, element } = child.props
    if (path === '*') fallback = element
    if (match) return
    const { matched, params } = matchPath(path, location.pathname)
    if (matched) {
      router.setParams(params)
      match = element
    }
  })

  return match ?? fallback ?? null
}

export function Route() {
  return null
}

export default { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation }
