const dark = '#000';
const light = '#FFF';

export const isEnabledDarkMode = true;
export const color = {
    primary: isEnabledDarkMode? dark: light,
    secondary: isEnabledDarkMode? light: dark,
    modal: '#1C1C1D',
    warning: '#DEAF05',
    charcoal: '#1C1C1E',
}
