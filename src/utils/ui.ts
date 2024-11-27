type DebouncedFunction<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  leading: boolean = false
): DebouncedFunction<T> {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (leading && !timeout) {
      func(...args);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (!leading) {
        func(...args);
      }
    }, wait);
  };

  // Add a cancel method to clear the timeout
  debounced.cancel = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
