import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getItemFromStore, setItemToStore } from '@nabcellent/sui-react';

type ThemeState = {
    isDark: boolean;
    isFluid: boolean;
    navbarCollapsed: boolean;
    showBurgerMenu: boolean; // controls showing vertical nav on mobile
    isSidebarCollapsed: boolean; // toggle vertical navbar collapse
};

const initialState: ThemeState = {
    isDark: getItemFromStore('isDark', false),
    isFluid: getItemFromStore('isFluid', false),
    navbarCollapsed: false,
    showBurgerMenu: false,
    isSidebarCollapsed: getItemFromStore('isSidebarCollapsed', false),
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        resetTheme: (state) => {
            localStorage.clear();

            return {
                ...state,
                initialState,
            };
        },
        refreshTheme: (state) => ({ ...state }),
        setTheme: (state, action: PayloadAction<{ key: string; value: string | boolean }>) => {
            if (['isFluid', 'isDark', 'isSidebarCollapsed'].includes(action.payload.key))
                setItemToStore(action.payload.key, String(action.payload.value));

            return {
                ...state,
                [action.payload.key]: action.payload.value,
            };
        },
    },
});

export const { setTheme, resetTheme, refreshTheme } = themeSlice.actions;

export default themeSlice.reducer;
