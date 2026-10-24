import '@testing-library/jest-dom/vitest'

// jsdom không có canvas: trả null để các component vẽ canvas tự bỏ qua, không in lỗi "Not implemented"
HTMLCanvasElement.prototype.getContext = () => null
