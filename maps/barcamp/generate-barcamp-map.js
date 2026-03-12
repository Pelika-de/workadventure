const fs = require('fs');
const path = require('path');

const width = 120;
const height = 80;

const floorData = Array(width * height).fill(1);
const startData = Array(width * height).fill(0);

// Spawn point in the lobby.
const spawnX = 58;
const spawnY = 70;
startData[spawnY * width + spawnX] = 12;

let nextObjectId = 1;

function areaObject({
  x,
  y,
  w,
  h,
  label,
  jitsiRoom,
  trigger,
  openWebsite,
  focusable,
  silent,
  color,
}) {
  const properties = [];

  if (focusable === true) {
    properties.push({ name: 'focusable', type: 'bool', value: true });
  }

  if (jitsiRoom) {
    properties.push({ name: 'jitsiRoom', type: 'string', value: jitsiRoom });
  }

  if (trigger) {
    properties.push({ name: 'jitsiTrigger', type: 'string', value: trigger });
  }

  if (openWebsite) {
    properties.push({ name: 'openWebsite', type: 'string', value: openWebsite });
  }

  if (silent === true) {
    properties.push({ name: 'silent', type: 'bool', value: true });
  }

  const obj = {
    class: 'area',
    height: h,
    id: nextObjectId++,
    name: label,
    rotation: 0,
    visible: true,
    width: w,
    x,
    y,
  };

  if (properties.length > 0) {
    obj.properties = properties;
  }

  if (color) {
    obj.ellipse = false;
  }

  return obj;
}

function textObject({ x, y, text, width = 220, height = 28, size = 18 }) {
  return {
    class: '',
    height,
    id: nextObjectId++,
    name: '',
    rotation: 0,
    text: {
      color: '#111111',
      fontfamily: 'Sans Serif',
      pixelsize: size,
      text,
      wrap: true,
    },
    visible: true,
    width,
    x,
    y,
  };
}

const objects = [];

// Lobby and stage zones.
objects.push(
  areaObject({ x: 896, y: 2080, w: 2048, h: 384, label: 'Lobby', jitsiRoom: 'barcamp-lobby' }),
  textObject({ x: 1720, y: 2230, text: 'LOBBY', width: 320, size: 28 }),

  areaObject({ x: 1536, y: 96, w: 1280, h: 704, label: 'Buhne Keynote', jitsiRoom: 'barcamp-buehne' }),
  textObject({ x: 1870, y: 360, text: 'BUEHNE / KEYNOTE', width: 620, size: 24 })
);

// Garden and lounge.
objects.push(
  areaObject({ x: 96, y: 256, w: 992, h: 864, label: 'Garten', jitsiRoom: 'barcamp-garten' }),
  textObject({ x: 340, y: 640, text: 'GARTEN', width: 360, size: 24 }),

  areaObject({ x: 3072, y: 256, w: 672, h: 864, label: 'Lounge Networking', jitsiRoom: 'barcamp-lounge' }),
  textObject({ x: 3160, y: 640, text: 'LOUNGE / NETWORKING', width: 520, size: 22 })
);

// 10 large rooms (A-D + 6 additional rooms).
const largeRooms = [
  { label: 'Raum A Building Automation', room: 'barcamp-raum-a', x: 96, y: 1344 },
  { label: 'Raum B Connectivity', room: 'barcamp-raum-b', x: 928, y: 1344 },
  { label: 'Raum C Open Topic', room: 'barcamp-raum-c', x: 1760, y: 1344 },
  { label: 'Raum D Workshop', room: 'barcamp-raum-d', x: 2592, y: 1344 },
  { label: 'Raum 5 Data & KI', room: 'barcamp-raum-5', x: 96, y: 2624 },
  { label: 'Raum 6 Future Skills', room: 'barcamp-raum-6', x: 928, y: 2624 },
  { label: 'Raum 7 Leadership', room: 'barcamp-raum-7', x: 1760, y: 2624 },
  { label: 'Raum 8 Community', room: 'barcamp-raum-8', x: 2592, y: 2624 },
  { label: 'Raum 9 Innovation', room: 'barcamp-raum-9', x: 96, y: 3904 },
  { label: 'Raum 10 Hands-on Lab', room: 'barcamp-raum-10', x: 2592, y: 3904 },
];

for (const room of largeRooms) {
  objects.push(
    areaObject({ x: room.x, y: room.y, w: 704, h: 640, label: room.label, jitsiRoom: room.room }),
    textObject({ x: room.x + 56, y: room.y + 280, text: room.label, width: 600, size: 18 })
  );
}

// Central mid rooms to complete the visual grid.
objects.push(
  areaObject({ x: 928, y: 3904, w: 704, h: 640, label: 'Breakout Raum 1', jitsiRoom: 'barcamp-breakout-1', trigger: 'onaction' }),
  areaObject({ x: 1760, y: 3904, w: 704, h: 640, label: 'Breakout Raum 2', jitsiRoom: 'barcamp-breakout-2', trigger: 'onaction' }),
  areaObject({ x: 3072, y: 3904, w: 672, h: 640, label: 'Breakout Raum 3', jitsiRoom: 'barcamp-breakout-3', trigger: 'onaction' }),
  textObject({ x: 1010, y: 4180, text: 'BREAKOUT 1 (on action)', width: 560, size: 16 }),
  textObject({ x: 1840, y: 4180, text: 'BREAKOUT 2 (on action)', width: 560, size: 16 }),
  textObject({ x: 3130, y: 4180, text: 'BREAKOUT 3 (on action)', width: 520, size: 16 })
);

// Spontaneous talks corners (focusable zones without forced room switch).
objects.push(
  areaObject({ x: 3168, y: 1376, w: 480, h: 448, label: 'Spontanes Networking 1', focusable: true }),
  areaObject({ x: 3168, y: 1888, w: 480, h: 448, label: 'Spontanes Networking 2', focusable: true }),
  textObject({ x: 3190, y: 1550, text: 'Spontane Gespraeche', width: 420, size: 16 }),
  textObject({ x: 3190, y: 2060, text: 'Spontane Gespraeche', width: 420, size: 16 })
);

// Posters / links areas.
objects.push(
  areaObject({
    x: 320,
    y: 4880,
    w: 832,
    h: 224,
    label: 'Poster Board 1',
    openWebsite: 'https://workadventu.re/',
    focusable: true,
  }),
  textObject({ x: 390, y: 4960, text: 'Poster: WorkAdventure Infos', width: 700, size: 16 }),

  areaObject({
    x: 1536,
    y: 4880,
    w: 832,
    h: 224,
    label: 'Poster Board 2',
    openWebsite: 'https://github.com/thecodingmachine/workadventure',
    focusable: true,
  }),
  textObject({ x: 1600, y: 4960, text: 'Poster: Docs / Repo', width: 700, size: 16 }),

  areaObject({
    x: 2752,
    y: 4880,
    w: 832,
    h: 224,
    label: 'Poster Board 3',
    openWebsite: 'https://www.youtube.com/results?search_query=workadventure',
    focusable: true,
  }),
  textObject({ x: 2830, y: 4960, text: 'Poster: Video Inspiration', width: 700, size: 16 })
);

// Entry text and guidance.
objects.push(
  textObject({
    x: 1150,
    y: 2320,
    text: 'Virtuelle Barcamp Welt\nLobby -> Buhne, Garten, Lounge, 10 Raeume, Breakouts',
    width: 1600,
    height: 96,
    size: 18,
  })
);

const map = {
  compressionlevel: -1,
  height,
  infinite: false,
  layers: [
    {
      data: floorData,
      height,
      id: 1,
      name: 'floor',
      opacity: 1,
      type: 'tilelayer',
      visible: true,
      width,
      x: 0,
      y: 0,
    },
    {
      data: startData,
      height,
      id: 2,
      name: 'start',
      opacity: 1,
      type: 'tilelayer',
      visible: true,
      width,
      x: 0,
      y: 0,
    },
    {
      draworder: 'topdown',
      id: 3,
      name: 'floorLayer',
      objects,
      opacity: 1,
      type: 'objectgroup',
      visible: true,
      x: 0,
      y: 0,
    },
  ],
  nextlayerid: 4,
  nextobjectid: nextObjectId,
  orientation: 'orthogonal',
  renderorder: 'right-down',
  tiledversion: '1.9.2',
  tileheight: 32,
  tilesets: [
    {
      columns: 11,
      firstgid: 1,
      image: '../assets/tileset1.png',
      imageheight: 352,
      imagewidth: 352,
      margin: 0,
      name: 'tileset1',
      spacing: 0,
      tilecount: 121,
      tileheight: 32,
      tilewidth: 32,
    },
  ],
  tilewidth: 32,
  type: 'map',
  version: '1.9',
  width,
};

const target = path.join(__dirname, 'map.json');
fs.writeFileSync(target, JSON.stringify(map, null, 1) + '\n', 'utf8');
console.log(`Wrote ${target}`);
