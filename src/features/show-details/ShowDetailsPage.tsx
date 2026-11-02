import { useParams } from 'react-router'

export function ShowDetailsPage() {
  const { id } = useParams()

  return <h1>Show {id}</h1>
}
