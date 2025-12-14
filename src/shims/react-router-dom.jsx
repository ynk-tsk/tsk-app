import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext({
  location: { pathname: '/', search: '', hash: '', state: null },
  navigate: () => {},
  params: {},
  setParams: () => {},
})

const safeSegment = (value, prefix = '') => {
  if (typeof value !== 'string') return ''
  if (!value) return ''
  return value.startsWith(prefix) ? value : `${prefix}${value}`
}

const buildPath = ({ pathname, search, hash }) => {
  const base = typeof pathname === 'string' && pathname.trim() ? pathname.trim() : '/'
  const normalizedPath = base.startsWith('/') ? base : `/${base}`
  const searchPart = safeSegment(search, '?')
  const hashPart = safeSegment(hash, '#')
  return `${normalizedPath}${searchPart}${hashPart}`
}

function normalizePath(to) {
  if (to == null) return '/'

  if (to instanceof URL) {
    return buildPath({ pathname: to.pathname || '/', search: to.search || '', hash: to.hash || '' })
  }

  if (typeof to === 'object') {
    return buildPath({ pathname: to.pathname, search: to.search, hash: to.hash })
  }

  if (typeof to !== 'string') return '/'

  const path = to.trim()
  if (!path) return '/'

  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path)
      return buildPath({ pathname: url.pathname || '/', search: url.search || '', hash: url.hash || '' })
    } catch {
      return '/'
    }
  }

  if (path.startsWith('/')) return path
  return `/${path}`
}

const normalizePathname = (value) => {
  if (typeof value !== 'string') return '/'
  const trimmed = value.trim()
  if (!trimmed) return '/'
  const pathOnly = trimmed.split('?')[0].split('#')[0]
  if (pathOnly.startsWith('/')) return pathOnly || '/'
  return `/${pathOnly}`
}

const matchPath = (pattern, actualPath) => {
  if (pattern === '*') return { params: {} }

  const patternPath = normalizePathname(pattern)
  const currentPath = normalizePathname(actualPath)

  const patternParts = patternPath.split('/').filter(Boolean)
  const currentParts = currentPath.split('/').filter(Boolean)

  if (patternParts.length !== currentParts.length) return null

  const params = {}

  for (let i = 0; i < patternParts.length; i += 1) {
    const segment = patternParts[i]
    const value = currentParts[i]
    if (segment.startsWith(':')) {
      params[segment.slice(1)] = value
    } else if (segment !== value) {
      return null
    }
  }

  return { params }
}

const parseLocation = () => ({
  pathname: window.location.pathname || '/',
  search: window.location.search || '',
  hash: window.location.hash || '',
  state: window.history.state?.__routerState ?? null,
})

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(() => parseLocation())
  const [params, setParams] = useState({})

  useEffect(() => {
    const onPopState = () => setLocation(parseLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (to, options = {}) => {
    const target = normalizePath(to)
    const targetUrl = new URL(target, window.location.origin)
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (`${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}` === current) return

    const state = options.state ?? (typeof to === 'object' ? to.state : null)
    const historyState = { __routerState: state }

    if (options.replace) {
      window.history.replaceState(historyState, '', targetUrl.href)
    } else {
      window.history.pushState(historyState, '', targetUrl.href)
    }

    setLocation({
      pathname: targetUrl.pathname || '/',
      search: targetUrl.search || '',
      hash: targetUrl.hash || '',
      state,
    })
  }

  const value = useMemo(
    () => ({ location, navigate, params, setParams }),
    [location, params],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useNavigate() {
  return useContext(RouterContext).navigate
}

export function useLocation() {
  return useContext(RouterContext).location
}

export function useParams() {
  return useContext(RouterContext).params
}

export function Navigate({ to = '/', replace = false, state = null }) {
  const nav = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const target = normalizePath(to)
    const targetUrl = new URL(target, window.location.origin)
    const current = `${location.pathname}${location.search}${location.hash}`

    if (`${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}` === current) return
    nav(to, { replace, state })
  }, [nav, to, replace, state, location.pathname, location.search, location.hash])

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
    const result = matchPath(path, location.pathname)
    if (result) {
      router.setParams(result.params)
      match = element
    }
  })

  return match ?? fallback ?? null
}

export function Route() {
  return null
}

export default { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams }
