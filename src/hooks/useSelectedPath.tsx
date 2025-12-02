import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type SelectedPathContextType = {
  selectedPath: string | null;
  setSelectedPath: (path: string | null) => void;
  clearSelectedPath: () => void;
};

const SelectedPathContext = createContext<SelectedPathContextType | undefined>(
  undefined
);

const STORAGE_KEY = "selectedPath";

export const SelectedPathProvider = ({
  children,
  initialPath = null,
}: {
  children: ReactNode;
  initialPath?: string | null;
}) => {
  const getInitial = () => {
    try {
      if (typeof window === "undefined") return initialPath;
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ?? initialPath;
    } catch {
      return initialPath;
    }
  };

  const [selectedPath, setSelectedPath] = useState<string | null>(getInitial);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (selectedPath === null) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, selectedPath);
      }
    } catch {
      // ignore storage errors
    }
  }, [selectedPath]);

  const clearSelectedPath = () => setSelectedPath(null);

  return (
    <SelectedPathContext.Provider
      value={{ selectedPath, setSelectedPath, clearSelectedPath }}
    >
      {children}
    </SelectedPathContext.Provider>
  );
};

export const useSelectedPath = (): SelectedPathContextType => {
  const ctx = useContext(SelectedPathContext);
  if (!ctx) {
    throw new Error(
      "useSelectedPath must be used within a SelectedPathProvider"
    );
  }
  return ctx;
};
