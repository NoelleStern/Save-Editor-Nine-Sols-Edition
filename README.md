# SENSE: Save Editor Nine Sols Edition☀️

SENSE is a basic web-based Nine Sols save editor designed to parse, modify, and export game save files directly in your browser 🔥

![Sample screenshot](/public/images/screenshots/wide2.png) <br>
[![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/)
[![PWA](https://img.shields.io/badge/pwa-%235a06c9.svg?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/explore/progressive-web-apps)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)
[![RMPP](https://img.shields.io/badge/RMPP-FC3784.svg?style=for-the-badge&logo=rust&logoColor=white)](https://crates.io/crates/rmpp) <br>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

⚠️ ***CRITICAL WARNING:*** *Always back up your save files before editing them.*

---

## 📌 Features and info
- Runs in a browser 🌐
- Simple to use field editor ☑️
- Nice-looking modern web interface 🎨
- Compatible with the Steam version of the game 🔥

*For non-Steam version of the game check out [Nine Sols Save Editor](https://github.com/jngo102/nine-sols-save-editor). I also took the field info `.json` file directly from there.*

---

## ⚡ Quickstart guide

1) Please, **make a backup** of your original save file
2) Select or drag'n'drop the save file you want to modify
3) Wait patiently for the file to open, it usually takes a few seconds
4) Modify your save file, <kbd>Ctrl</kbd>+<kbd>F</kbd> is your best friend
5) Download your newly modified save file and enjoy

---

## 💾 Where is the save folder located

The default Steam save file location for Windows is:
```
%userprofile%\AppData\LocalLow\RedCandleGames\NineSols
```
For Linux:
```
/home/(username)/.steam/steam/steamapps/compatdata/1809540/pfx/drive_c/users/steamuser/AppData/LocalLow/RedCandleGames/NineSols/
```

---

## ⚙️ Technical info

It turned out to be quite a technical challenge to make it all work. The biggest problem was to pack the data back in a way the game can still read it. The game is data marker sensitive and so the usual MessagePack encoding library just wouldn't cut it. MessagePack libraries mostly aim to provide a smaller file size rather than accuracy. I made [rmpp rust crate](https://crates.io/crates/rmpp) and [npm package](https://www.npmjs.com/package/rmpp) specifically to solve this issue.

### 🔣 How's the data encoded

The save data is stored in a deflated MessagePack-encoded binary file of `.sav`/`.sav.bak` extension. The latter simply being a backup. So the general editing process looks something like: `inflate → decode → edit → encode → deflate`.

### 🚀 Tech stack

* **MessagePack handler:** [a custom Rust WebAssembly NPM package](https://www.npmjs.com/package/rmpp) 💌
* **Frontend:** HTML5, TypeScript, [Svelte](https://svelte.dev/) 🔥
* **Styling:** CSS3, [Tailwind CSS](https://tailwindcss.com/), [Daisy UI](https://daisyui.com/) 🌼