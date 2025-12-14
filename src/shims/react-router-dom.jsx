import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext({ pathname: '/', navigate: () => {} })

function normalizePath(path) {
  if (!path) return '/'
  if (path.startsWith('http')) {
    try { return new URL(path).pathname || '/' } catch { return '/' }
  }
  return path.startsWith('/') ? path : `/${path}`
}

export function BrowserRouter({ children }) {
  const [pathname, setPathname] = useState(() => normalizePath(window.location?.pathname))

  useEffect(() => {
    const onPopState = () => setPathname(normalizePath(window.location?.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (to, options = {}) => {
    const target = normalizePath(to)
    if (options.replace) window.history.replaceState({}, '', target)
    else window.history.pushState({}, '', target)
    setPathname(target)
    window.dispatchEvent(new Event('popstate'))
  }

  const value = useMemo(() => ({ pathname, navigate }), [pathname])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useNavigate() {
  return useContext(RouterContext).navigate
}

export function useLocation() {
  return { pathname: useContext(RouterContext).pathname }
}

export function Navigate({ to = '/', replace = false }) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace }) }, [navigate, to, replace])
  return null
}

export function Routes({ children }) {
  const location = useLocation()
  let fallback = null
  let match = null

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const { path, element } = child.props
    if (path === '*') fallback = element
    if (match) return
    const normalizedPath = normalizePath(path)
    if (normalizedPath === normalizePath(location.pathname)) match = element
  })

  return match ?? fallback ?? null
}

export function Route() {
  return null
}

export default { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation }
