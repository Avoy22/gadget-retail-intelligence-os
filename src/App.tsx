import { AppDataProvider } from './context/AppDataContext'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <AppDataProvider>
      <AppRoutes />
    </AppDataProvider>
  )
}

export default App
