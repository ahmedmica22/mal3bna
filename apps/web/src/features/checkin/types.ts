export interface CheckInData {
  id: string;
  bookingCode: string;
  status: string;
  customerName: string | null;
  customerPhone: string | null;
  startsAt: string;
  endsAt: string;
  courtName: string;
  venueName: string;
  dueAtVenuePiastres: number;
  alreadyArrived?: boolean;
}

export interface CheckInContentProps {
  loading: boolean;
  error: string | null;
  data: CheckInData | null;
  formattedTime: string;
  translate: (key: string) => string;
}
