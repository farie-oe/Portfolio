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
js/apps.js            Project details, Certs, About and Contact windows
js/research.js        Research window: report cards and the in-window detail view
js/networking-data.js Networking content: categories, exercises, topologies, tables
js/networking.js      Networking Labs views shown inside the Projects explorer
js/topology.js        draws a topology as SVG from nodes and links
js/skills.js          Skills window
js/explorer.js        Projects file explorer: folders, subfolders, files, breadcrumbs
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

A project with `kind: 'report'` and a `pdf` appears in the Research window. Without a `pdf` it is
hidden from Research and keeps its simple window in Projects. Optional fields shown only when present:
`docType`, `year`, `goal`, `approach`, `features`, `findings`, `takeaways`, `screens`, `reflection`,
`caveat`, `tags`, `references`. Empty fields produce no section.

## Networking

Everything shown under the Networking Labs folder comes from `js/networking-data.js`. Each exercise holds
its topology (device names, positions and cables read from the original Packet Tracer file), its
tables and a `file` for download. Downloads live in `assets/networking/files/`. The `labs/` folder
is private working material and is listed in `.gitignore`; copy a file into
`assets/networking/files/` only when it should be public. A category appears only when it exists in
the data, and each one appears as a subfolder of the Networking Labs folder in Projects, holding an About file and one file per exercise. There is no Network Investigations item until that material is added.

## Formatting

Prettier with `--single-quote --print-width 100`.
