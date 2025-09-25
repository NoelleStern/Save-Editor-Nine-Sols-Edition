# SENSE: Save Editor Nine Sols Edition☀️

## Features and info📌
- Runs in a browser 🌐
- Simple to use field editor ☑️
- Nice-looking modern web interface 🎨
- Compatible with the Steam version of the game 🔥

For non-Steam version of the game check out [Nine Sols Save Editor](https://github.com/jngo102/nine-sols-save-editor). I also took the field info `.json` file directly from there.

## Quick guide📋

1) Please, **make a backup** of your original save file
2) Select or drag'n'drop the save file you want to modify
3) Wait patiently for the file to open, it usually takes a few seconds
4) Modify your save file, <kbd>Ctrl</kbd>+<kbd>F</kbd> is your best friend
5) Download your newly modified save file and enjoy


## Where is the save folder located💾

The default Steam save file location for Windows is:
```
%userprofile%\AppData\LocalLow\RedCandleGames\NineSols
```

## Technical info⚙️

It turned out to be quite a technical challenge to make it all work. The biggest problem was to pack the data back in a way the game can still read it. The game is data marker sensitive and so the usual MessagePack encoding library just wouldn't cut it. MessagePack libraries mostly aim to provide a smaller file size rather than accuracy. I made [rmpp rust crate](https://crates.io/crates/rmpp) and [npm package](https://www.npmjs.com/package/rmpp) specifically to solve this issue.

### How's the data encoded🔣

The save data is stored in a deflated MessagePack-encoded binary file of `.sav`/`.sav.bak` extension. The latter simply being a backup. So the general editing process looks something like: `inflate → decode → edit → encode → deflate`.