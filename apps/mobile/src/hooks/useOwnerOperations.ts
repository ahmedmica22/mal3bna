import type { WalkInInput } from './useWalkInForm';
import { venueDate } from '../utils/venue-time';
import { errorMessage } from '../utils/errors';
import { useState, useEffect, useRef } from 'react';
import { Venue, Booking, OwnerBalance } from '../types/domain';
import { ownerService } from '../services/owner.service';

export function useOwnerOperations(
  token: string | null,
  onToast?: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void,
) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [balance, setBalance] = useState<OwnerBalance>({});
  const [error,setError]=useState('');
  const [loading, setLoading] = useState(Boolean(token));

  const activeToken = useRef(token);
  activeToken.current = token;
  useEffect(() => {
    if (!token) {
      setVenue(null);
      setBookings([]);
      setBalance({}); setError('');
      return;
    }
    if (token) {
      setLoading(true);
      loadData();
      const interval = setInterval(loadData, 4000);
      return () => clearInterval(interval);
    }
  }, [token]);

  async function loadData() {
    try {
      const [v, b, bal] = await Promise.all([
        ownerService.getVenue(token),
        ownerService.getBookings(token),
        ownerService.getBalance(token),
      ]);
      if (activeToken.current !== token) return;
      setError('');
      setVenue(v);
      setBookings(b);
      setBalance(bal);
    } catch (error) {
      if(activeToken.current === token)setError(errorMessage(error,'Could not load venue data.'));
      // Retain previous data without treating an API failure as an unregistered venue.
    } finally {
      if (activeToken.current === token) setLoading(false);
    }
  }

  const pendingOperations = useRef(new Set<string>());
  async function perform(id: string, action: () => Promise<unknown>, message: string) {
    if (pendingOperations.current.has(id)) return;
    pendingOperations.current.add(id);
    try { await action(); await loadData(); onToast?.('success', 'Venue', message); }
    catch (error) { onToast?.('error', 'Venue', errorMessage(error, 'Could not update this booking.')); }
    finally { pendingOperations.current.delete(id); }
  }
  async function markArrived(id: string) { await perform(id, () => ownerService.markArrived(id, token), 'Player checked in.'); }
  async function collectCash(id: string) { await perform(id, () => ownerService.collectCash(id, token), 'Cash collection saved.'); }
  async function completeBooking(id: string) { await perform(id, () => ownerService.completeBooking(id, token), 'Match completed.'); }

  async function addWalkInBooking(input: WalkInInput): Promise<boolean> {
    try {
      await ownerService.createManualBooking(input, token);
      await loadData();
      onToast?.('success', 'Walk-In Saved', 'Schedule updated.');
      return true;
    } catch (err) {
      onToast?.('error', 'Walk-In Failed', errorMessage(err, 'Could not reserve walk-in.'));
      return false;
    }
  }

  // Calculated Stats
  const todaysMatches = bookings.filter(
    (b) =>
      !['cancelled', 'expired'].includes(b.status) &&
      venueDate(b.startsAt) <= venueDate() &&
      venueDate(new Date(Date.parse(b.endsAt ?? b.startsAt) - 1)) >= venueDate(),
  );
  const cashDueTodayEgp = (
    todaysMatches.reduce((acc, b) => acc + (b.dueAtVenuePiastres ?? 0), 0) / 100
  ).toLocaleString('en-US');
  const releasedBalanceEgp = ((balance.releasedPiastres ?? 0) / 100).toLocaleString('en-US');

  return {
    error,
    venue,
    bookings,
    balance,
    todaysMatches,
    cashDueTodayEgp,
    releasedBalanceEgp,
    loading,
    refreshData: loadData,
    markArrived,
    collectCash,
    completeBooking,
    addWalkInBooking,
  };
}
