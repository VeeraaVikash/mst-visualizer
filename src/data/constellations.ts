export interface ConstellationData {
  name: string;
  nodes: { id: string; x: number; y: number }[];
  mstEdges: { source: string; target: string }[];
}

export const CONSTELLATIONS: ConstellationData[] = [
  {
    name: 'Ursa Major',
    nodes: [
      { id: 'Dubh', x: 85, y: 30 },
      { id: 'Mera', x: 75, y: 45 },
      { id: 'Phec', x: 60, y: 55 },
      { id: 'Megr', x: 50, y: 45 },
      { id: 'Alio', x: 35, y: 45 },
      { id: 'Miza', x: 20, y: 50 },
      { id: 'Alka', x: 5,  y: 60 },
    ],
    mstEdges: [
      { source: 'Dubh', target: 'Mera' },
      { source: 'Mera', target: 'Phec' },
      { source: 'Phec', target: 'Megr' },
      { source: 'Megr', target: 'Dubh' },
      { source: 'Megr', target: 'Alio' },
      { source: 'Alio', target: 'Miza' },
      { source: 'Miza', target: 'Alka' },
    ]
  },
  {
    name: 'Cassiopeia',
    nodes: [
      { id: 'Caph', x: 20, y: 60 },
      { id: 'Sche', x: 35, y: 80 },
      { id: 'Gamm', x: 50, y: 50 },
      { id: 'Ruch', x: 65, y: 75 },
      { id: 'Segi', x: 80, y: 45 },
    ],
    mstEdges: [
      { source: 'Caph', target: 'Sche' },
      { source: 'Sche', target: 'Gamm' },
      { source: 'Gamm', target: 'Ruch' },
      { source: 'Ruch', target: 'Segi' },
    ]
  },
  {
    name: 'Cygnus',
    nodes: [
      { id: 'Dene', x: 50, y: 20 },
      { id: 'Sadr', x: 50, y: 45 },
      { id: 'Gien', x: 25, y: 55 },
      { id: 'Fawa', x: 75, y: 35 },
      { id: 'Albi', x: 50, y: 80 },
    ],
    mstEdges: [
      { source: 'Dene', target: 'Sadr' },
      { source: 'Sadr', target: 'Gien' },
      { source: 'Sadr', target: 'Fawa' },
      { source: 'Sadr', target: 'Albi' },
    ]
  },
  {
    name: 'Orion',
    nodes: [
      { id: 'Bete', x: 30, y: 25 },
      { id: 'Bell', x: 70, y: 20 },
      { id: 'Alnt', x: 35, y: 55 },
      { id: 'Alnl', x: 50, y: 50 },
      { id: 'Mint', x: 65, y: 45 },
      { id: 'Saip', x: 30, y: 85 },
      { id: 'Rige', x: 70, y: 80 },
    ],
    mstEdges: [
      { source: 'Bete', target: 'Alnt' },
      { source: 'Bell', target: 'Mint' },
      { source: 'Alnt', target: 'Alnl' },
      { source: 'Alnl', target: 'Mint' },
      { source: 'Alnt', target: 'Saip' },
      { source: 'Mint', target: 'Rige' },
    ]
  },
  {
    name: 'Scorpius',
    nodes: [
      { id: 'Anta', x: 60, y: 45 },
      { id: 'Graf', x: 40, y: 15 },
      { id: 'Dsch', x: 50, y: 25 },
      { id: 'PiSc', x: 70, y: 20 },
      { id: 'WeiS', x: 65, y: 65 },
      { id: 'Shau', x: 80, y: 90 },
      { id: 'Sarg', x: 90, y: 70 },
    ],
    mstEdges: [
      { source: 'Graf', target: 'Dsch' },
      { source: 'Dsch', target: 'PiSc' },
      { source: 'Dsch', target: 'Anta' },
      { source: 'Anta', target: 'WeiS' },
      { source: 'WeiS', target: 'Sarg' },
      { source: 'Sarg', target: 'Shau' },
    ]
  },
  {
    name: 'Leo',
    nodes: [
      { id: 'Regu', x: 75, y: 75 },
      { id: 'Alge', x: 60, y: 45 },
      { id: 'Adha', x: 40, y: 35 },
      { id: 'Zosm', x: 25, y: 45 },
      { id: 'Dene', x: 15, y: 60 },
      { id: 'Chor', x: 40, y: 70 },
    ],
    mstEdges: [
      { source: 'Regu', target: 'Alge' },
      { source: 'Alge', target: 'Adha' },
      { source: 'Adha', target: 'Zosm' },
      { source: 'Zosm', target: 'Dene' },
      { source: 'Alge', target: 'Chor' },
      { source: 'Chor', target: 'Regu' },
    ]
  },
  {
    name: 'Lyra',
    nodes: [
      { id: 'Vega', x: 50, y: 20 },
      { id: 'Zeta', x: 40, y: 45 },
      { id: 'Sula', x: 60, y: 75 },
      { id: 'Shel', x: 35, y: 70 },
      { id: 'Delt', x: 65, y: 50 },
    ],
    mstEdges: [
      { source: 'Vega', target: 'Zeta' },
      { source: 'Zeta', target: 'Shel' },
      { source: 'Shel', target: 'Sula' },
      { source: 'Sula', target: 'Delt' },
      { source: 'Delt', target: 'Zeta' },
      { source: 'Vega', target: 'Delt' },
    ]
  },
  {
    name: 'Pegasus',
    nodes: [
      { id: 'Mark', x: 30, y: 80 },
      { id: 'Sche', x: 70, y: 70 },
      { id: 'Alge', x: 80, y: 30 },
      { id: 'Alph', x: 40, y: 40 },
      { id: 'Enif', x: 10, y: 50 },
      { id: 'Homa', x: 20, y: 65 },
    ],
    mstEdges: [
      { source: 'Mark', target: 'Sche' },
      { source: 'Sche', target: 'Alge' },
      { source: 'Alge', target: 'Alph' },
      { source: 'Alph', target: 'Mark' },
      { source: 'Mark', target: 'Homa' },
      { source: 'Homa', target: 'Enif' },
    ]
  },
  {
    name: 'Taurus',
    nodes: [
      { id: 'Alde', x: 40, y: 60 },
      { id: 'Elnb', x: 80, y: 30 },
      { id: 'Zeta', x: 75, y: 75 },
      { id: 'Hya1', x: 30, y: 45 },
      { id: 'Hya2', x: 20, y: 55 },
      { id: 'Plei', x: 10, y: 20 },
    ],
    mstEdges: [
      { source: 'Elnb', target: 'Alde' },
      { source: 'Zeta', target: 'Alde' },
      { source: 'Alde', target: 'Hya1' },
      { source: 'Hya1', target: 'Hya2' },
      { source: 'Hya2', target: 'Alde' },
      { source: 'Hya1', target: 'Plei' },
    ]
  },
  {
    name: 'Gemini',
    nodes: [
      { id: 'Cast', x: 25, y: 25 },
      { id: 'Poll', x: 45, y: 20 },
      { id: 'Alhe', x: 60, y: 80 },
      { id: 'Mebs', x: 35, y: 60 },
      { id: 'Wasa', x: 45, y: 55 },
      { id: 'Prop', x: 20, y: 45 },
    ],
    mstEdges: [
      { source: 'Cast', target: 'Prop' },
      { source: 'Prop', target: 'Mebs' },
      { source: 'Poll', target: 'Wasa' },
      { source: 'Wasa', target: 'Alhe' },
      { source: 'Mebs', target: 'Wasa' },
    ]
  },
  {
    name: 'Andromeda',
    nodes: [
      { id: 'Alph', x: 80, y: 70 },
      { id: 'Delt', x: 65, y: 60 },
      { id: 'Mira', x: 50, y: 50 },
      { id: 'Alma', x: 30, y: 35 },
      { id: 'Gamm', x: 10, y: 20 },
    ],
    mstEdges: [
      { source: 'Alph', target: 'Delt' },
      { source: 'Delt', target: 'Mira' },
      { source: 'Mira', target: 'Alma' },
      { source: 'Alma', target: 'Gamm' },
    ]
  },
  {
    name: 'Bootes',
    nodes: [
      { id: 'Arct', x: 50, y: 90 },
      { id: 'Mufd', x: 40, y: 75 },
      { id: 'Izar', x: 30, y: 60 },
      { id: 'Segi', x: 45, y: 40 },
      { id: 'Nekk', x: 65, y: 35 },
      { id: 'Alka', x: 75, y: 55 },
    ],
    mstEdges: [
      { source: 'Arct', target: 'Mufd' },
      { source: 'Mufd', target: 'Izar' },
      { source: 'Izar', target: 'Segi' },
      { source: 'Segi', target: 'Nekk' },
      { source: 'Nekk', target: 'Alka' },
      { source: 'Alka', target: 'Arct' }, // Bootes is a kite shape
    ]
  },
  {
    name: 'Draco',
    nodes: [
      { id: 'Etam', x: 80, y: 20 },
      { id: 'Rast', x: 60, y: 25 },
      { id: 'Alta', x: 50, y: 40 },
      { id: 'Alte', x: 70, y: 55 },
      { id: 'Thub', x: 55, y: 75 },
      { id: 'Edis', x: 35, y: 85 },
      { id: 'Gian', x: 15, y: 70 },
    ],
    mstEdges: [
      { source: 'Etam', target: 'Rast' },
      { source: 'Rast', target: 'Alta' },
      { source: 'Alta', target: 'Alte' },
      { source: 'Alte', target: 'Thub' },
      { source: 'Thub', target: 'Edis' },
      { source: 'Edis', target: 'Gian' },
    ]
  },
  {
    name: 'Crux',
    nodes: [
      { id: 'Acru', x: 50, y: 85 },
      { id: 'Bcru', x: 20, y: 50 },
      { id: 'Gcru', x: 50, y: 15 },
      { id: 'Dcru', x: 80, y: 45 },
      { id: 'Ecru', x: 35, y: 65 },
    ],
    mstEdges: [
      { source: 'Gcru', target: 'Acru' }, // The long cross bar
      { source: 'Dcru', target: 'Bcru' }, // The short cross bar
      { source: 'Bcru', target: 'Ecru' }, // Connect the little star
    ]
  },
  {
    name: 'Sagittarius',
    nodes: [
      { id: 'Kaus', x: 50, y: 80 },
      { id: 'Nunk', x: 75, y: 30 },
      { id: 'Asce', x: 40, y: 60 },
      { id: 'Medi', x: 60, y: 55 },
      { id: 'Bore', x: 80, y: 50 },
      { id: 'Alba', x: 20, y: 40 },
      { id: 'Rukb', x: 45, y: 25 },
    ],
    mstEdges: [
      { source: 'Kaus', target: 'Asce' },
      { source: 'Asce', target: 'Medi' },
      { source: 'Medi', target: 'Bore' },
      { source: 'Bore', target: 'Nunk' },
      { source: 'Nunk', target: 'Rukb' },
      { source: 'Rukb', target: 'Alba' },
      { source: 'Alba', target: 'Asce' }, // Forms the teapot shape loosely
    ]
  }
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

  // Dynamic Radius adjustment: If nodes are very close, shrink them so they don't overlap!
  nodes.forEach(n => {
    let minDist = Infinity;
    nodes.forEach(other => {
      if (n.id === other.id) return;
      const dist = Math.hypot(n.x - other.x, n.y - other.y);
      if (dist < minDist) minDist = dist;
    });
    // If distance is less than 45px (2 * 18px radius + padding), shrink proportionally
    if (minDist < 45) {
      // The tighter they are, the smaller they get. Min radius 8px.
      const safeRadius = Math.max(8, minDist / 2.5);
      n.radius = Math.min(18, safeRadius);
      n.fontSize = Math.max(5, n.radius * 0.55); // Keep text proportional to node size
    }
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
