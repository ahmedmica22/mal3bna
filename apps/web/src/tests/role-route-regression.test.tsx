import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoleRoute } from '../routes/RoleRoute';
vi.mock('../store/AuthStore', () => ({ useAuth: () => ({ user: null, loading: true }) }));
it('waits for cookie session restoration before redirecting an owner', () => {
  render(
    <MemoryRouter initialEntries={['/owner']}>
      <Routes>
        <Route element={<RoleRoute role="owner" />}>
          <Route path="/owner" element={<p>Owner</p>} />
        </Route>
        <Route path="/auth/login" element={<p>Login form</p>} />
      </Routes>
    </MemoryRouter>,
  );
  expect(screen.getByRole('status').textContent).toContain('Loading your session');
  expect(screen.queryByText('Login form')).toBeNull();
});
