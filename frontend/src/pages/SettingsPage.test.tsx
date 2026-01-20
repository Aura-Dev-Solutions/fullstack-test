import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../test/test-utils'
import { SettingsPage } from './SettingsPage'
import { organizationService, notify, authService } from '../services'

vi.mock('../services', () => ({
  organizationService: {
    get: vi.fn(),
    update: vi.fn(),
  },
  notify: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  authService: {
    getToken: vi.fn(),
    setToken: vi.fn(),
    removeToken: vi.fn(),
    logout: vi.fn(),
  },
}))

const organizationFixture = {
  id: 'org-1',
  name: 'Acme Inc',
  createdAt: '2024-01-01',
}

const userFixture = {
  id: 'user-1',
  name: 'Taylor Reed',
  email: 'taylor@example.com',
  organizationId: 'org-1',
}

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows a success toast when updating the organization', async () => {
    const user = userEvent.setup()
    localStorage.setItem('user', JSON.stringify(userFixture))
    vi.mocked(authService.getToken).mockReturnValue('token')
    vi.mocked(organizationService.get).mockResolvedValue(organizationFixture)
    vi.mocked(organizationService.update).mockResolvedValue({
      ...organizationFixture,
      name: 'Nova Labs',
    })

    render(<SettingsPage />)

    await screen.findByText(organizationFixture.name)

    await user.click(screen.getByRole('button', { name: /edit/i }))
    const nameInput = screen.getByLabelText(/organization name/i)
    await user.clear(nameInput)
    await user.type(nameInput, 'Nova Labs')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(organizationService.update).toHaveBeenCalledWith({
        name: 'Nova Labs',
      })
      expect(notify.success).toHaveBeenCalledWith(
        'The organization was updated successfully',
      )
    })
  })
})
