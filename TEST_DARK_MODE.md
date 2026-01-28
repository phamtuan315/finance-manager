# Test Dark Mode

## Bước 1: Hard Refresh Browser
- **Windows/Linux**: `Ctrl + Shift + R` hoặc `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

## Bước 2: Mở Developer Console
- Nhấn `F12`
- Vào tab Console

## Bước 3: Test Theme Toggle

Paste code này vào Console và Enter:

```javascript
// Check if theme is working
console.log('Current theme:', localStorage.getItem('theme'));
console.log('HTML classes:', document.documentElement.classList);

// Manually toggle
const html = document.documentElement;
if (html.classList.contains('dark')) {
  html.classList.remove('dark');
  html.classList.add('light');
  console.log('Switched to light mode');
} else {
  html.classList.remove('light');
  html.classList.add('dark');
  console.log('Switched to dark mode');
}
```

## Bước 4: Check Elements

Inspect một element và xem classes của nó:

```javascript
// Check if dark mode classes exist
const element = document.querySelector('.bg-white');
console.log('Element classes:', element?.className);
```

## Nếu vẫn không hoạt động:

### Solution 1: Clear Cache
1. Mở DevTools (F12)
2. Right click vào Refresh button
3. Chọn "Empty Cache and Hard Reload"

### Solution 2: Check Tailwind Config
```bash
cd finance-manager
cat tailwind.config.js
```

Phải có dòng:
```javascript
darkMode: 'class',
```

### Solution 3: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Debug Commands

```javascript
// Check ThemeContext
window.localStorage.getItem('theme')

// Check HTML class
document.documentElement.className

// Force dark mode
document.documentElement.classList.add('dark')
document.documentElement.classList.remove('light')

// Force light mode
document.documentElement.classList.add('light')
document.documentElement.classList.remove('dark')
```
