// tailwind.config.js
export default {
   content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
   theme: {
      extend: {
         colors: {
            causana: {
               light: '#EDE7F6', // Fondo claro principal
               primary: '#9575CD', // Botones, links
               dark: '#7E57C2', // Sidebar, hover
               text: '#333333', // Texto principal
               subtext: '#757575', // Texto secundario
               white: '#FFFFFF', // Tarjetas
            },
         },
      },
   },
   plugins: [],
};
