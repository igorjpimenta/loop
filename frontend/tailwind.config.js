export default {
  content: ['./src/**/*.tsx', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Inter',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        contentShow: {
          from: {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.8)',
          },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 500ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
