import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      
      if (state.isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
    setTheme: (state, action) => {
      state.isDark = action.payload;
      
      if (action.payload) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
    initializeTheme: (state) => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        state.isDark = true;
        document.documentElement.classList.add('dark');
      }
    },
  },
});

export const { toggleTheme, setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;