import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('Checks for the correct title', () => {
    render(<App />)

    const title = screen.getByText('TV series search app')
    expect(title).toBeInTheDocument()
  })
})
