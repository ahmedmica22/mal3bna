import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { Dialog } from '../components/ui/Dialog';
import { SectionTabs } from '../components/ui/SectionTabs';
import { TextField } from '../components/forms/TextField';

afterEach(cleanup);

it('associates form labels and validation messages with their input', () => {
  render(<TextField label="Email address" type="email" error="Enter a valid email" />);
  const input = screen.getByRole('textbox', { name: 'Email address' });
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(screen.getByRole('alert').id).toBe(input.getAttribute('aria-describedby'));
});

it('keeps modal keyboard focus inside the dialog and restores its trigger on Escape', () => {
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open editor</button>
        {open && (
          <Dialog label="Editor" onClose={() => setOpen(false)}>
            <section>
              <input aria-label="Name" />
              <button onClick={() => setOpen(false)}>Close editor</button>
            </section>
          </Dialog>
        )}
      </>
    );
  }
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Open editor' });
  trigger.focus();
  fireEvent.click(trigger);
  expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Name' }));
  const last = screen.getByRole('button', { name: 'Close editor' });
  last.focus();
  fireEvent.keyDown(last, { key: 'Tab' });
  expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Name' }));
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it('moves tab selection and focus with arrow keys and Home', () => {
  function Example() {
    const [value, setValue] = useState<'first' | 'second'>('first');
    return (
      <SectionTabs
        label="Sections"
        items={[
          { id: 'first', label: 'First' },
          { id: 'second', label: 'Second' },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  }
  render(<Example />);
  const first = screen.getByRole('tab', { name: 'First' });
  const second = screen.getByRole('tab', { name: 'Second' });
  first.focus();
  fireEvent.keyDown(first, { key: 'ArrowRight' });
  expect(second.getAttribute('aria-selected')).toBe('true');
  expect(document.activeElement).toBe(second);
  fireEvent.keyDown(second, { key: 'Home' });
  expect(first.getAttribute('aria-selected')).toBe('true');
});
