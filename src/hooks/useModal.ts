import { useState, useCallback } from 'react';

interface UseModalResult<T = any> {
  isOpen: boolean;
  modalData: T | null;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
}

export const useModal = <T = any>(): UseModalResult<T> => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<T | null>(null);

  const open = useCallback((data?: T) => {
    if (data !== undefined) {
      setModalData(data);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    modalData,
    open,
    close,
    toggle,
  };
};