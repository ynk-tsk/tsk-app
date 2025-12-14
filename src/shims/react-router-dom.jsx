import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext({ location: { pathname: '/', search: '', state: null }, navigate: () => {} })
const ParamsContext = createContext({})

function normalizePath(path) {
  if (!path) return '/'
  if (path.startsWith('http')) {
    try { return new URL(path).pathname || '/' } catch { return '/' }
  }
  return path.startsWith('/') ? path : `/${path}`
}

function getCurrentLocation() {
  const { pathname, search } = window.location
  return { pathname: normalizePath(pathname), search: search || '', state: window.history.state ?? null }
}

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(getCurrentLocation())

  useEffect(() => {
    const onPopState = () => setLocation(getCurrentLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (to, options = {}) => {
    const url = new URL(to, window.location.origin)
    const next = { pathname: normalizePath(url.pathname), search: url.search, state: options.state ?? null }
    if (options.replace) window.history.replaceState(next.state, '', `${next.pathname}${next.search}`)
    else window.history.pushState(next.state, '', `${next.pathname}${next.search}`)
    setLocation(next)
    window.dispatchEvent(new Event('popstate'))
  }

  const value = useMemo(() => ({ location, navigate }), [location])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useNavigate() {
  return useContext(RouterContext).navigate
}

export function useLocation() {
  return useContext(RouterContext).location
}

export function useParams() {
  return useContext(ParamsContext)
}

export function Navigate({ to = '/', replace = false, state }) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace, state }) }, [navigate, to, replace, state])
  return null
}

function matchPath(pattern, pathname) {
  const patternParts = normalizePath(pattern).split('/').filter(Boolean)
  const pathParts = normalizePath(pathname).split('/').filter(Boolean)
  if (patternParts.length !== pathParts.length) return null

  const params = {}
  for (let i = 0; i < patternParts.length; i += 1) {
    const pat = patternParts[i]
    const val = pathParts[i]
    if (pat.startsWith(':')) params[pat.slice(1)] = decodeURIComponent(val)
    else if (pat !== val) return null
  }
  return params
}

export function Routes({ children }) {
  const location = useLocation()
  let fallback = null
  let match = null
  let params = {}

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const { path, element } = child.props
    if (path === '*') fallback = element
    if (match) return
    const maybeParams = matchPath(path, location.pathname)
    if (maybeParams) {
      match = element
      params = maybeParams
    }
  })

  if (!match) return fallback ?? null
  return <ParamsContext.Provider value={params}>{match}</ParamsContext.Provider>
}

export function Route() {
  return null
}

export function useSearchParams() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])

  const setSearchParams = (nextParams, options = {}) => {
    const searchString = nextParams instanceof URLSearchParams ? nextParams.toString() : new URLSearchParams(nextParams).toString()
    navigate(`${location.pathname}${searchString ? `?${searchString}` : ''}`, options)
  }

  return [params, setSearchParams]
}

export default { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams, useSearchParams }
