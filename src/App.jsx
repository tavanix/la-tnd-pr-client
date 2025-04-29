import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'

import { ErrorElement } from './components'
import {
  HomeLayout,
  Landing,
  Error,
  Login,
  Profile,
  Faq,
  Employees,
  AdminPanel,
  Dashboard,
} from './pages'

// loaders
import { loader as adminLoader } from './pages/AdminPanel'
import { loader as profileLoader } from './pages/Profile'
import { loader as homeLoader } from './pages/HomeLayout'
import { loader as employeesLoader } from './pages/Employees'
import { loader as dashboardLoader } from './pages/Dashboard'

// actions
import { action as loginAction } from './pages/Login'
import { action as updatePasswordAction } from './pages/Profile'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    loader: homeLoader(store, queryClient),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
      },
      {
        path: 'profile',
        element: <Profile />,
        loader: profileLoader(store),
        action: updatePasswordAction(store),
      },
      {
        path: 'employees',
        element: <Employees />,
        loader: employeesLoader(store, queryClient),
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        loader: dashboardLoader(store, queryClient),
      },
      {
        path: 'faq',
        element: <Faq />,
      },
      {
        path: 'admin',
        element: <AdminPanel />,
        loader: adminLoader(store),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
])

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
export default App
