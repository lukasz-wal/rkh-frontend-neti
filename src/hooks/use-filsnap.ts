import { useContext } from 'react';
import { FilsnapContext, FilsnapContextType } from '../providers/filsnap-provider';

export function useFilsnap(): FilsnapContextType {
  const context = useContext(FilsnapContext);
  if (!context) {
    throw new Error('useFilsnap must be used within a FilsnapProvider.');
  }
  return context;
}