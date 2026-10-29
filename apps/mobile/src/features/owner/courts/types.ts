import type { useAddCourtModal } from './hooks/useAddCourtModal';
export type AddCourtModalContentProps = Extract<
  ReturnType<typeof useAddCourtModal>,
  { view: 'Content' }
>['props'];
