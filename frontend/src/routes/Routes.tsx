import { Suspense, lazy, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

const Home = lazy(() => import('@/pages/Home/Home'))
const DemoPage = lazy(() => import('@/pages/Demo/DemoPage'))
const LoginPage = lazy(() => import('@/pages/Login/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/Register/RegisterPage'))

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
)

const LazyWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
)

const NotFound = () => (
  <div className="container py-12">
    <h1 className="text-4xl font-bold mb-2">404</h1>
    <p className="text-muted">La página que buscas no existe.</p>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <Home />
          </LazyWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <LazyWrapper>
            <LoginPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <LazyWrapper>
            <RegisterPage />
          </LazyWrapper>
        ),
      },
      {
        path: 'demo',
        element: (
          <LazyWrapper>
            <ProtectedRoute>
              <DemoPage />
            </ProtectedRoute>
          </LazyWrapper>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
