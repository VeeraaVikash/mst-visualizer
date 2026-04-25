import type { Graph } from '../types';

export interface Scenario {
  id: string; label: string; tagline: string; unit: string;
  unitFull: string; color: string; description: string; graph: Graph;
}

export const SCENARIOS: Record<string, Scenario> = {
  telecom: {
    id:'telecom', label:'Telecom Network', tagline:'Connect cities with minimum fiber cable',
    unit:'km', unitFull:'kilometers of cable', color:'#48bb78',
    description:'Design a fiber-optic backbone connecting cities. The MST finds the minimum total cable required to ensure full connectivity.',
    graph:{
      nodes:[{id:'NYC',x:520,y:130},{id:'BOS',x:620,y:90},{id:'PHI',x:490,y:200},{id:'DC',x:460,y:270},{id:'ATL',x:430,y:400},{id:'CHI',x:260,y:160},{id:'DET',x:310,y:190},{id:'CLV',x:350,y:200},{id:'PIT',x:400,y:240}],
      edges:[
        {id:'e0',source:'NYC',target:'BOS',weight:350},{id:'e1',source:'NYC',target:'PHI',weight:151},
        {id:'e2',source:'PHI',target:'DC',weight:225},{id:'e3',source:'DC',target:'ATL',weight:1092},
        {id:'e4',source:'NYC',target:'CHI',weight:1272},{id:'e5',source:'CHI',target:'DET',weight:459},
        {id:'e6',source:'DET',target:'CLV',weight:169},{id:'e7',source:'CLV',target:'PIT',weight:187},
        {id:'e8',source:'PIT',target:'PHI',weight:445},{id:'e9',source:'PIT',target:'DC',weight:360},
        {id:'e10',source:'CHI',target:'CLV',weight:540},{id:'e11',source:'ATL',target:'PIT',weight:1100},
        {id:'e12',source:'NYC',target:'CLV',weight:790},{id:'e13',source:'BOS',target:'PHI',weight:450}
      ]
    }
  },
  power: {
    id:'power', label:'Power Grid', tagline:'Minimize transmission line cost',
    unit:'MW·km', unitFull:'megawatt-kilometers', color:'#f6ad55',
    description:'Build high-voltage transmission lines between power stations. Minimize total infrastructure while ensuring full grid connectivity.',
    graph:{
      nodes:[{id:'PS1',x:150,y:150},{id:'PS2',x:550,y:120},{id:'S1',x:280,y:200},{id:'S2',x:420,y:180},{id:'S3',x:200,y:350},{id:'S4',x:480,y:340},{id:'C1',x:330,y:290},{id:'C2',x:120,y:440}],
      edges:[
        {id:'e0',source:'PS1',target:'S1',weight:12},{id:'e1',source:'PS2',target:'S2',weight:8},
        {id:'e2',source:'S1',target:'S2',weight:18},{id:'e3',source:'S1',target:'C1',weight:9},
        {id:'e4',source:'S2',target:'C1',weight:11},{id:'e5',source:'S1',target:'S3',weight:21},
        {id:'e6',source:'C1',target:'S3',weight:14},{id:'e7',source:'C1',target:'S4',weight:16},
        {id:'e8',source:'S2',target:'S4',weight:13},{id:'e9',source:'S3',target:'C2',weight:7},
        {id:'e10',source:'S3',target:'S4',weight:25},{id:'e11',source:'PS1',target:'C2',weight:19}
      ]
    }
  },
  roads: {
    id:'roads', label:'Road Network', tagline:'Build minimum-cost road infrastructure',
    unit:'km', unitFull:'kilometers of road', color:'#63b3ed',
    description:'Plan road construction between settlements. Connect all communities with minimum total road distance.',
    graph:{
      nodes:[{id:'A',x:180,y:120},{id:'B',x:380,y:100},{id:'C',x:540,y:180},{id:'D',x:280,y:240},{id:'E',x:460,y:300},{id:'F',x:150,y:350},{id:'G',x:380,y:400},{id:'H',x:560,y:430}],
      edges:[
        {id:'e0',source:'A',target:'B',weight:7},{id:'e1',source:'B',target:'C',weight:8},
        {id:'e2',source:'A',target:'D',weight:5},{id:'e3',source:'B',target:'D',weight:9},
        {id:'e4',source:'C',target:'E',weight:6},{id:'e5',source:'D',target:'E',weight:15},
        {id:'e6',source:'D',target:'F',weight:6},{id:'e7',source:'E',target:'G',weight:11},
        {id:'e8',source:'F',target:'G',weight:4},{id:'e9',source:'G',target:'H',weight:5},
        {id:'e10',source:'E',target:'H',weight:9},{id:'e11',source:'A',target:'F',weight:10},
        {id:'e12',source:'B',target:'E',weight:13}
      ]
    }
  },
  datacenter: {
    id:'datacenter', label:'Data Center Mesh', tagline:'Minimize network latency & cost',
    unit:'ms', unitFull:'milliseconds latency', color:'#fc8181',
    description:'Connect data center nodes with minimum-latency links. The MST builds the optimal low-latency backbone.',
    graph:{
      nodes:[{id:'DC-A',x:160,y:160},{id:'DC-B',x:500,y:140},{id:'DC-C',x:340,y:130},{id:'CDN1',x:200,y:320},{id:'CDN2',x:470,y:330},{id:'EDGE1',x:120,y:440},{id:'EDGE2',x:580,y:430},{id:'HUB',x:330,y:280}],
      edges:[
        {id:'e0',source:'DC-A',target:'DC-C',weight:4},{id:'e1',source:'DC-C',target:'DC-B',weight:6},
        {id:'e2',source:'DC-A',target:'CDN1',weight:8},{id:'e3',source:'DC-B',target:'CDN2',weight:5},
        {id:'e4',source:'DC-C',target:'HUB',weight:3},{id:'e5',source:'HUB',target:'CDN1',weight:7},
        {id:'e6',source:'HUB',target:'CDN2',weight:6},{id:'e7',source:'CDN1',target:'EDGE1',weight:4},
        {id:'e8',source:'CDN2',target:'EDGE2',weight:5},{id:'e9',source:'HUB',target:'EDGE1',weight:11},
        {id:'e10',source:'HUB',target:'EDGE2',weight:9},{id:'e11',source:'DC-A',target:'HUB',weight:12},
        {id:'e12',source:'DC-B',target:'HUB',weight:10}
      ]
    }
  }
};
