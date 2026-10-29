import { describe, it, expect, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VenuePage } from '../pages/player/VenuePage';
import { venueApi } from '../services/api';
import type { Venue } from '../types/domain';

vi.mock('../services/api', () => ({
  venueApi: { detail: vi.fn(), availability: vi.fn().mockResolvedValue([]) },
}));
describe('venue booking page loading', () => {
  it('renders court selection after an initially pending API request without changing hook order', async () => {
    let resolveVenue!: (venue: Venue) => void;
    vi.mocked(venueApi.detail).mockReturnValue(
      new Promise((resolve) => {
        resolveVenue = resolve;
      }),
    );
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/venues/test-venue']}>
          <Routes>
            <Route path="/venues/:id" element={<VenuePage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText('Loading venue details…')).toBeDefined();
    await act(async () =>
      resolveVenue({
        id: 'test-venue',
        name: 'Regression Arena',
        courts: [{ id: 'test-court', name: 'Regression Pitch', sport: 'football', size: 5 }],
      }),
    );
    expect(await screen.findByRole('heading', { name: 'Regression Arena' })).toBeDefined();
    expect(await screen.findByText('Regression Pitch')).toBeDefined();
    client.clear();
  });
});
