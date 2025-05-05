import { useEffect } from "react";

type TUseClose = {
  isOpen: boolean;  
  rootRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  onChange: (newValue: boolean) => void;
};

export function useCloseModal({ isOpen, rootRef, onClose, onChange }: TUseClose) {
  useEffect(() => {
    if (!isOpen) return;

		// Закрытие формы по нажатию клавиши Esc
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				isOpen && onClose();
        onChange?.(false);
			}
		};
    // Закрытие формы по клику вне её
    const handleClickOutside = (event: MouseEvent) => {
			const { target } = event;
			if (target instanceof Node && !rootRef.current?.contains(target)) {
				isOpen && onClose?.();
				onChange?.(false);
			}
		};

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, rootRef]);
}
