# Mafaro's Lab

A portfolio built as a small desktop: windows, a dock, a terminal and a hidden flag hunt.
Plain HTML, CSS and JavaScript with no build step and no dependencies. Open `index.html`
in a browser, or serve the folder with any static host.

## Structure

```
index.html            page shell and script order
css/tokens.css        colours, fonts and spacing variables
css/style.css         all component styles
js/data.js            every piece of content: apps, projects, certs, skills, flags
js/core.js            small shared helpers: event bus, saved state, DOM builder, popup menus
js/windows.js         window manager: open, close, minimise, drag, full size
js/main.js            start-up, desktop icons, dock, clock
js/apps.js            Work details, Certs, About and Contact windows
js/skills.js          Skills window
js/explorer.js        Work file explorer
js/flags.js           flag hunt state and the Flag Hunt panel
js/sky.js             wallpaper stars and clouds, constellation reward
js/terminal-commands.js   the simulated shell: virtual files and every command
js/terminal.js        terminal window, history and tab completion
js/welcome.js         welcome window
js/power.js           loading, log in, sleep, log off and restart screens
js/cat.js             corner cat
```

Scripts share a few globals (`PORTFOLIO`, `h`, `Windows`, `Flags`, ...) and load in the order
listed in `index.html`.

## Editing content

Projects, certificates, skills, the About text and the flags all live in `js/data.js`.
Certificate images go in `assets/certs/`, reports in `assets/work/`.

## Formatting

Prettier with `--single-quote --print-width 100`.
