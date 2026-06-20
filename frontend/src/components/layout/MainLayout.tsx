import { Outlet, NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'

function MainLayout() {
  const { isAuthenticated, logout } = useAuthStore()

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-full"
      >
        Saltar al contenido principal
      </a>

      <header className="sticky top-0 z-10 backdrop-blur-sm bg-sky-50/80 border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="m-0 mb-1 text-muted text-xs font-semibold uppercase tracking-widest">
                Frontend base
              </p>
              <h1 className="m-0 text-lg">Express + React + Skills</h1>
            </div>
            <nav aria-label="Navegación principal" className="flex items-center gap-3">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-muted transition-all ease-in-out duration-200 ${
                    isActive
                      ? 'bg-surface text-text shadow-sm'
                      : 'hover:bg-surface hover:text-text hover:shadow-sm'
                  }`
                }
              >
                Inicio
              </NavLink>
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/demo"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full text-muted transition-all ease-in-out duration-200 ${
                        isActive
                          ? 'bg-surface text-text shadow-sm'
                          : 'hover:bg-surface hover:text-text hover:shadow-sm'
                      }`
                    }
                  >
                    Demo
                  </NavLink>
                  <Button type="button" variant="ghost" onClick={logout}>
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full text-muted transition-all ease-in-out duration-200 ${
                        isActive
                          ? 'bg-surface text-text shadow-sm'
                          : 'hover:bg-surface hover:text-text hover:shadow-sm'
                      }`
                    }
                  >
                    Entrar
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full transition-all ease-in-out duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-primary text-white hover:bg-primary-hover shadow-sm'
                      }`
                    }
                  >
                    Registro
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="py-8 pb-12">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
