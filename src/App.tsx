import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { NotFoundPage } from './components/NotFoundPage'
import { SearchPage } from './features/search/SearchPage'
import { ShowDetailsPage } from './features/show-details/ShowDetailsPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<SearchPage />} />
        <Route path="shows/:id" element={<ShowDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
