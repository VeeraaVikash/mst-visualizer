import type { Graph } from '../types';

export interface Scenario {
  id: string; label: string; tagline: string; unit: string;
  unitFull: string; color: string; description: string; graph: Graph;
  layoutType: 'force' | 'hierarchical' | 'geographic';
}

export const SCENARIOS: Record<string, Scenario> = {
  telecom: {
    id:'telecom', label:'Global Internet Backbone', tagline:'Connect major global cities with minimum submarine cable',
    unit:'km', unitFull:'kilometers of cable', color:'#48bb78',
    description:'Design a submarine fiber-optic backbone connecting global hubs. The MST finds the minimum total cable required to ensure global connectivity.',
    layoutType: 'geographic',
    graph:{
      nodes:[{id:'SFO',x:80,y:180},{id:'NYC',x:260,y:160},{id:'LON',x:440,y:140},{id:'PAR',x:460,y:180},{id:'FRA',x:500,y:150},{id:'DXB',x:580,y:260},{id:'BOM',x:660,y:280},{id:'SIN',x:740,y:340},{id:'TYO',x:820,y:200},{id:'SYD',x:840,y:420}],
      edges:[
        {id:'e0',source:'SFO',target:'NYC',weight:4130},{id:'e1',source:'NYC',target:'LON',weight:5560},
        {id:'e2',source:'LON',target:'PAR',weight:340},{id:'e3',source:'LON',target:'FRA',weight:630},
        {id:'e4',source:'PAR',target:'FRA',weight:480},{id:'e5',source:'FRA',target:'DXB',weight:4840},
        {id:'e6',source:'DXB',target:'BOM',weight:1920},{id:'e7',source:'BOM',target:'SIN',weight:3900},
        {id:'e8',source:'SIN',target:'TYO',weight:5300},{id:'e9',source:'SIN',target:'SYD',weight:6300},
        {id:'e10',source:'SFO',target:'TYO',weight:8280},{id:'e11',source:'NYC',target:'FRA',weight:6200},
        {id:'e12',source:'PAR',target:'DXB',weight:5200},{id:'e13',source:'TYO',target:'SYD',weight:7800}
      ]
    }
  },
  power: {
    id:'power', label:'Regional Power Grid', tagline:'Minimize high-voltage transmission lines',
    unit:'mi', unitFull:'miles of line', color:'#f6ad55',
    description:'Build high-voltage transmission lines between power stations and substations. Minimize total infrastructure while ensuring grid stability.',
    layoutType: 'force',
    graph:{
      nodes:[{id:'Plant-N',x:350,y:80},{id:'Plant-S',x:400,y:400},{id:'Sub-A',x:200,y:180},{id:'Sub-B',x:500,y:160},{id:'Sub-C',x:250,y:300},{id:'Sub-D',x:550,y:280},{id:'City-1',x:350,y:220},{id:'City-2',x:450,y:340}],
      edges:[
        {id:'e0',source:'Plant-N',target:'Sub-A',weight:120},{id:'e1',source:'Plant-N',target:'Sub-B',weight:140},
        {id:'e2',source:'Plant-N',target:'City-1',weight:100},{id:'e3',source:'Sub-A',target:'City-1',weight:80},
        {id:'e4',source:'Sub-B',target:'City-1',weight:95},{id:'e5',source:'Sub-A',target:'Sub-C',weight:110},
        {id:'e6',source:'Sub-C',target:'City-1',weight:70},{id:'e7',source:'Sub-B',target:'Sub-D',weight:105},
        {id:'e8',source:'Sub-D',target:'City-1',weight:130},{id:'e9',source:'Plant-S',target:'Sub-C',weight:160},
        {id:'e10',source:'Plant-S',target:'Sub-D',weight:170},{id:'e11',source:'Plant-S',target:'City-2',weight:50},
        {id:'e12',source:'City-1',target:'City-2',weight:90},{id:'e13',source:'Sub-C',target:'City-2',weight:85},
        {id:'e14',source:'Sub-D',target:'City-2',weight:95}
      ]
    }
  },
  roads: {
    id:'roads', label:'European Rail Network', tagline:'Build minimum-cost rail infrastructure',
    unit:'km', unitFull:'kilometers of rail', color:'#63b3ed',
    description:'Plan high-speed rail construction between European capitals. Connect all cities with minimum total track distance.',
    layoutType: 'geographic',
    graph:{
      nodes:[{id:'LON',x:250,y:140},{id:'PAR',x:320,y:260},{id:'BRU',x:350,y:180},{id:'AMS',x:380,y:120},{id:'BER',x:520,y:160},{id:'MUN',x:480,y:280},{id:'MIL',x:450,y:380},{id:'ROM',x:520,y:480},{id:'MAD',x:120,y:420},{id:'BCN',x:240,y:400}],
      edges:[
        {id:'e0',source:'LON',target:'PAR',weight:460},{id:'e1',source:'LON',target:'BRU',weight:370},
        {id:'e2',source:'LON',target:'AMS',weight:500},{id:'e3',source:'PAR',target:'BRU',weight:310},
        {id:'e4',source:'BRU',target:'AMS',weight:210},{id:'e5',source:'AMS',target:'BER',weight:650},
        {id:'e6',source:'BRU',target:'BER',weight:760},{id:'e7',source:'PAR',target:'MUN',weight:830},
        {id:'e8',source:'BER',target:'MUN',weight:580},{id:'e9',source:'MUN',target:'MIL',weight:490},
        {id:'e10',source:'PAR',target:'MIL',weight:850},{id:'e11',source:'MIL',target:'ROM',weight:570},
        {id:'e12',source:'PAR',target:'MAD',weight:1270},{id:'e13',source:'MAD',target:'BCN',weight:620},
        {id:'e14',source:'BCN',target:'PAR',weight:1030},{id:'e15',source:'BCN',target:'MIL',weight:980}
      ]
    }
  },
  datacenter: {
    id:'datacenter', label:'Spine-Leaf Topology', tagline:'Minimize network latency & cable cost',
    unit:'m', unitFull:'meters of cable', color:'#fc8181',
    description:'Connect datacenter racks using a spine-leaf architecture. Find the minimum spanning tree to optimize cabling and ensure low latency.',
    layoutType: 'hierarchical',
    graph:{
      nodes:[{id:'SPINE-1',x:300,y:100},{id:'SPINE-2',x:500,y:100},{id:'LEAF-1',x:200,y:220},{id:'LEAF-2',x:400,y:220},{id:'LEAF-3',x:600,y:220},{id:'RACK-A',x:150,y:350},{id:'RACK-B',x:250,y:350},{id:'RACK-C',x:350,y:350},{id:'RACK-D',x:450,y:350},{id:'RACK-E',x:550,y:350},{id:'RACK-F',x:650,y:350}],
      edges:[
        {id:'e0',source:'SPINE-1',target:'LEAF-1',weight:15},{id:'e1',source:'SPINE-1',target:'LEAF-2',weight:18},
        {id:'e2',source:'SPINE-1',target:'LEAF-3',weight:25},{id:'e3',source:'SPINE-2',target:'LEAF-1',weight:26},
        {id:'e4',source:'SPINE-2',target:'LEAF-2',weight:17},{id:'e5',source:'SPINE-2',target:'LEAF-3',weight:14},
        {id:'e6',source:'LEAF-1',target:'RACK-A',weight:5},{id:'e7',source:'LEAF-1',target:'RACK-B',weight:6},
        {id:'e8',source:'LEAF-2',target:'RACK-C',weight:4},{id:'e9',source:'LEAF-2',target:'RACK-D',weight:5},
        {id:'e10',source:'LEAF-3',target:'RACK-E',weight:6},{id:'e11',source:'LEAF-3',target:'RACK-F',weight:4},
        {id:'e12',source:'LEAF-1',target:'RACK-C',weight:12},{id:'e13',source:'LEAF-2',target:'RACK-B',weight:11},
        {id:'e14',source:'LEAF-2',target:'RACK-E',weight:10},{id:'e15',source:'LEAF-3',target:'RACK-D',weight:13}
      ]
    }
  }
};
