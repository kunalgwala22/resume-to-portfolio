import { create } from 'zustand';

interface PortfolioState {
  previewScale: number;
  setPreviewScale: (scale: number) => void;
  activeTemplateId: string | null;
  setActiveTemplateId: (id: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  previewScale: 1.0,
  setPreviewScale: (scale) => set({ previewScale: scale }),
  activeTemplateId: null,
  setActiveTemplateId: (id) => set({ activeTemplateId: id })
}));

export default usePortfolioStore;
