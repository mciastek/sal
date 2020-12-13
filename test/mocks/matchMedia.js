Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: true,
    media: query,
    onchange: null,
  })),
});

module.exports = window;
