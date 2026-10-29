import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../components/feedback/ToastContext';

function TestComponent() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast.success('Match booked successfully!', 'Goal!')}>
        Trigger Success
      </button>
      <button onClick={() => toast.error('Payment session expired.', 'Expired')}>
        Trigger Error
      </button>
      <button onClick={() => toast.warning('Kickoff in 30 minutes.', 'Reminder')}>
        Trigger Warning
      </button>
      <button onClick={() => toast.info('New padel racket available.', 'Gear')}>
        Trigger Info
      </button>
    </div>
  );
}

describe('Active Habit: Toast Notification System', () => {
  it('renders modern floating toasts on user action', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Success'));

    expect(screen.getByText('Goal!')).toBeDefined();
    expect(screen.getByText('Match booked successfully!')).toBeDefined();
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeDefined();

    fireEvent.click(screen.getByText('Trigger Error'));
    expect(screen.getByText('Expired')).toBeDefined();
    expect(screen.getByText('Payment session expired.')).toBeDefined();
  });

  it('allows dismissing a toast via close button', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Warning'));
    expect(screen.getByText('Reminder')).toBeDefined();

    const closeBtn = screen.getByLabelText('Close notification');
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Reminder')).toBeNull();
  });

  it('deduplicates identical toasts instead of stacking multiple duplicates', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const successBtn = screen.getByText('Trigger Success');
    fireEvent.click(successBtn);
    fireEvent.click(successBtn);
    fireEvent.click(successBtn);
    fireEvent.click(successBtn);
    fireEvent.click(successBtn);

    const matches = screen.getAllByText('Match booked successfully!');
    expect(matches).toHaveLength(1);
  });
});
