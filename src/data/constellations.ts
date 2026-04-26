export interface ConstellationData {
  name: string;
  nodes: { id: string; x: number; y: number }[];
  mstEdges: { source: string; target: string }[];
}

export const CONSTELLATIONS: ConstellationData[] = [
  {
    name: 'Andromeda',
    nodes: [
      { id: 'And1', x: 30.97, y: -42.33 },
      { id: 'And2', x: 17.43, y: -35.62 },
      { id: 'And3', x: 9.83, y: -30.86 },
      { id: 'And4', x: 2.10, y: -29.09 },
      { id: 'And5', x: 14.30, y: -23.42 },
      { id: 'And6', x: 11.83, y: -24.27 },
      { id: 'And7', x: 9.64, y: -29.31 },
      { id: 'And8', x: 9.22, y: -33.72 },
      { id: 'And9', x: -5.47, y: -43.27 },
      { id: 'And10', x: -14.52, y: -42.33 },
      { id: 'And11', x: -4.90, y: -44.33 },
      { id: 'And12', x: -5.61, y: -46.46 },
      { id: 'And13', x: 14.19, y: -38.50 },
      { id: 'And14', x: 12.45, y: -41.08 },
      { id: 'And15', x: 17.38, y: -47.24 },
      { id: 'And16', x: 24.50, y: -48.63 },
      { id: 'And17', x: -3.49, y: -46.42 },
    ],
    mstEdges: [
      { source: 'And1', target: 'And2' },
      { source: 'And2', target: 'And3' },
      { source: 'And3', target: 'And4' },
      { source: 'And5', target: 'And6' },
      { source: 'And6', target: 'And7' },
      { source: 'And7', target: 'And3' },
      { source: 'And3', target: 'And8' },
      { source: 'And8', target: 'And9' },
      { source: 'And9', target: 'And10' },
      { source: 'And9', target: 'And11' },
      { source: 'And11', target: 'And12' },
      { source: 'And2', target: 'And13' },
      { source: 'And13', target: 'And14' },
      { source: 'And14', target: 'And15' },
      { source: 'And15', target: 'And16' },
      { source: 'And11', target: 'And17' },
    ]
  },
  {
    name: 'Antlia',
    nodes: [
      { id: 'Ant1', x: 142.31, y: 35.95 },
      { id: 'Ant2', x: 156.79, y: 31.07 },
      { id: 'Ant3', x: 164.18, y: 37.14 },
    ],
    mstEdges: [
      { source: 'Ant1', target: 'Ant2' },
      { source: 'Ant2', target: 'Ant3' },
    ]
  },
  {
    name: 'Apus',
    nodes: [
      { id: 'Aps1', x: -138.03, y: 79.04 },
      { id: 'Aps2', x: -114.91, y: 78.70 },
      { id: 'Aps3', x: -109.23, y: 77.52 },
      { id: 'Aps4', x: -111.64, y: 78.90 },
    ],
    mstEdges: [
      { source: 'Aps1', target: 'Aps2' },
      { source: 'Aps2', target: 'Aps3' },
      { source: 'Aps3', target: 'Aps4' },
    ]
  },
  {
    name: 'Aquarius',
    nodes: [
      { id: 'Aqr1', x: -48.08, y: 9.50 },
      { id: 'Aqr2', x: -46.84, y: 8.98 },
      { id: 'Aqr3', x: -37.11, y: 5.57 },
      { id: 'Aqr4', x: -28.55, y: 0.32 },
      { id: 'Aqr5', x: -24.59, y: 1.39 },
      { id: 'Aqr6', x: -22.79, y: 0.02 },
      { id: 'Aqr7', x: -21.16, y: 0.12 },
      { id: 'Aqr8', x: -16.85, y: 7.58 },
      { id: 'Aqr9', x: -10.52, y: 9.18 },
      { id: 'Aqr10', x: -12.64, y: 21.17 },
      { id: 'Aqr11', x: -28.39, y: 13.87 },
      { id: 'Aqr12', x: -25.79, y: 7.78 },
      { id: 'Aqr13', x: -23.68, y: -1.38 },
      { id: 'Aqr14', x: -9.26, y: 20.10 },
      { id: 'Aqr15', x: -4.56, y: 17.82 },
    ],
    mstEdges: [
      { source: 'Aqr1', target: 'Aqr2' },
      { source: 'Aqr2', target: 'Aqr3' },
      { source: 'Aqr3', target: 'Aqr4' },
      { source: 'Aqr4', target: 'Aqr5' },
      { source: 'Aqr5', target: 'Aqr6' },
      { source: 'Aqr6', target: 'Aqr7' },
      { source: 'Aqr7', target: 'Aqr8' },
      { source: 'Aqr8', target: 'Aqr9' },
      { source: 'Aqr9', target: 'Aqr10' },
      { source: 'Aqr3', target: 'Aqr11' },
      { source: 'Aqr4', target: 'Aqr12' },
      { source: 'Aqr6', target: 'Aqr13' },
      { source: 'Aqr14', target: 'Aqr9' },
      { source: 'Aqr9', target: 'Aqr15' },
    ]
  },
  {
    name: 'Aquila',
    nodes: [
      { id: 'Aql1', x: -63.44, y: -10.61 },
      { id: 'Aql2', x: -62.30, y: -8.87 },
      { id: 'Aql3', x: -61.17, y: -6.41 },
      { id: 'Aql4', x: -57.17, y: 0.82 },
      { id: 'Aql5', x: -61.88, y: -1.01 },
      { id: 'Aql6', x: -68.63, y: -3.11 },
      { id: 'Aql7', x: -73.65, y: -13.86 },
      { id: 'Aql8', x: -73.44, y: 4.88 },
    ],
    mstEdges: [
      { source: 'Aql1', target: 'Aql2' },
      { source: 'Aql2', target: 'Aql3' },
      { source: 'Aql3', target: 'Aql4' },
      { source: 'Aql4', target: 'Aql5' },
      { source: 'Aql5', target: 'Aql6' },
      { source: 'Aql6', target: 'Aql7' },
      { source: 'Aql7', target: 'Aql2' },
      { source: 'Aql2', target: 'Aql6' },
      { source: 'Aql6', target: 'Aql8' },
    ]
  },
  {
    name: 'Ara',
    nodes: [
      { id: 'Ara1', x: -98.65, y: 56.38 },
      { id: 'Ara2', x: -97.23, y: 60.68 },
      { id: 'Ara3', x: -107.55, y: 59.04 },
      { id: 'Ara4', x: -105.34, y: 55.99 },
      { id: 'Ara5', x: -105.10, y: 53.16 },
      { id: 'Ara6', x: -97.04, y: 49.88 },
      { id: 'Ara7', x: -98.67, y: 55.53 },
    ],
    mstEdges: [
      { source: 'Ara1', target: 'Ara2' },
      { source: 'Ara2', target: 'Ara3' },
      { source: 'Ara3', target: 'Ara4' },
      { source: 'Ara4', target: 'Ara5' },
      { source: 'Ara5', target: 'Ara6' },
      { source: 'Ara6', target: 'Ara7' },
    ]
  },
  {
    name: 'Aries',
    nodes: [
      { id: 'Ari1', x: 42.50, y: -27.26 },
      { id: 'Ari2', x: 31.79, y: -23.46 },
      { id: 'Ari3', x: 28.66, y: -20.81 },
      { id: 'Ari4', x: 28.38, y: -19.29 },
    ],
    mstEdges: [
      { source: 'Ari1', target: 'Ari2' },
      { source: 'Ari2', target: 'Ari3' },
      { source: 'Ari3', target: 'Ari4' },
    ]
  },
  {
    name: 'Auriga',
    nodes: [
      { id: 'Aur1', x: 89.88, y: -44.95 },
      { id: 'Aur2', x: 79.17, y: -46.00 },
      { id: 'Aur3', x: 76.63, y: -41.23 },
      { id: 'Aur4', x: 74.25, y: -33.17 },
      { id: 'Aur5', x: 81.57, y: -28.61 },
      { id: 'Aur6', x: 89.93, y: -37.21 },
      { id: 'Aur7', x: 89.88, y: -54.28 },
      { id: 'Aur8', x: 75.49, y: -43.82 },
      { id: 'Aur9', x: 75.62, y: -41.08 },
    ],
    mstEdges: [
      { source: 'Aur1', target: 'Aur2' },
      { source: 'Aur2', target: 'Aur3' },
      { source: 'Aur3', target: 'Aur4' },
      { source: 'Aur4', target: 'Aur5' },
      { source: 'Aur5', target: 'Aur6' },
      { source: 'Aur6', target: 'Aur1' },
      { source: 'Aur1', target: 'Aur7' },
      { source: 'Aur7', target: 'Aur2' },
      { source: 'Aur2', target: 'Aur8' },
      { source: 'Aur8', target: 'Aur9' },
    ]
  },
  {
    name: 'Bootes',
    nodes: [
      { id: 'Boo1', x: -153.18, y: -17.46 },
      { id: 'Boo2', x: -151.33, y: -18.40 },
      { id: 'Boo3', x: -146.08, y: -19.18 },
      { id: 'Boo4', x: -142.04, y: -30.37 },
      { id: 'Boo5', x: -141.98, y: -38.31 },
      { id: 'Boo6', x: -134.51, y: -40.39 },
      { id: 'Boo7', x: -131.12, y: -33.31 },
      { id: 'Boo8', x: -138.75, y: -27.07 },
      { id: 'Boo9', x: -139.71, y: -13.73 },
      { id: 'Boo10', x: -145.90, y: -46.09 },
      { id: 'Boo11', x: -146.63, y: -51.79 },
      { id: 'Boo12', x: -143.70, y: -51.85 },
    ],
    mstEdges: [
      { source: 'Boo1', target: 'Boo2' },
      { source: 'Boo2', target: 'Boo3' },
      { source: 'Boo3', target: 'Boo4' },
      { source: 'Boo4', target: 'Boo5' },
      { source: 'Boo5', target: 'Boo6' },
      { source: 'Boo6', target: 'Boo7' },
      { source: 'Boo7', target: 'Boo8' },
      { source: 'Boo8', target: 'Boo3' },
      { source: 'Boo3', target: 'Boo9' },
      { source: 'Boo5', target: 'Boo10' },
      { source: 'Boo10', target: 'Boo11' },
      { source: 'Boo11', target: 'Boo12' },
      { source: 'Boo12', target: 'Boo10' },
    ]
  },
  {
    name: 'Caelum',
    nodes: [
      { id: 'Cae1', x: 67.71, y: 44.95 },
      { id: 'Cae2', x: 70.14, y: 41.86 },
      { id: 'Cae3', x: 70.51, y: 37.14 },
      { id: 'Cae4', x: 76.10, y: 35.48 },
    ],
    mstEdges: [
      { source: 'Cae1', target: 'Cae2' },
      { source: 'Cae2', target: 'Cae3' },
      { source: 'Cae3', target: 'Cae4' },
    ]
  },
  {
    name: 'Camelopardalis',
    nodes: [
      { id: 'Cam1', x: 74.32, y: -53.75 },
      { id: 'Cam2', x: 75.85, y: -60.44 },
      { id: 'Cam3', x: 73.51, y: -66.34 },
      { id: 'Cam4', x: 57.59, y: -71.33 },
      { id: 'Cam5', x: 57.38, y: -65.53 },
      { id: 'Cam6', x: 52.27, y: -59.94 },
      { id: 'Cam7', x: 94.71, y: -69.32 },
      { id: 'Cam8', x: 105.02, y: -76.98 },
    ],
    mstEdges: [
      { source: 'Cam1', target: 'Cam2' },
      { source: 'Cam2', target: 'Cam3' },
      { source: 'Cam3', target: 'Cam4' },
      { source: 'Cam4', target: 'Cam5' },
      { source: 'Cam5', target: 'Cam6' },
      { source: 'Cam3', target: 'Cam7' },
      { source: 'Cam7', target: 'Cam8' },
    ]
  },
  {
    name: 'Cancer',
    nodes: [
      { id: 'Cnc1', x: 134.62, y: -11.86 },
      { id: 'Cnc2', x: 131.17, y: -18.15 },
      { id: 'Cnc3', x: 130.82, y: -21.47 },
      { id: 'Cnc4', x: 131.67, y: -28.77 },
      { id: 'Cnc5', x: 124.13, y: -9.19 },
    ],
    mstEdges: [
      { source: 'Cnc1', target: 'Cnc2' },
      { source: 'Cnc2', target: 'Cnc3' },
      { source: 'Cnc3', target: 'Cnc4' },
      { source: 'Cnc2', target: 'Cnc5' },
    ]
  },
  {
    name: 'Canes Venatici',
    nodes: [
      { id: 'CVn1', x: -166.00, y: -38.31 },
      { id: 'CVn2', x: -171.56, y: -41.36 },
    ],
    mstEdges: [
      { source: 'CVn1', target: 'CVn2' },
    ]
  },
  {
    name: 'Canis Major',
    nodes: [
      { id: 'CMa1', x: 95.67, y: 17.96 },
      { id: 'CMa2', x: 101.29, y: 16.72 },
      { id: 'CMa3', x: 105.76, y: 23.83 },
      { id: 'CMa4', x: 107.10, y: 26.39 },
      { id: 'CMa5', x: 105.43, y: 27.93 },
      { id: 'CMa6', x: 104.66, y: 28.97 },
      { id: 'CMa7', x: 95.08, y: 30.06 },
      { id: 'CMa8', x: 111.02, y: 29.30 },
      { id: 'CMa9', x: 104.03, y: 17.05 },
      { id: 'CMa10', x: 105.94, y: 15.63 },
      { id: 'CMa11', x: 103.55, y: 12.04 },
    ],
    mstEdges: [
      { source: 'CMa1', target: 'CMa2' },
      { source: 'CMa2', target: 'CMa3' },
      { source: 'CMa3', target: 'CMa4' },
      { source: 'CMa4', target: 'CMa5' },
      { source: 'CMa5', target: 'CMa6' },
      { source: 'CMa6', target: 'CMa7' },
      { source: 'CMa8', target: 'CMa4' },
      { source: 'CMa2', target: 'CMa9' },
      { source: 'CMa9', target: 'CMa10' },
      { source: 'CMa10', target: 'CMa11' },
      { source: 'CMa11', target: 'CMa9' },
    ]
  },
  {
    name: 'Canis Minor',
    nodes: [
      { id: 'CMi1', x: 114.83, y: -5.22 },
      { id: 'CMi2', x: 111.79, y: -8.29 },
    ],
    mstEdges: [
      { source: 'CMi1', target: 'CMi2' },
    ]
  },
  {
    name: 'Capricornus',
    nodes: [
      { id: 'Cap1', x: -55.59, y: 12.51 },
      { id: 'Cap2', x: -54.75, y: 14.78 },
      { id: 'Cap3', x: -52.78, y: 17.81 },
      { id: 'Cap4', x: -48.48, y: 25.27 },
      { id: 'Cap5', x: -47.04, y: 26.92 },
      { id: 'Cap6', x: -38.33, y: 22.41 },
      { id: 'Cap7', x: -33.24, y: 16.13 },
      { id: 'Cap8', x: -34.98, y: 16.66 },
      { id: 'Cap9', x: -39.44, y: 16.83 },
      { id: 'Cap10', x: -43.51, y: 17.23 },
    ],
    mstEdges: [
      { source: 'Cap1', target: 'Cap2' },
      { source: 'Cap2', target: 'Cap3' },
      { source: 'Cap3', target: 'Cap4' },
      { source: 'Cap4', target: 'Cap5' },
      { source: 'Cap5', target: 'Cap6' },
      { source: 'Cap6', target: 'Cap7' },
      { source: 'Cap7', target: 'Cap8' },
      { source: 'Cap8', target: 'Cap9' },
      { source: 'Cap9', target: 'Cap10' },
      { source: 'Cap10', target: 'Cap1' },
    ]
  },
  {
    name: 'Carina',
    nodes: [
      { id: 'Car1', x: 99.44, y: 43.20 },
      { id: 'Car2', x: 95.99, y: 52.70 },
      { id: 'Car3', x: 138.30, y: 69.72 },
      { id: 'Car4', x: 153.43, y: 70.04 },
      { id: 'Car5', x: 160.74, y: 64.39 },
      { id: 'Car6', x: 158.01, y: 61.69 },
      { id: 'Car7', x: 154.27, y: 61.33 },
      { id: 'Car8', x: 139.27, y: 59.28 },
      { id: 'Car9', x: 125.63, y: 59.51 },
      { id: 'Car10', x: 119.19, y: 52.98 },
      { id: 'Car11', x: 122.38, y: 47.34 },
      { id: 'Car12', x: 131.18, y: 54.71 },
      { id: 'Car13', x: 166.64, y: 62.42 },
      { id: 'Car14', x: 167.14, y: 61.95 },
      { id: 'Car15', x: 168.15, y: 60.32 },
      { id: 'Car16', x: 167.15, y: 58.98 },
      { id: 'Car17', x: 163.37, y: 58.85 },
    ],
    mstEdges: [
      { source: 'Car1', target: 'Car2' },
      { source: 'Car2', target: 'Car3' },
      { source: 'Car3', target: 'Car4' },
      { source: 'Car4', target: 'Car5' },
      { source: 'Car5', target: 'Car6' },
      { source: 'Car6', target: 'Car7' },
      { source: 'Car7', target: 'Car8' },
      { source: 'Car8', target: 'Car9' },
      { source: 'Car9', target: 'Car10' },
      { source: 'Car10', target: 'Car11' },
      { source: 'Car11', target: 'Car12' },
      { source: 'Car12', target: 'Car8' },
      { source: 'Car5', target: 'Car13' },
      { source: 'Car13', target: 'Car14' },
      { source: 'Car14', target: 'Car15' },
      { source: 'Car15', target: 'Car16' },
      { source: 'Car16', target: 'Car17' },
      { source: 'Car17', target: 'Car6' },
    ]
  },
  {
    name: 'Cassiopeia',
    nodes: [
      { id: 'Cas1', x: 28.60, y: -63.67 },
      { id: 'Cas2', x: 21.45, y: -60.24 },
      { id: 'Cas3', x: 14.18, y: -60.72 },
      { id: 'Cas4', x: 10.13, y: -56.54 },
      { id: 'Cas5', x: 2.29, y: -59.15 },
    ],
    mstEdges: [
      { source: 'Cas1', target: 'Cas2' },
      { source: 'Cas2', target: 'Cas3' },
      { source: 'Cas3', target: 'Cas4' },
      { source: 'Cas4', target: 'Cas5' },
    ]
  },
  {
    name: 'Cepheus',
    nodes: [
      { id: 'Cep1', x: -52.60, y: -62.99 },
      { id: 'Cep2', x: -48.68, y: -61.84 },
      { id: 'Cep3', x: -40.36, y: -62.59 },
      { id: 'Cep4', x: -34.12, y: -58.78 },
      { id: 'Cep5', x: -26.24, y: -57.04 },
      { id: 'Cep6', x: -27.29, y: -58.20 },
      { id: 'Cep7', x: -22.71, y: -58.42 },
      { id: 'Cep8', x: -17.58, y: -66.20 },
      { id: 'Cep9', x: -5.16, y: -77.63 },
      { id: 'Cep10', x: -37.84, y: -70.56 },
    ],
    mstEdges: [
      { source: 'Cep1', target: 'Cep2' },
      { source: 'Cep2', target: 'Cep3' },
      { source: 'Cep3', target: 'Cep4' },
      { source: 'Cep4', target: 'Cep5' },
      { source: 'Cep5', target: 'Cep6' },
      { source: 'Cep6', target: 'Cep7' },
      { source: 'Cep7', target: 'Cep8' },
      { source: 'Cep8', target: 'Cep9' },
      { source: 'Cep9', target: 'Cep10' },
      { source: 'Cep10', target: 'Cep3' },
      { source: 'Cep10', target: 'Cep8' },
    ]
  },
  {
    name: 'Chamaeleon',
    nodes: [
      { id: 'Cha1', x: 484.63, y: 76.92 },
      { id: 'Cha2', x: 518.87, y: 78.61 },
      { id: 'Cha3', x: 521.32, y: 80.47 },
      { id: 'Cha4', x: 184.59, y: 79.31 },
      { id: 'Cha5', x: 539.91, y: 78.22 },
    ],
    mstEdges: [
      { source: 'Cha1', target: 'Cha2' },
      { source: 'Cha2', target: 'Cha3' },
      { source: 'Cha3', target: 'Cha4' },
      { source: 'Cha4', target: 'Cha5' },
      { source: 'Cha5', target: 'Cha2' },
    ]
  },
  {
    name: 'Circinus',
    nodes: [
      { id: 'Cir1', x: -130.62, y: 58.80 },
      { id: 'Cir2', x: -139.37, y: 64.98 },
      { id: 'Cir3', x: -129.16, y: 59.32 },
    ],
    mstEdges: [
      { source: 'Cir1', target: 'Cir2' },
      { source: 'Cir2', target: 'Cir3' },
    ]
  },
  {
    name: 'Columba',
    nodes: [
      { id: 'Col1', x: 95.53, y: 33.44 },
      { id: 'Col2', x: 87.74, y: 35.77 },
      { id: 'Col3', x: 84.91, y: 34.07 },
      { id: 'Col4', x: 82.80, y: 35.47 },
      { id: 'Col5', x: 89.79, y: 42.82 },
    ],
    mstEdges: [
      { source: 'Col1', target: 'Col2' },
      { source: 'Col2', target: 'Col3' },
      { source: 'Col3', target: 'Col4' },
      { source: 'Col2', target: 'Col5' },
    ]
  },
  {
    name: 'Coma Berenices',
    nodes: [
      { id: 'Com1', x: -162.50, y: -17.53 },
      { id: 'Com2', x: -162.03, y: -27.88 },
      { id: 'Com3', x: -173.27, y: -28.27 },
    ],
    mstEdges: [
      { source: 'Com1', target: 'Com2' },
      { source: 'Com2', target: 'Com3' },
    ]
  },
  {
    name: 'Corona Australis',
    nodes: [
      { id: 'CrA1', x: -75.32, y: 37.11 },
      { id: 'CrA2', x: -73.40, y: 37.06 },
      { id: 'CrA3', x: -72.63, y: 37.90 },
      { id: 'CrA4', x: -72.49, y: 39.34 },
      { id: 'CrA5', x: -72.91, y: 40.50 },
      { id: 'CrA6', x: -74.22, y: 42.10 },
      { id: 'CrA7', x: -77.60, y: 43.43 },
      { id: 'CrA8', x: -81.62, y: 42.31 },
    ],
    mstEdges: [
      { source: 'CrA1', target: 'CrA2' },
      { source: 'CrA2', target: 'CrA3' },
      { source: 'CrA3', target: 'CrA4' },
      { source: 'CrA4', target: 'CrA5' },
      { source: 'CrA5', target: 'CrA6' },
      { source: 'CrA6', target: 'CrA7' },
      { source: 'CrA7', target: 'CrA8' },
    ]
  },
  {
    name: 'Corona Borealis',
    nodes: [
      { id: 'CrB1', x: -126.77, y: -31.36 },
      { id: 'CrB2', x: -128.04, y: -29.11 },
      { id: 'CrB3', x: -126.33, y: -26.71 },
      { id: 'CrB4', x: -124.31, y: -26.30 },
      { id: 'CrB5', x: -122.60, y: -26.07 },
      { id: 'CrB6', x: -120.60, y: -26.88 },
      { id: 'CrB7', x: -119.64, y: -29.85 },
    ],
    mstEdges: [
      { source: 'CrB1', target: 'CrB2' },
      { source: 'CrB2', target: 'CrB3' },
      { source: 'CrB3', target: 'CrB4' },
      { source: 'CrB4', target: 'CrB5' },
      { source: 'CrB5', target: 'CrB6' },
      { source: 'CrB6', target: 'CrB7' },
    ]
  },
  {
    name: 'Corvus',
    nodes: [
      { id: 'Crv1', x: -177.90, y: 24.73 },
      { id: 'Crv2', x: -177.47, y: 22.62 },
      { id: 'Crv3', x: -176.05, y: 17.54 },
      { id: 'Crv4', x: -172.53, y: 16.52 },
      { id: 'Crv5', x: -171.40, y: 23.40 },
    ],
    mstEdges: [
      { source: 'Crv1', target: 'Crv2' },
      { source: 'Crv2', target: 'Crv3' },
      { source: 'Crv3', target: 'Crv4' },
      { source: 'Crv4', target: 'Crv5' },
      { source: 'Crv5', target: 'Crv2' },
    ]
  },
  {
    name: 'Crater',
    nodes: [
      { id: 'Crt1', x: 174.17, y: 9.80 },
      { id: 'Crt2', x: 171.15, y: 10.86 },
      { id: 'Crt3', x: 169.84, y: 14.78 },
      { id: 'Crt4', x: 164.94, y: 18.30 },
      { id: 'Crt5', x: 167.91, y: 22.83 },
      { id: 'Crt6', x: 170.84, y: 18.78 },
      { id: 'Crt7', x: 171.22, y: 17.68 },
      { id: 'Crt8', x: 176.19, y: 18.35 },
      { id: 'Crt9', x: 179.00, y: 17.15 },
    ],
    mstEdges: [
      { source: 'Crt1', target: 'Crt2' },
      { source: 'Crt2', target: 'Crt3' },
      { source: 'Crt3', target: 'Crt4' },
      { source: 'Crt4', target: 'Crt5' },
      { source: 'Crt5', target: 'Crt6' },
      { source: 'Crt6', target: 'Crt7' },
      { source: 'Crt7', target: 'Crt8' },
      { source: 'Crt8', target: 'Crt9' },
      { source: 'Crt3', target: 'Crt7' },
    ]
  },
  {
    name: 'Crux',
    nodes: [
      { id: 'Cru1', x: -168.07, y: 59.69 },
      { id: 'Cru2', x: -176.21, y: 58.75 },
      { id: 'Cru3', x: -173.35, y: 63.10 },
      { id: 'Cru4', x: -172.21, y: 57.11 },
    ],
    mstEdges: [
      { source: 'Cru1', target: 'Cru2' },
      { source: 'Cru3', target: 'Cru4' },
    ]
  },
  {
    name: 'Cygnus',
    nodes: [
      { id: 'Cyg1', x: -41.77, y: -30.23 },
      { id: 'Cyg2', x: -48.45, y: -33.97 },
      { id: 'Cyg3', x: -54.44, y: -40.26 },
      { id: 'Cyg4', x: -63.76, y: -45.13 },
      { id: 'Cyg5', x: -67.57, y: -51.73 },
      { id: 'Cyg6', x: -70.72, y: -53.37 },
      { id: 'Cyg7', x: -49.64, y: -45.28 },
      { id: 'Cyg8', x: -60.92, y: -35.08 },
      { id: 'Cyg9', x: -67.32, y: -27.96 },
    ],
    mstEdges: [
      { source: 'Cyg1', target: 'Cyg2' },
      { source: 'Cyg2', target: 'Cyg3' },
      { source: 'Cyg3', target: 'Cyg4' },
      { source: 'Cyg4', target: 'Cyg5' },
      { source: 'Cyg5', target: 'Cyg6' },
      { source: 'Cyg7', target: 'Cyg3' },
      { source: 'Cyg3', target: 'Cyg8' },
      { source: 'Cyg8', target: 'Cyg9' },
    ]
  },
  {
    name: 'Delphinus',
    nodes: [
      { id: 'Del1', x: -51.70, y: -11.30 },
      { id: 'Del2', x: -50.61, y: -14.60 },
      { id: 'Del3', x: -50.09, y: -15.91 },
      { id: 'Del4', x: -48.34, y: -16.12 },
      { id: 'Del5', x: -49.14, y: -15.07 },
    ],
    mstEdges: [
      { source: 'Del1', target: 'Del2' },
      { source: 'Del2', target: 'Del3' },
      { source: 'Del3', target: 'Del4' },
      { source: 'Del4', target: 'Del5' },
      { source: 'Del5', target: 'Del2' },
    ]
  },
  {
    name: 'Dorado',
    nodes: [
      { id: 'Dor1', x: 64.01, y: 51.49 },
      { id: 'Dor2', x: 68.50, y: 55.05 },
      { id: 'Dor3', x: 83.41, y: 62.49 },
      { id: 'Dor4', x: 86.19, y: 65.74 },
      { id: 'Dor5', x: 88.53, y: 63.09 },
      { id: 'Dor6', x: 76.38, y: 57.47 },
    ],
    mstEdges: [
      { source: 'Dor1', target: 'Dor2' },
      { source: 'Dor2', target: 'Dor3' },
      { source: 'Dor3', target: 'Dor4' },
      { source: 'Dor4', target: 'Dor5' },
      { source: 'Dor5', target: 'Dor3' },
      { source: 'Dor3', target: 'Dor6' },
      { source: 'Dor6', target: 'Dor2' },
    ]
  },
  {
    name: 'Draco',
    nodes: [
      { id: 'Dra1', x: 268.38, y: -56.87 },
      { id: 'Dra2', x: 269.15, y: -51.49 },
      { id: 'Dra3', x: 262.61, y: -52.30 },
      { id: 'Dra4', x: 263.07, y: -55.17 },
      { id: 'Dra5', x: 288.14, y: -67.66 },
      { id: 'Dra6', x: 275.19, y: -71.34 },
      { id: 'Dra7', x: 257.20, y: -65.71 },
      { id: 'Dra8', x: 246.00, y: -61.51 },
      { id: 'Dra9', x: 240.47, y: -58.57 },
      { id: 'Dra10', x: 231.23, y: -58.97 },
      { id: 'Dra11', x: 211.10, y: -64.38 },
      { id: 'Dra12', x: 188.37, y: -69.79 },
      { id: 'Dra13', x: 532.85, y: -69.33 },
      { id: 'Dra14', x: 275.26, y: -72.73 },
      { id: 'Dra15', x: 297.04, y: -70.27 },
    ],
    mstEdges: [
      { source: 'Dra1', target: 'Dra2' },
      { source: 'Dra2', target: 'Dra3' },
      { source: 'Dra3', target: 'Dra4' },
      { source: 'Dra4', target: 'Dra1' },
      { source: 'Dra1', target: 'Dra5' },
      { source: 'Dra5', target: 'Dra6' },
      { source: 'Dra6', target: 'Dra7' },
      { source: 'Dra7', target: 'Dra8' },
      { source: 'Dra8', target: 'Dra9' },
      { source: 'Dra9', target: 'Dra10' },
      { source: 'Dra10', target: 'Dra11' },
      { source: 'Dra11', target: 'Dra12' },
      { source: 'Dra12', target: 'Dra13' },
      { source: 'Dra6', target: 'Dra14' },
      { source: 'Dra5', target: 'Dra15' },
    ]
  },
  {
    name: 'Equuleus',
    nodes: [
      { id: 'Equ1', x: -41.04, y: -5.25 },
      { id: 'Equ2', x: -41.38, y: -10.01 },
      { id: 'Equ3', x: -42.41, y: -10.13 },
    ],
    mstEdges: [
      { source: 'Equ1', target: 'Equ2' },
      { source: 'Equ2', target: 'Equ3' },
    ]
  },
  {
    name: 'Fornax',
    nodes: [
      { id: 'For1', x: 48.02, y: 28.99 },
      { id: 'For2', x: 42.27, y: 32.41 },
      { id: 'For3', x: 31.12, y: 29.30 },
    ],
    mstEdges: [
      { source: 'For1', target: 'For2' },
      { source: 'For2', target: 'For3' },
    ]
  },
  {
    name: 'Gemini',
    nodes: [
      { id: 'Gem1', x: 93.72, y: -22.51 },
      { id: 'Gem2', x: 95.74, y: -22.51 },
      { id: 'Gem3', x: 100.98, y: -25.13 },
      { id: 'Gem4', x: 107.78, y: -30.25 },
      { id: 'Gem5', x: 113.65, y: -31.89 },
      { id: 'Gem6', x: 116.33, y: -28.03 },
      { id: 'Gem7', x: 113.98, y: -26.90 },
      { id: 'Gem8', x: 110.03, y: -21.98 },
      { id: 'Gem9', x: 106.03, y: -20.57 },
      { id: 'Gem10', x: 99.43, y: -16.40 },
      { id: 'Gem11', x: 101.32, y: -12.90 },
      { id: 'Gem12', x: 109.52, y: -16.54 },
    ],
    mstEdges: [
      { source: 'Gem1', target: 'Gem2' },
      { source: 'Gem2', target: 'Gem3' },
      { source: 'Gem3', target: 'Gem4' },
      { source: 'Gem4', target: 'Gem5' },
      { source: 'Gem5', target: 'Gem6' },
      { source: 'Gem6', target: 'Gem7' },
      { source: 'Gem7', target: 'Gem8' },
      { source: 'Gem8', target: 'Gem9' },
      { source: 'Gem9', target: 'Gem10' },
      { source: 'Gem10', target: 'Gem11' },
      { source: 'Gem8', target: 'Gem12' },
    ]
  },
  {
    name: 'Grus',
    nodes: [
      { id: 'Gru1', x: -14.78, y: 52.75 },
      { id: 'Gru2', x: -17.86, y: 51.32 },
      { id: 'Gru3', x: -19.33, y: 46.88 },
      { id: 'Gru4', x: -22.56, y: 43.75 },
      { id: 'Gru5', x: -27.94, y: 46.96 },
      { id: 'Gru6', x: -22.68, y: 43.50 },
      { id: 'Gru7', x: -26.10, y: 41.35 },
      { id: 'Gru8', x: -28.47, y: 39.54 },
      { id: 'Gru9', x: -31.52, y: 37.36 },
    ],
    mstEdges: [
      { source: 'Gru1', target: 'Gru2' },
      { source: 'Gru2', target: 'Gru3' },
      { source: 'Gru3', target: 'Gru4' },
      { source: 'Gru4', target: 'Gru5' },
      { source: 'Gru5', target: 'Gru3' },
      { source: 'Gru6', target: 'Gru7' },
      { source: 'Gru7', target: 'Gru8' },
      { source: 'Gru8', target: 'Gru9' },
    ]
  },
  {
    name: 'Horologium',
    nodes: [
      { id: 'Hor1', x: 63.50, y: 42.29 },
      { id: 'Hor2', x: 40.64, y: 50.80 },
      { id: 'Hor3', x: 39.35, y: 52.54 },
      { id: 'Hor4', x: 40.17, y: 54.55 },
      { id: 'Hor5', x: 45.90, y: 59.74 },
      { id: 'Hor6', x: 44.70, y: 64.07 },
    ],
    mstEdges: [
      { source: 'Hor1', target: 'Hor2' },
      { source: 'Hor2', target: 'Hor3' },
      { source: 'Hor3', target: 'Hor4' },
      { source: 'Hor4', target: 'Hor5' },
      { source: 'Hor5', target: 'Hor6' },
    ]
  },
  {
    name: 'Hydrus',
    nodes: [
      { id: 'Hyi1', x: 6.44, y: 77.25 },
      { id: 'Hyi2', x: 56.81, y: 74.24 },
      { id: 'Hyi3', x: 39.90, y: 68.27 },
      { id: 'Hyi4', x: 35.44, y: 68.66 },
      { id: 'Hyi5', x: 28.73, y: 67.65 },
      { id: 'Hyi6', x: 29.69, y: 61.57 },
    ],
    mstEdges: [
      { source: 'Hyi1', target: 'Hyi2' },
      { source: 'Hyi2', target: 'Hyi3' },
      { source: 'Hyi3', target: 'Hyi4' },
      { source: 'Hyi4', target: 'Hyi5' },
      { source: 'Hyi5', target: 'Hyi6' },
    ]
  },
  {
    name: 'Indus',
    nodes: [
      { id: 'Ind1', x: -50.61, y: 47.29 },
      { id: 'Ind2', x: -48.99, y: 51.92 },
      { id: 'Ind3', x: -46.30, y: 58.45 },
      { id: 'Ind4', x: -30.52, y: 54.99 },
      { id: 'Ind5', x: -40.03, y: 53.45 },
    ],
    mstEdges: [
      { source: 'Ind1', target: 'Ind2' },
      { source: 'Ind2', target: 'Ind3' },
      { source: 'Ind3', target: 'Ind4' },
      { source: 'Ind4', target: 'Ind5' },
      { source: 'Ind5', target: 'Ind1' },
    ]
  },
  {
    name: 'Lacerta',
    nodes: [
      { id: 'Lac1', x: -24.11, y: -52.23 },
      { id: 'Lac2', x: -22.18, y: -50.28 },
      { id: 'Lac3', x: -22.62, y: -47.71 },
      { id: 'Lac4', x: -24.74, y: -46.54 },
      { id: 'Lac5', x: -22.38, y: -43.12 },
      { id: 'Lac6', x: -19.87, y: -44.28 },
      { id: 'Lac7', x: -23.87, y: -49.48 },
      { id: 'Lac8', x: -26.53, y: -39.71 },
      { id: 'Lac9', x: -26.01, y: -37.75 },
    ],
    mstEdges: [
      { source: 'Lac1', target: 'Lac2' },
      { source: 'Lac2', target: 'Lac3' },
      { source: 'Lac3', target: 'Lac4' },
      { source: 'Lac4', target: 'Lac5' },
      { source: 'Lac5', target: 'Lac6' },
      { source: 'Lac6', target: 'Lac3' },
      { source: 'Lac3', target: 'Lac7' },
      { source: 'Lac7', target: 'Lac1' },
      { source: 'Lac5', target: 'Lac8' },
      { source: 'Lac8', target: 'Lac9' },
    ]
  },
  {
    name: 'Leo',
    nodes: [
      { id: 'Leo1', x: 152.09, y: -11.97 },
      { id: 'Leo2', x: 151.83, y: -16.76 },
      { id: 'Leo3', x: 154.99, y: -19.84 },
      { id: 'Leo4', x: 168.53, y: -20.52 },
      { id: 'Leo5', x: 177.26, y: -14.57 },
      { id: 'Leo6', x: 168.56, y: -15.43 },
      { id: 'Leo7', x: 154.17, y: -23.42 },
      { id: 'Leo8', x: 148.19, y: -26.01 },
      { id: 'Leo9', x: 146.46, y: -23.77 },
    ],
    mstEdges: [
      { source: 'Leo1', target: 'Leo2' },
      { source: 'Leo2', target: 'Leo3' },
      { source: 'Leo3', target: 'Leo4' },
      { source: 'Leo4', target: 'Leo5' },
      { source: 'Leo5', target: 'Leo6' },
      { source: 'Leo6', target: 'Leo1' },
      { source: 'Leo3', target: 'Leo7' },
      { source: 'Leo7', target: 'Leo8' },
      { source: 'Leo8', target: 'Leo9' },
    ]
  },
  {
    name: 'Leo Minor',
    nodes: [
      { id: 'LMi1', x: 151.86, y: -35.24 },
      { id: 'LMi2', x: 156.48, y: -33.80 },
      { id: 'LMi3', x: 163.33, y: -34.21 },
      { id: 'LMi4', x: 156.97, y: -36.71 },
      { id: 'LMi5', x: 143.56, y: -36.40 },
    ],
    mstEdges: [
      { source: 'LMi1', target: 'LMi2' },
      { source: 'LMi2', target: 'LMi3' },
      { source: 'LMi3', target: 'LMi4' },
      { source: 'LMi4', target: 'LMi1' },
      { source: 'LMi1', target: 'LMi5' },
    ]
  },
  {
    name: 'Lepus',
    nodes: [
      { id: 'Lep1', x: 91.54, y: 14.94 },
      { id: 'Lep2', x: 89.10, y: 14.17 },
      { id: 'Lep3', x: 86.74, y: 14.82 },
      { id: 'Lep4', x: 83.18, y: 17.82 },
      { id: 'Lep5', x: 78.23, y: 16.21 },
      { id: 'Lep6', x: 76.37, y: 22.37 },
      { id: 'Lep7', x: 82.06, y: 20.76 },
      { id: 'Lep8', x: 86.12, y: 22.45 },
      { id: 'Lep9', x: 87.83, y: 20.88 },
      { id: 'Lep10', x: 78.31, y: 12.94 },
      { id: 'Lep11', x: 79.89, y: 13.18 },
    ],
    mstEdges: [
      { source: 'Lep1', target: 'Lep2' },
      { source: 'Lep2', target: 'Lep3' },
      { source: 'Lep3', target: 'Lep4' },
      { source: 'Lep4', target: 'Lep5' },
      { source: 'Lep5', target: 'Lep6' },
      { source: 'Lep6', target: 'Lep7' },
      { source: 'Lep7', target: 'Lep8' },
      { source: 'Lep8', target: 'Lep9' },
      { source: 'Lep10', target: 'Lep5' },
      { source: 'Lep5', target: 'Lep11' },
    ]
  },
  {
    name: 'Libra',
    nodes: [
      { id: 'Lib1', x: -133.98, y: 25.28 },
      { id: 'Lib2', x: -137.28, y: 16.04 },
      { id: 'Lib3', x: -130.75, y: 9.38 },
      { id: 'Lib4', x: -126.12, y: 14.79 },
      { id: 'Lib5', x: -125.74, y: 28.14 },
      { id: 'Lib6', x: -125.34, y: 29.78 },
    ],
    mstEdges: [
      { source: 'Lib1', target: 'Lib2' },
      { source: 'Lib2', target: 'Lib3' },
      { source: 'Lib3', target: 'Lib4' },
      { source: 'Lib4', target: 'Lib5' },
      { source: 'Lib5', target: 'Lib6' },
      { source: 'Lib2', target: 'Lib4' },
    ]
  },
  {
    name: 'Lupus',
    nodes: [
      { id: 'Lup1', x: -122.26, y: 33.63 },
      { id: 'Lup2', x: -125.06, y: 34.41 },
      { id: 'Lup3', x: -129.55, y: 36.26 },
      { id: 'Lup4', x: -129.66, y: 40.65 },
      { id: 'Lup5', x: -135.37, y: 43.13 },
      { id: 'Lup6', x: -139.52, y: 47.39 },
      { id: 'Lup7', x: -131.93, y: 52.10 },
      { id: 'Lup8', x: -130.37, y: 47.88 },
      { id: 'Lup9', x: -129.33, y: 44.69 },
      { id: 'Lup10', x: -126.21, y: 41.17 },
      { id: 'Lup11', x: -119.97, y: 38.40 },
      { id: 'Lup12', x: -118.35, y: 36.80 },
    ],
    mstEdges: [
      { source: 'Lup1', target: 'Lup2' },
      { source: 'Lup2', target: 'Lup3' },
      { source: 'Lup3', target: 'Lup4' },
      { source: 'Lup4', target: 'Lup5' },
      { source: 'Lup5', target: 'Lup6' },
      { source: 'Lup6', target: 'Lup7' },
      { source: 'Lup7', target: 'Lup8' },
      { source: 'Lup8', target: 'Lup9' },
      { source: 'Lup9', target: 'Lup10' },
      { source: 'Lup10', target: 'Lup11' },
      { source: 'Lup11', target: 'Lup12' },
      { source: 'Lup4', target: 'Lup10' },
    ]
  },
  {
    name: 'Lynx',
    nodes: [
      { id: 'Lyn1', x: 94.91, y: -59.01 },
      { id: 'Lyn2', x: 104.32, y: -58.42 },
      { id: 'Lyn3', x: 111.68, y: -49.21 },
      { id: 'Lyn4', x: 125.71, y: -43.19 },
      { id: 'Lyn5', x: 135.16, y: -41.78 },
      { id: 'Lyn6', x: 139.71, y: -36.80 },
      { id: 'Lyn7', x: 140.26, y: -34.39 },
    ],
    mstEdges: [
      { source: 'Lyn1', target: 'Lyn2' },
      { source: 'Lyn2', target: 'Lyn3' },
      { source: 'Lyn3', target: 'Lyn4' },
      { source: 'Lyn4', target: 'Lyn5' },
      { source: 'Lyn5', target: 'Lyn6' },
      { source: 'Lyn6', target: 'Lyn7' },
    ]
  },
  {
    name: 'Lyra',
    nodes: [
      { id: 'Lyr1', x: -78.81, y: -37.61 },
      { id: 'Lyr2', x: -78.91, y: -39.61 },
      { id: 'Lyr3', x: -80.77, y: -38.78 },
      { id: 'Lyr4', x: -76.37, y: -36.90 },
      { id: 'Lyr5', x: -75.26, y: -32.69 },
      { id: 'Lyr6', x: -77.48, y: -33.36 },
    ],
    mstEdges: [
      { source: 'Lyr1', target: 'Lyr2' },
      { source: 'Lyr2', target: 'Lyr3' },
      { source: 'Lyr3', target: 'Lyr1' },
      { source: 'Lyr1', target: 'Lyr4' },
      { source: 'Lyr4', target: 'Lyr5' },
      { source: 'Lyr5', target: 'Lyr6' },
      { source: 'Lyr6', target: 'Lyr1' },
    ]
  },
  {
    name: 'Mensa',
    nodes: [
      { id: 'Men1', x: 92.56, y: 74.75 },
      { id: 'Men2', x: 82.97, y: 76.34 },
      { id: 'Men3', x: 73.80, y: 74.94 },
      { id: 'Men4', x: 75.68, y: 71.31 },
    ],
    mstEdges: [
      { source: 'Men1', target: 'Men2' },
      { source: 'Men2', target: 'Men3' },
      { source: 'Men3', target: 'Men4' },
    ]
  },
  {
    name: 'Microscopium',
    nodes: [
      { id: 'Mic1', x: -47.51, y: 33.78 },
      { id: 'Mic2', x: -47.88, y: 43.99 },
      { id: 'Mic3', x: -39.81, y: 40.81 },
      { id: 'Mic4', x: -40.52, y: 32.17 },
      { id: 'Mic5', x: -44.68, y: 32.26 },
    ],
    mstEdges: [
      { source: 'Mic1', target: 'Mic2' },
      { source: 'Mic2', target: 'Mic3' },
      { source: 'Mic3', target: 'Mic4' },
      { source: 'Mic4', target: 'Mic5' },
      { source: 'Mic5', target: 'Mic1' },
    ]
  },
  {
    name: 'Monoceros',
    nodes: [
      { id: 'Mon1', x: 115.31, y: 9.55 },
      { id: 'Mon2', x: 122.15, y: 2.98 },
      { id: 'Mon3', x: 107.97, y: 0.49 },
      { id: 'Mon4', x: 97.20, y: 7.03 },
      { id: 'Mon5', x: 93.71, y: 6.27 },
      { id: 'Mon6', x: 101.97, y: -2.41 },
      { id: 'Mon7', x: 95.94, y: -4.59 },
      { id: 'Mon8', x: 98.23, y: -7.33 },
      { id: 'Mon9', x: 100.24, y: -9.90 },
    ],
    mstEdges: [
      { source: 'Mon1', target: 'Mon2' },
      { source: 'Mon2', target: 'Mon3' },
      { source: 'Mon3', target: 'Mon4' },
      { source: 'Mon4', target: 'Mon5' },
      { source: 'Mon3', target: 'Mon6' },
      { source: 'Mon6', target: 'Mon7' },
      { source: 'Mon7', target: 'Mon8' },
      { source: 'Mon8', target: 'Mon9' },
    ]
  },
  {
    name: 'Musca',
    nodes: [
      { id: 'Mus1', x: 536.40, y: 66.73 },
      { id: 'Mus2', x: 184.39, y: 67.96 },
      { id: 'Mus3', x: 189.30, y: 69.14 },
      { id: 'Mus4', x: 191.57, y: 68.11 },
      { id: 'Mus5', x: 195.57, y: 71.55 },
      { id: 'Mus6', x: 188.12, y: 72.13 },
    ],
    mstEdges: [
      { source: 'Mus1', target: 'Mus2' },
      { source: 'Mus2', target: 'Mus3' },
      { source: 'Mus3', target: 'Mus4' },
      { source: 'Mus4', target: 'Mus5' },
      { source: 'Mus5', target: 'Mus6' },
      { source: 'Mus6', target: 'Mus3' },
    ]
  },
  {
    name: 'Norma',
    nodes: [
      { id: 'Nor1', x: -118.38, y: 45.17 },
      { id: 'Nor2', x: -113.20, y: 47.55 },
      { id: 'Nor3', x: -115.04, y: 50.16 },
      { id: 'Nor4', x: -119.20, y: 49.23 },
    ],
    mstEdges: [
      { source: 'Nor1', target: 'Nor2' },
      { source: 'Nor2', target: 'Nor3' },
      { source: 'Nor3', target: 'Nor4' },
      { source: 'Nor4', target: 'Nor1' },
    ]
  },
  {
    name: 'Octans',
    nodes: [
      { id: 'Oct1', x: -143.27, y: 83.67 },
      { id: 'Oct2', x: -18.49, y: 81.38 },
      { id: 'Oct3', x: -34.63, y: 77.39 },
    ],
    mstEdges: [
      { source: 'Oct1', target: 'Oct2' },
      { source: 'Oct2', target: 'Oct3' },
      { source: 'Oct3', target: 'Oct1' },
    ]
  },
  {
    name: 'Ophiuchus',
    nodes: [
      { id: 'Oph1', x: -90.24, y: 9.77 },
      { id: 'Oph2', x: -93.03, y: -2.71 },
      { id: 'Oph3', x: -94.13, y: -4.57 },
      { id: 'Oph4', x: -96.27, y: -12.56 },
      { id: 'Oph5', x: -105.58, y: -9.38 },
      { id: 'Oph6', x: -112.27, y: -1.98 },
      { id: 'Oph7', x: -116.41, y: 3.69 },
      { id: 'Oph8', x: -115.42, y: 4.69 },
      { id: 'Oph9', x: -110.71, y: 10.57 },
      { id: 'Oph10', x: -102.41, y: 15.72 },
      { id: 'Oph11', x: -112.22, y: 16.61 },
      { id: 'Oph12', x: -113.24, y: 18.46 },
      { id: 'Oph13', x: -113.97, y: 20.04 },
      { id: 'Oph14', x: -113.60, y: 23.45 },
      { id: 'Oph15', x: -99.50, y: 25.00 },
      { id: 'Oph16', x: -98.16, y: 29.87 },
    ],
    mstEdges: [
      { source: 'Oph1', target: 'Oph2' },
      { source: 'Oph2', target: 'Oph3' },
      { source: 'Oph3', target: 'Oph4' },
      { source: 'Oph4', target: 'Oph5' },
      { source: 'Oph5', target: 'Oph6' },
      { source: 'Oph6', target: 'Oph7' },
      { source: 'Oph7', target: 'Oph8' },
      { source: 'Oph8', target: 'Oph9' },
      { source: 'Oph9', target: 'Oph10' },
      { source: 'Oph5', target: 'Oph9' },
      { source: 'Oph9', target: 'Oph11' },
      { source: 'Oph11', target: 'Oph12' },
      { source: 'Oph12', target: 'Oph13' },
      { source: 'Oph13', target: 'Oph14' },
      { source: 'Oph3', target: 'Oph10' },
      { source: 'Oph10', target: 'Oph15' },
      { source: 'Oph15', target: 'Oph16' },
    ]
  },
  {
    name: 'Orion',
    nodes: [
      { id: 'Ori1', x: 91.89, y: -14.77 },
      { id: 'Ori2', x: 88.60, y: -20.28 },
      { id: 'Ori3', x: 90.98, y: -20.14 },
      { id: 'Ori4', x: 92.98, y: -14.21 },
      { id: 'Ori5', x: 90.60, y: -9.65 },
      { id: 'Ori6', x: 88.79, y: -7.41 },
      { id: 'Ori7', x: 81.28, y: -6.35 },
      { id: 'Ori8', x: 73.72, y: -10.15 },
      { id: 'Ori9', x: 74.64, y: -1.71 },
      { id: 'Ori10', x: 73.56, y: -2.44 },
      { id: 'Ori11', x: 72.80, y: -5.61 },
      { id: 'Ori12', x: 72.46, y: -6.96 },
      { id: 'Ori13', x: 72.65, y: -8.90 },
      { id: 'Ori14', x: 74.09, y: -13.51 },
      { id: 'Ori15', x: 76.14, y: -15.40 },
      { id: 'Ori16', x: 77.42, y: -15.60 },
      { id: 'Ori17', x: 78.63, y: 8.20 },
      { id: 'Ori18', x: 81.12, y: 2.40 },
      { id: 'Ori19', x: 83.00, y: 0.30 },
      { id: 'Ori20', x: 83.78, y: -9.93 },
      { id: 'Ori21', x: 85.19, y: 1.94 },
      { id: 'Ori22', x: 86.94, y: 9.67 },
      { id: 'Ori23', x: 84.05, y: 1.20 },
    ],
    mstEdges: [
      { source: 'Ori1', target: 'Ori2' },
      { source: 'Ori2', target: 'Ori3' },
      { source: 'Ori3', target: 'Ori4' },
      { source: 'Ori4', target: 'Ori5' },
      { source: 'Ori5', target: 'Ori6' },
      { source: 'Ori6', target: 'Ori7' },
      { source: 'Ori7', target: 'Ori8' },
      { source: 'Ori9', target: 'Ori10' },
      { source: 'Ori10', target: 'Ori11' },
      { source: 'Ori11', target: 'Ori12' },
      { source: 'Ori12', target: 'Ori13' },
      { source: 'Ori13', target: 'Ori8' },
      { source: 'Ori8', target: 'Ori14' },
      { source: 'Ori14', target: 'Ori15' },
      { source: 'Ori15', target: 'Ori16' },
      { source: 'Ori17', target: 'Ori18' },
      { source: 'Ori18', target: 'Ori19' },
      { source: 'Ori19', target: 'Ori7' },
      { source: 'Ori7', target: 'Ori20' },
      { source: 'Ori20', target: 'Ori6' },
      { source: 'Ori6', target: 'Ori21' },
      { source: 'Ori21', target: 'Ori22' },
      { source: 'Ori21', target: 'Ori23' },
      { source: 'Ori23', target: 'Ori19' },
    ]
  },
  {
    name: 'Pavo',
    nodes: [
      { id: 'Pav1', x: -53.59, y: 56.74 },
      { id: 'Pav2', x: -48.76, y: 66.20 },
      { id: 'Pav3', x: -57.82, y: 66.18 },
      { id: 'Pav4', x: -76.95, y: 62.19 },
      { id: 'Pav5', x: -84.19, y: 61.49 },
      { id: 'Pav6', x: -87.85, y: 63.67 },
      { id: 'Pav7', x: -93.57, y: 64.72 },
      { id: 'Pav8', x: -79.24, y: 71.43 },
      { id: 'Pav9', x: -59.85, y: 72.91 },
      { id: 'Pav10', x: -38.39, y: 65.37 },
    ],
    mstEdges: [
      { source: 'Pav1', target: 'Pav2' },
      { source: 'Pav2', target: 'Pav3' },
      { source: 'Pav3', target: 'Pav4' },
      { source: 'Pav4', target: 'Pav5' },
      { source: 'Pav5', target: 'Pav6' },
      { source: 'Pav6', target: 'Pav7' },
      { source: 'Pav7', target: 'Pav8' },
      { source: 'Pav8', target: 'Pav9' },
      { source: 'Pav9', target: 'Pav2' },
      { source: 'Pav2', target: 'Pav10' },
    ]
  },
  {
    name: 'Pegasus',
    nodes: [
      { id: 'Peg1', x: -27.50, y: -33.18 },
      { id: 'Peg2', x: -19.25, y: -30.22 },
      { id: 'Peg3', x: -14.06, y: -28.08 },
      { id: 'Peg4', x: 2.10, y: -29.09 },
      { id: 'Peg5', x: 3.31, y: -15.18 },
      { id: 'Peg6', x: -13.81, y: -15.21 },
      { id: 'Peg7', x: -18.33, y: -12.17 },
      { id: 'Peg8', x: -19.63, y: -10.83 },
      { id: 'Peg9', x: -27.45, y: -6.20 },
      { id: 'Peg10', x: -33.95, y: -9.88 },
      { id: 'Peg11', x: -17.50, y: -24.60 },
      { id: 'Peg12', x: -18.37, y: -23.57 },
      { id: 'Peg13', x: -28.25, y: -25.35 },
      { id: 'Peg14', x: -33.84, y: -25.64 },
    ],
    mstEdges: [
      { source: 'Peg1', target: 'Peg2' },
      { source: 'Peg2', target: 'Peg3' },
      { source: 'Peg3', target: 'Peg4' },
      { source: 'Peg4', target: 'Peg5' },
      { source: 'Peg5', target: 'Peg6' },
      { source: 'Peg6', target: 'Peg7' },
      { source: 'Peg7', target: 'Peg8' },
      { source: 'Peg8', target: 'Peg9' },
      { source: 'Peg9', target: 'Peg10' },
      { source: 'Peg6', target: 'Peg3' },
      { source: 'Peg3', target: 'Peg11' },
      { source: 'Peg11', target: 'Peg12' },
      { source: 'Peg12', target: 'Peg13' },
      { source: 'Peg13', target: 'Peg14' },
    ]
  },
  {
    name: 'Perseus',
    nodes: [
      { id: 'Per1', x: 56.08, y: -32.29 },
      { id: 'Per2', x: 58.53, y: -31.88 },
      { id: 'Per3', x: 59.74, y: -35.79 },
      { id: 'Per4', x: 59.46, y: -40.01 },
      { id: 'Per5', x: 56.30, y: -42.58 },
      { id: 'Per6', x: 55.73, y: -47.79 },
      { id: 'Per7', x: 54.12, y: -48.19 },
      { id: 'Per8', x: 51.08, y: -49.86 },
      { id: 'Per9', x: 46.20, y: -53.51 },
      { id: 'Per10', x: 42.67, y: -55.90 },
      { id: 'Per11', x: 43.56, y: -52.76 },
      { id: 'Per12', x: 47.27, y: -49.61 },
      { id: 'Per13', x: 47.37, y: -44.86 },
      { id: 'Per14', x: 47.04, y: -40.96 },
      { id: 'Per15', x: 47.82, y: -39.61 },
      { id: 'Per16', x: 46.29, y: -38.84 },
      { id: 'Per17', x: 44.69, y: -39.66 },
      { id: 'Per18', x: 44.92, y: -41.03 },
      { id: 'Per19', x: 61.65, y: -50.35 },
      { id: 'Per20', x: 63.72, y: -48.41 },
      { id: 'Per21', x: 62.17, y: -47.71 },
      { id: 'Per22', x: 41.05, y: -49.23 },
      { id: 'Per23', x: 25.92, y: -50.69 },
    ],
    mstEdges: [
      { source: 'Per1', target: 'Per2' },
      { source: 'Per2', target: 'Per3' },
      { source: 'Per3', target: 'Per4' },
      { source: 'Per4', target: 'Per5' },
      { source: 'Per5', target: 'Per6' },
      { source: 'Per6', target: 'Per7' },
      { source: 'Per7', target: 'Per8' },
      { source: 'Per8', target: 'Per9' },
      { source: 'Per9', target: 'Per10' },
      { source: 'Per10', target: 'Per11' },
      { source: 'Per11', target: 'Per12' },
      { source: 'Per12', target: 'Per13' },
      { source: 'Per13', target: 'Per14' },
      { source: 'Per14', target: 'Per15' },
      { source: 'Per15', target: 'Per16' },
      { source: 'Per16', target: 'Per17' },
      { source: 'Per17', target: 'Per18' },
      { source: 'Per18', target: 'Per14' },
      { source: 'Per19', target: 'Per20' },
      { source: 'Per20', target: 'Per21' },
      { source: 'Per21', target: 'Per6' },
      { source: 'Per12', target: 'Per22' },
      { source: 'Per22', target: 'Per23' },
    ]
  },
  {
    name: 'Phoenix',
    nodes: [
      { id: 'Phe1', x: 6.57, y: 42.31 },
      { id: 'Phe2', x: 16.52, y: 46.72 },
      { id: 'Phe3', x: 22.09, y: 43.32 },
      { id: 'Phe4', x: 22.81, y: 49.07 },
      { id: 'Phe5', x: 17.10, y: 55.25 },
      { id: 'Phe6', x: 2.35, y: 45.75 },
    ],
    mstEdges: [
      { source: 'Phe1', target: 'Phe2' },
      { source: 'Phe2', target: 'Phe3' },
      { source: 'Phe3', target: 'Phe4' },
      { source: 'Phe4', target: 'Phe5' },
      { source: 'Phe5', target: 'Phe2' },
      { source: 'Phe2', target: 'Phe6' },
      { source: 'Phe6', target: 'Phe1' },
    ]
  },
  {
    name: 'Pictor',
    nodes: [
      { id: 'Pic1', x: 102.05, y: 61.94 },
      { id: 'Pic2', x: 87.46, y: 56.17 },
      { id: 'Pic3', x: 86.82, y: 51.07 },
    ],
    mstEdges: [
      { source: 'Pic1', target: 'Pic2' },
      { source: 'Pic2', target: 'Pic3' },
    ]
  },
  {
    name: 'Pisces',
    nodes: [
      { id: 'Psc1', x: 18.44, y: -24.58 },
      { id: 'Psc2', x: 17.92, y: -30.09 },
      { id: 'Psc3', x: 19.87, y: -27.26 },
      { id: 'Psc4', x: 17.86, y: -21.03 },
      { id: 'Psc5', x: 22.87, y: -15.35 },
      { id: 'Psc6', x: 26.35, y: -9.16 },
      { id: 'Psc7', x: 30.51, y: -2.76 },
      { id: 'Psc8', x: 28.39, y: -3.19 },
      { id: 'Psc9', x: 25.36, y: -5.49 },
      { id: 'Psc10', x: 22.55, y: -6.14 },
      { id: 'Psc11', x: 18.43, y: -7.58 },
      { id: 'Psc12', x: 15.74, y: -7.89 },
      { id: 'Psc13', x: 12.17, y: -7.59 },
      { id: 'Psc14', x: -0.17, y: -6.86 },
      { id: 'Psc15', x: -5.01, y: -5.63 },
      { id: 'Psc16', x: -8.01, y: -6.38 },
      { id: 'Psc17', x: -9.91, y: -5.38 },
      { id: 'Psc18', x: -10.71, y: -3.28 },
      { id: 'Psc19', x: -8.27, y: -1.26 },
      { id: 'Psc20', x: -4.49, y: -1.78 },
      { id: 'Psc21', x: -3.40, y: -3.49 },
      { id: 'Psc22', x: -14.03, y: -3.82 },
    ],
    mstEdges: [
      { source: 'Psc1', target: 'Psc2' },
      { source: 'Psc2', target: 'Psc3' },
      { source: 'Psc3', target: 'Psc1' },
      { source: 'Psc1', target: 'Psc4' },
      { source: 'Psc4', target: 'Psc5' },
      { source: 'Psc5', target: 'Psc6' },
      { source: 'Psc6', target: 'Psc7' },
      { source: 'Psc7', target: 'Psc8' },
      { source: 'Psc8', target: 'Psc9' },
      { source: 'Psc9', target: 'Psc10' },
      { source: 'Psc10', target: 'Psc11' },
      { source: 'Psc11', target: 'Psc12' },
      { source: 'Psc12', target: 'Psc13' },
      { source: 'Psc13', target: 'Psc14' },
      { source: 'Psc14', target: 'Psc15' },
      { source: 'Psc15', target: 'Psc16' },
      { source: 'Psc16', target: 'Psc17' },
      { source: 'Psc17', target: 'Psc18' },
      { source: 'Psc18', target: 'Psc19' },
      { source: 'Psc19', target: 'Psc20' },
      { source: 'Psc20', target: 'Psc21' },
      { source: 'Psc21', target: 'Psc15' },
      { source: 'Psc18', target: 'Psc22' },
    ]
  },
  {
    name: 'Piscis Austrinus',
    nodes: [
      { id: 'PsA1', x: -19.84, y: 27.04 },
      { id: 'PsA2', x: -15.59, y: 29.62 },
      { id: 'PsA3', x: -16.01, y: 32.54 },
      { id: 'PsA4', x: -16.87, y: 32.88 },
      { id: 'PsA5', x: -22.12, y: 32.35 },
      { id: 'PsA6', x: -27.90, y: 32.99 },
      { id: 'PsA7', x: -33.76, y: 33.03 },
      { id: 'PsA8', x: -33.07, y: 30.90 },
    ],
    mstEdges: [
      { source: 'PsA1', target: 'PsA2' },
      { source: 'PsA2', target: 'PsA3' },
      { source: 'PsA3', target: 'PsA4' },
      { source: 'PsA4', target: 'PsA5' },
      { source: 'PsA5', target: 'PsA6' },
      { source: 'PsA6', target: 'PsA7' },
      { source: 'PsA7', target: 'PsA8' },
      { source: 'PsA8', target: 'PsA6' },
      { source: 'PsA6', target: 'PsA1' },
    ]
  },
  {
    name: 'Puppis',
    nodes: [
      { id: 'Pup1', x: 99.44, y: 43.20 },
      { id: 'Pup2', x: 109.29, y: 37.10 },
      { id: 'Pup3', x: 113.85, y: 28.37 },
      { id: 'Pup4', x: 114.71, y: 26.80 },
      { id: 'Pup5', x: 117.32, y: 24.86 },
      { id: 'Pup6', x: 119.21, y: 22.88 },
      { id: 'Pup7', x: 121.89, y: 24.30 },
      { id: 'Pup8', x: 120.90, y: 40.00 },
      { id: 'Pup9', x: 122.38, y: 47.34 },
      { id: 'Pup10', x: 117.02, y: 25.94 },
      { id: 'Pup11', x: 115.95, y: 28.95 },
    ],
    mstEdges: [
      { source: 'Pup1', target: 'Pup2' },
      { source: 'Pup2', target: 'Pup3' },
      { source: 'Pup3', target: 'Pup4' },
      { source: 'Pup4', target: 'Pup5' },
      { source: 'Pup5', target: 'Pup6' },
      { source: 'Pup6', target: 'Pup7' },
      { source: 'Pup7', target: 'Pup8' },
      { source: 'Pup8', target: 'Pup9' },
      { source: 'Pup5', target: 'Pup10' },
      { source: 'Pup10', target: 'Pup11' },
      { source: 'Pup11', target: 'Pup3' },
    ]
  },
  {
    name: 'Pyxis',
    nodes: [
      { id: 'Pyx1', x: 120.90, y: 40.00 },
      { id: 'Pyx2', x: 130.03, y: 35.31 },
      { id: 'Pyx3', x: 130.90, y: 33.19 },
      { id: 'Pyx4', x: 132.63, y: 27.71 },
    ],
    mstEdges: [
      { source: 'Pyx1', target: 'Pyx2' },
      { source: 'Pyx2', target: 'Pyx3' },
      { source: 'Pyx3', target: 'Pyx4' },
    ]
  },
  {
    name: 'Reticulum',
    nodes: [
      { id: 'Ret1', x: 63.61, y: 62.47 },
      { id: 'Ret2', x: 64.12, y: 59.30 },
      { id: 'Ret3', x: 59.69, y: 61.40 },
      { id: 'Ret4', x: 56.05, y: 64.81 },
    ],
    mstEdges: [
      { source: 'Ret1', target: 'Ret2' },
      { source: 'Ret2', target: 'Ret3' },
      { source: 'Ret3', target: 'Ret4' },
      { source: 'Ret4', target: 'Ret1' },
    ]
  },
  {
    name: 'Sagitta',
    nodes: [
      { id: 'Sge1', x: -64.98, y: -18.01 },
      { id: 'Sge2', x: -63.15, y: -18.53 },
      { id: 'Sge3', x: -60.31, y: -19.49 },
      { id: 'Sge4', x: -64.74, y: -17.48 },
    ],
    mstEdges: [
      { source: 'Sge1', target: 'Sge2' },
      { source: 'Sge2', target: 'Sge3' },
      { source: 'Sge4', target: 'Sge2' },
    ]
  },
  {
    name: 'Sagittarius',
    nodes: [
      { id: 'Sgr1', x: -85.59, y: 36.76 },
      { id: 'Sgr2', x: -83.96, y: 34.38 },
      { id: 'Sgr3', x: -84.75, y: 29.83 },
      { id: 'Sgr4', x: -83.01, y: 25.42 },
      { id: 'Sgr5', x: -86.56, y: 21.06 },
      { id: 'Sgr6', x: -69.34, y: 44.46 },
      { id: 'Sgr7', x: -69.03, y: 40.62 },
      { id: 'Sgr8', x: -74.35, y: 29.88 },
      { id: 'Sgr9', x: -78.59, y: 26.99 },
      { id: 'Sgr10', x: -61.18, y: 41.87 },
      { id: 'Sgr11', x: -60.07, y: 35.28 },
      { id: 'Sgr12', x: -61.04, y: 26.30 },
      { id: 'Sgr13', x: -65.82, y: 24.88 },
      { id: 'Sgr14', x: -68.68, y: 24.51 },
      { id: 'Sgr15', x: -71.11, y: 25.26 },
      { id: 'Sgr16', x: -76.18, y: 26.30 },
      { id: 'Sgr17', x: -88.55, y: 30.42 },
      { id: 'Sgr18', x: -73.27, y: 27.67 },
      { id: 'Sgr19', x: -73.83, y: 21.74 },
      { id: 'Sgr20', x: -72.56, y: 21.02 },
      { id: 'Sgr21', x: -70.59, y: 18.95 },
      { id: 'Sgr22', x: -69.58, y: 17.85 },
      { id: 'Sgr23', x: -69.57, y: 15.96 },
      { id: 'Sgr24', x: -75.57, y: 21.11 },
      { id: 'Sgr25', x: -76.46, y: 22.74 },
    ],
    mstEdges: [
      { source: 'Sgr1', target: 'Sgr2' },
      { source: 'Sgr2', target: 'Sgr3' },
      { source: 'Sgr3', target: 'Sgr4' },
      { source: 'Sgr4', target: 'Sgr5' },
      { source: 'Sgr6', target: 'Sgr7' },
      { source: 'Sgr7', target: 'Sgr8' },
      { source: 'Sgr8', target: 'Sgr9' },
      { source: 'Sgr9', target: 'Sgr4' },
      { source: 'Sgr10', target: 'Sgr11' },
      { source: 'Sgr11', target: 'Sgr12' },
      { source: 'Sgr12', target: 'Sgr13' },
      { source: 'Sgr13', target: 'Sgr14' },
      { source: 'Sgr14', target: 'Sgr15' },
      { source: 'Sgr15', target: 'Sgr16' },
      { source: 'Sgr16', target: 'Sgr9' },
      { source: 'Sgr9', target: 'Sgr3' },
      { source: 'Sgr3', target: 'Sgr17' },
      { source: 'Sgr17', target: 'Sgr2' },
      { source: 'Sgr2', target: 'Sgr8' },
      { source: 'Sgr8', target: 'Sgr18' },
      { source: 'Sgr18', target: 'Sgr16' },
      { source: 'Sgr16', target: 'Sgr19' },
      { source: 'Sgr19', target: 'Sgr20' },
      { source: 'Sgr20', target: 'Sgr21' },
      { source: 'Sgr21', target: 'Sgr22' },
      { source: 'Sgr22', target: 'Sgr23' },
      { source: 'Sgr19', target: 'Sgr24' },
      { source: 'Sgr24', target: 'Sgr25' },
      { source: 'Sgr25', target: 'Sgr16' },
    ]
  },
  {
    name: 'Scorpius',
    nodes: [
      { id: 'Sco1', x: -120.29, y: 26.11 },
      { id: 'Sco2', x: -119.92, y: 22.62 },
      { id: 'Sco3', x: -118.64, y: 19.81 },
      { id: 'Sco4', x: -114.70, y: 25.59 },
      { id: 'Sco5', x: -112.65, y: 26.43 },
      { id: 'Sco6', x: -111.03, y: 28.22 },
      { id: 'Sco7', x: -107.46, y: 34.29 },
      { id: 'Sco8', x: -107.03, y: 38.05 },
      { id: 'Sco9', x: -106.35, y: 42.36 },
      { id: 'Sco10', x: -101.96, y: 43.24 },
      { id: 'Sco11', x: -95.67, y: 43.00 },
      { id: 'Sco12', x: -93.10, y: 40.13 },
      { id: 'Sco13', x: -94.38, y: 39.03 },
      { id: 'Sco14', x: -96.60, y: 37.10 },
    ],
    mstEdges: [
      { source: 'Sco1', target: 'Sco2' },
      { source: 'Sco2', target: 'Sco3' },
      { source: 'Sco2', target: 'Sco4' },
      { source: 'Sco4', target: 'Sco5' },
      { source: 'Sco5', target: 'Sco6' },
      { source: 'Sco6', target: 'Sco7' },
      { source: 'Sco7', target: 'Sco8' },
      { source: 'Sco8', target: 'Sco9' },
      { source: 'Sco9', target: 'Sco10' },
      { source: 'Sco10', target: 'Sco11' },
      { source: 'Sco11', target: 'Sco12' },
      { source: 'Sco12', target: 'Sco13' },
      { source: 'Sco13', target: 'Sco14' },
    ]
  },
  {
    name: 'Sculptor',
    nodes: [
      { id: 'Scl1', x: 14.65, y: 29.36 },
      { id: 'Scl2', x: -2.77, y: 28.13 },
      { id: 'Scl3', x: -10.29, y: 32.53 },
      { id: 'Scl4', x: -6.76, y: 37.82 },
    ],
    mstEdges: [
      { source: 'Scl1', target: 'Scl2' },
      { source: 'Scl2', target: 'Scl3' },
      { source: 'Scl3', target: 'Scl4' },
    ]
  },
  {
    name: 'Scutum',
    nodes: [
      { id: 'Sct1', x: -81.20, y: 8.24 },
      { id: 'Sct2', x: -78.21, y: 4.75 },
      { id: 'Sct3', x: -79.43, y: 9.05 },
      { id: 'Sct4', x: -82.70, y: 14.57 },
    ],
    mstEdges: [
      { source: 'Sct1', target: 'Sct2' },
      { source: 'Sct2', target: 'Sct3' },
      { source: 'Sct3', target: 'Sct4' },
      { source: 'Sct4', target: 'Sct1' },
    ]
  },
  {
    name: 'Serpens',
    nodes: [
      { id: 'Ser1', x: -123.45, y: -15.42 },
      { id: 'Ser2', x: -124.61, y: -19.67 },
      { id: 'Ser3', x: -122.82, y: -18.14 },
      { id: 'Ser4', x: -120.89, y: -15.66 },
      { id: 'Ser5', x: -126.30, y: -10.54 },
      { id: 'Ser6', x: -123.93, y: -6.43 },
      { id: 'Ser7', x: -122.30, y: -4.48 },
      { id: 'Ser8', x: -116.41, y: 3.69 },
    ],
    mstEdges: [
      { source: 'Ser1', target: 'Ser2' },
      { source: 'Ser2', target: 'Ser3' },
      { source: 'Ser3', target: 'Ser4' },
      { source: 'Ser4', target: 'Ser1' },
      { source: 'Ser1', target: 'Ser5' },
      { source: 'Ser5', target: 'Ser6' },
      { source: 'Ser6', target: 'Ser7' },
      { source: 'Ser7', target: 'Ser8' },
    ]
  },
  {
    name: 'Serpens',
    nodes: [
      { id: 'Ser1', x: -102.41, y: 15.72 },
      { id: 'Ser2', x: -95.60, y: 15.40 },
      { id: 'Ser3', x: -90.24, y: 9.77 },
      { id: 'Ser4', x: -89.23, y: 8.18 },
      { id: 'Ser5', x: -84.67, y: 2.90 },
      { id: 'Ser6', x: -75.95, y: -4.20 },
    ],
    mstEdges: [
      { source: 'Ser1', target: 'Ser2' },
      { source: 'Ser2', target: 'Ser3' },
      { source: 'Ser3', target: 'Ser4' },
      { source: 'Ser4', target: 'Ser5' },
      { source: 'Ser5', target: 'Ser6' },
    ]
  },
  {
    name: 'Sextans',
    nodes: [
      { id: 'Sex1', x: 151.98, y: 0.37 },
      { id: 'Sex2', x: 148.13, y: 8.11 },
      { id: 'Sex3', x: 157.37, y: 2.74 },
      { id: 'Sex4', x: 157.57, y: 0.64 },
    ],
    mstEdges: [
      { source: 'Sex1', target: 'Sex2' },
      { source: 'Sex2', target: 'Sex3' },
      { source: 'Sex3', target: 'Sex4' },
    ]
  },
  {
    name: 'Taurus',
    nodes: [
      { id: 'Tau1', x: 84.41, y: -21.14 },
      { id: 'Tau2', x: 68.98, y: -16.51 },
      { id: 'Tau3', x: 67.17, y: -15.87 },
      { id: 'Tau4', x: 64.95, y: -15.63 },
      { id: 'Tau5', x: 65.73, y: -17.54 },
      { id: 'Tau6', x: 67.15, y: -19.18 },
      { id: 'Tau7', x: 81.57, y: -28.61 },
      { id: 'Tau8', x: 60.17, y: -12.49 },
      { id: 'Tau9', x: 51.79, y: -9.73 },
      { id: 'Tau10', x: 60.79, y: -5.99 },
      { id: 'Tau11', x: 51.20, y: -9.03 },
      { id: 'Tau12', x: 54.22, y: -0.40 },
    ],
    mstEdges: [
      { source: 'Tau1', target: 'Tau2' },
      { source: 'Tau2', target: 'Tau3' },
      { source: 'Tau3', target: 'Tau4' },
      { source: 'Tau4', target: 'Tau5' },
      { source: 'Tau5', target: 'Tau6' },
      { source: 'Tau6', target: 'Tau7' },
      { source: 'Tau4', target: 'Tau8' },
      { source: 'Tau8', target: 'Tau9' },
      { source: 'Tau9', target: 'Tau10' },
      { source: 'Tau9', target: 'Tau11' },
      { source: 'Tau11', target: 'Tau12' },
    ]
  },
  {
    name: 'Telescopium',
    nodes: [
      { id: 'Tel1', x: -87.19, y: 45.95 },
      { id: 'Tel2', x: -83.26, y: 45.97 },
      { id: 'Tel3', x: -82.79, y: 49.07 },
    ],
    mstEdges: [
      { source: 'Tel1', target: 'Tel2' },
      { source: 'Tel2', target: 'Tel3' },
    ]
  },
  {
    name: 'Triangulum',
    nodes: [
      { id: 'Tri1', x: 28.27, y: -29.58 },
      { id: 'Tri2', x: 32.39, y: -34.99 },
      { id: 'Tri3', x: 34.33, y: -33.85 },
    ],
    mstEdges: [
      { source: 'Tri1', target: 'Tri2' },
      { source: 'Tri2', target: 'Tri3' },
      { source: 'Tri3', target: 'Tri1' },
    ]
  },
  {
    name: 'Triangulum Australe',
    nodes: [
      { id: 'TrA1', x: -107.83, y: 69.03 },
      { id: 'TrA2', x: -121.21, y: 63.43 },
      { id: 'TrA3', x: -130.27, y: 68.68 },
    ],
    mstEdges: [
      { source: 'TrA1', target: 'TrA2' },
      { source: 'TrA2', target: 'TrA3' },
      { source: 'TrA3', target: 'TrA1' },
    ]
  },
  {
    name: 'Tucana',
    nodes: [
      { id: 'Tuc1', x: -25.37, y: 60.26 },
      { id: 'Tuc2', x: -10.64, y: 58.24 },
      { id: 'Tuc3', x: 7.89, y: 62.96 },
      { id: 'Tuc4', x: 5.02, y: 64.87 },
      { id: 'Tuc5', x: -0.02, y: 65.58 },
      { id: 'Tuc6', x: -23.17, y: 64.97 },
    ],
    mstEdges: [
      { source: 'Tuc1', target: 'Tuc2' },
      { source: 'Tuc2', target: 'Tuc3' },
      { source: 'Tuc3', target: 'Tuc4' },
      { source: 'Tuc4', target: 'Tuc5' },
      { source: 'Tuc5', target: 'Tuc6' },
      { source: 'Tuc6', target: 'Tuc1' },
    ]
  },
  {
    name: 'Ursa Major',
    nodes: [
      { id: 'UMa1', x: 183.86, y: -57.03 },
      { id: 'UMa2', x: 525.93, y: -61.75 },
      { id: 'UMa3', x: 525.46, y: -56.38 },
      { id: 'UMa4', x: 538.46, y: -53.69 },
      { id: 'UMa5', x: 193.51, y: -55.96 },
      { id: 'UMa6', x: 200.98, y: -54.93 },
      { id: 'UMa7', x: 206.89, y: -49.31 },
      { id: 'UMa8', x: 536.51, y: -47.78 },
      { id: 'UMa9', x: 529.62, y: -33.09 },
      { id: 'UMa10', x: 529.55, y: -31.53 },
      { id: 'UMa11', x: 527.42, y: -44.50 },
      { id: 'UMa12', x: 515.58, y: -41.50 },
      { id: 'UMa13', x: 514.27, y: -42.91 },
      { id: 'UMa14', x: 502.88, y: -63.06 },
      { id: 'UMa15', x: 487.57, y: -60.72 },
      { id: 'UMa16', x: 507.75, y: -59.04 },
      { id: 'UMa17', x: 508.03, y: -54.06 },
      { id: 'UMa18', x: 503.21, y: -51.68 },
      { id: 'UMa19', x: 494.80, y: -48.04 },
      { id: 'UMa20', x: 495.91, y: -47.16 },
    ],
    mstEdges: [
      { source: 'UMa1', target: 'UMa2' },
      { source: 'UMa2', target: 'UMa3' },
      { source: 'UMa3', target: 'UMa4' },
      { source: 'UMa4', target: 'UMa1' },
      { source: 'UMa1', target: 'UMa5' },
      { source: 'UMa5', target: 'UMa6' },
      { source: 'UMa6', target: 'UMa7' },
      { source: 'UMa4', target: 'UMa8' },
      { source: 'UMa8', target: 'UMa9' },
      { source: 'UMa9', target: 'UMa10' },
      { source: 'UMa8', target: 'UMa11' },
      { source: 'UMa11', target: 'UMa12' },
      { source: 'UMa11', target: 'UMa13' },
      { source: 'UMa2', target: 'UMa14' },
      { source: 'UMa14', target: 'UMa15' },
      { source: 'UMa15', target: 'UMa16' },
      { source: 'UMa16', target: 'UMa3' },
      { source: 'UMa3', target: 'UMa17' },
      { source: 'UMa17', target: 'UMa18' },
      { source: 'UMa18', target: 'UMa19' },
      { source: 'UMa20', target: 'UMa18' },
    ]
  },
  {
    name: 'Ursa Minor',
    nodes: [
      { id: 'UMi1', x: -123.99, y: -77.79 },
      { id: 'UMi2', x: -115.62, y: -75.76 },
      { id: 'UMi3', x: -129.82, y: -71.83 },
      { id: 'UMi4', x: -137.32, y: -74.16 },
      { id: 'UMi5', x: -108.51, y: -82.04 },
      { id: 'UMi6', x: -96.95, y: -86.59 },
      { id: 'UMi7', x: 37.95, y: -89.26 },
    ],
    mstEdges: [
      { source: 'UMi1', target: 'UMi2' },
      { source: 'UMi2', target: 'UMi3' },
      { source: 'UMi3', target: 'UMi4' },
      { source: 'UMi4', target: 'UMi1' },
      { source: 'UMi1', target: 'UMi5' },
      { source: 'UMi5', target: 'UMi6' },
      { source: 'UMi6', target: 'UMi7' },
    ]
  },
  {
    name: 'Vela',
    nodes: [
      { id: 'Vel1', x: 131.18, y: 54.71 },
      { id: 'Vel2', x: 140.53, y: 55.01 },
      { id: 'Vel3', x: 149.22, y: 54.57 },
      { id: 'Vel4', x: 161.69, y: 49.42 },
      { id: 'Vel5', x: 153.68, y: 42.12 },
      { id: 'Vel6', x: 142.68, y: 40.47 },
      { id: 'Vel7', x: 137.00, y: 43.43 },
      { id: 'Vel8', x: 122.38, y: 47.34 },
    ],
    mstEdges: [
      { source: 'Vel1', target: 'Vel2' },
      { source: 'Vel2', target: 'Vel3' },
      { source: 'Vel3', target: 'Vel4' },
      { source: 'Vel4', target: 'Vel5' },
      { source: 'Vel5', target: 'Vel6' },
      { source: 'Vel6', target: 'Vel7' },
      { source: 'Vel7', target: 'Vel8' },
    ]
  },
  {
    name: 'Volans',
    nodes: [
      { id: 'Vol1', x: 135.61, y: 66.40 },
      { id: 'Vol2', x: 126.43, y: 66.14 },
      { id: 'Vol3', x: 121.98, y: 68.62 },
      { id: 'Vol4', x: 109.21, y: 67.96 },
      { id: 'Vol5', x: 107.19, y: 70.50 },
    ],
    mstEdges: [
      { source: 'Vol1', target: 'Vol2' },
      { source: 'Vol2', target: 'Vol3' },
      { source: 'Vol3', target: 'Vol4' },
      { source: 'Vol4', target: 'Vol5' },
      { source: 'Vol5', target: 'Vol3' },
      { source: 'Vol3', target: 'Vol1' },
    ]
  },
  {
    name: 'Vulpecula',
    nodes: [
      { id: 'Vul1', x: -70.95, y: -21.39 },
      { id: 'Vul2', x: -67.82, y: -24.66 },
      { id: 'Vul3', x: -61.63, y: -24.08 },
      { id: 'Vul4', x: -59.72, y: -27.75 },
      { id: 'Vul5', x: -56.06, y: -27.81 },
    ],
    mstEdges: [
      { source: 'Vul1', target: 'Vul2' },
      { source: 'Vul2', target: 'Vul3' },
      { source: 'Vul3', target: 'Vul4' },
      { source: 'Vul4', target: 'Vul5' },
    ]
  },
];

export function getConstellationGraph(index: number) {
  const data = CONSTELLATIONS[index % CONSTELLATIONS.length];
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  data.nodes.forEach(n => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const scale = Math.min(220 / rangeX, 220 / rangeY);
  
  const nodes = data.nodes.map(n => ({
    id: n.id,
    x: 200 + (n.x - (minX + maxX) / 2) * scale,
    y: 180 + (n.y - (minY + maxY) / 2) * scale,
    radius: 18,
    fontSize: 10,
  }));

  // Physics relaxation: push nodes apart with a cooling factor
  let alpha = 1.0;
  for (let iter = 0; iter < 150; iter++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let dist = Math.hypot(dx, dy);
        
        // Jitter if exactly overlapping
        if (dist === 0) {
          dx = (Math.random() - 0.5) * 2;
          dy = (Math.random() - 0.5) * 2;
          dist = Math.hypot(dx, dy);
        }

        const minDesired = 55; // Minimum 55px distance for nice spacing
        if (dist < minDesired) {
          const push = ((minDesired - dist) / 2) * alpha;
          const nx = (dx / dist) * push;
          const ny = (dy / dist) * push;
          nodes[i].x += nx;
          nodes[i].y += ny;
          nodes[j].x -= nx;
          nodes[j].y -= ny;
          moved = true;
        }
      }
    }
    alpha *= 0.95; // Cool down
    if (!moved) break;
  }

  // After pushing apart, recenter to stay precisely in viewport
  let newMinX = Infinity, newMaxX = -Infinity, newMinY = Infinity, newMaxY = -Infinity;
  nodes.forEach(n => {
    if (n.x < newMinX) newMinX = n.x;
    if (n.x > newMaxX) newMaxX = n.x;
    if (n.y < newMinY) newMinY = n.y;
    if (n.y > newMaxY) newMaxY = n.y;
  });
  
  const currentCenterX = (newMinX + newMaxX) / 2;
  const currentCenterY = (newMinY + newMaxY) / 2;
  const offsetX = 200 - currentCenterX;
  const offsetY = 180 - currentCenterY;

  nodes.forEach(n => {
    n.x += offsetX;
    n.y += offsetY;
    n.radius = 18; // Keep them nice and big
    n.fontSize = 9; // Slightly smaller font so it fits the circle well
  });

  const edges: { source: string; target: string; weight: number }[] = [];
  
  for (let i = 0; i < nodes.length; i++) {
    const distances = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      distances.push({ target: nodes[j].id, dist: Math.sqrt(dx*dx + dy*dy) });
    }
    distances.sort((a, b) => a.dist - b.dist);
    distances.slice(0, 2).forEach(d => {
      const s = nodes[i].id;
      const t = d.target;
      const exists = edges.some(e => (e.source === s && e.target === t) || (e.source === t && e.target === s));
      if (!exists) {
        edges.push({ source: s, target: t, weight: 1 });
      }
    });
  }

  data.mstEdges.forEach(mstE => {
    const exists = edges.some(e => (e.source === mstE.source && e.target === mstE.target) || (e.source === mstE.target && e.target === mstE.source));
    if (!exists) {
       edges.push({ source: mstE.source, target: mstE.target, weight: 1 });
    }
  });

  return { name: data.name, nodes, edges, mstEdges: data.mstEdges };
}
