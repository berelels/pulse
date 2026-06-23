'use strict';
// ── PULSE STORE (localStorage) ──────────────────────────────────
const PulseStore = {
  _defaults() {
    return {
      usuarios: [{ id:1,nome:'Administrador',email:'admin@pulse.studio',senha:'admin123',is_admin:1,permissoes:null,tema:'escuro',criado_em:'2024-01-01' }],
      bandas: [
        {id:1,nome_banda:'The Analog Keys',responsavel:'Lucas Ferreira',telefone:'(11) 99988-7766',genero:'Rock Alternativo',criado_em:'2024-01-10'},
        {id:2,nome_banda:'Neon Wolves',responsavel:'Mariana Costa',telefone:'(21) 98877-6655',genero:'Indie Pop',criado_em:'2024-01-15'},
        {id:3,nome_banda:'Deep Groove Trio',responsavel:'Rafael Almeida',telefone:'(31) 97766-5544',genero:'Jazz Fusion',criado_em:'2024-02-01'},
        {id:4,nome_banda:'Velvet Thunder',responsavel:'Juliana Santos',telefone:'(11) 96655-4433',genero:'Blues',criado_em:'2024-02-10'},
        {id:5,nome_banda:'PixelBeat',responsavel:'Carlos Mendes',telefone:'(41) 95544-3322',genero:'Eletrônico',criado_em:'2024-03-01'}
      ],
      equipamentos: [
        {id:1,nome:'Marshall JCM800',descricao:'Amplificador valvulado 100W',valor_locacao:80,status:'disponivel'},
        {id:2,nome:'Fender Twin Reverb',descricao:'Combo 85W 2x12"',valor_locacao:70,status:'disponivel'},
        {id:3,nome:'Kit Bateria Pearl Export',descricao:'Bumbo 22" completo',valor_locacao:120,status:'disponivel'},
        {id:4,nome:'Prato Zildjian A 20" Ride',descricao:'Ride série A',valor_locacao:30,status:'disponivel'},
        {id:5,nome:'Microfone Shure SM7B',descricao:'Dinâmico cardioide',valor_locacao:50,status:'disponivel'},
        {id:6,nome:'Microfone AKG C414',descricao:'Condensador multi-padrão',valor_locacao:60,status:'manutencao'},
        {id:7,nome:'Mesa Behringer X32',descricao:'Digital 32 canais',valor_locacao:100,status:'disponivel'},
        {id:8,nome:'DI Box Radial J48',descricao:'Direct Box ativo',valor_locacao:20,status:'disponivel'}
      ],
      agendamentos: [
        {id:1,banda_id:1,usuario_id:1,data_ensaio:'2024-07-10',hora_inicio:'10:00',hora_fim:'13:00',valor_total:450,status:'confirmado',observacoes:'',equipamentos:[1,2]},
        {id:2,banda_id:2,usuario_id:1,data_ensaio:'2024-07-11',hora_inicio:'14:00',hora_fim:'16:00',valor_total:300,status:'pendente',observacoes:'',equipamentos:[]},
        {id:3,banda_id:3,usuario_id:1,data_ensaio:'2024-07-05',hora_inicio:'09:00',hora_fim:'12:00',valor_total:450,status:'concluido',observacoes:'',equipamentos:[5]},
        {id:4,banda_id:4,usuario_id:1,data_ensaio:'2024-07-15',hora_inicio:'18:00',hora_fim:'21:00',valor_total:450,status:'confirmado',observacoes:'',equipamentos:[3]},
        {id:5,banda_id:5,usuario_id:1,data_ensaio:'2024-07-03',hora_inicio:'13:00',hora_fim:'15:00',valor_total:300,status:'cancelado',observacoes:'',equipamentos:[]}
      ],
      regras: [
        {id:1,chave:'preco_hora_ensaio',valor:'150.00',descricao:'Valor por hora de ensaio (R$)'},
        {id:2,chave:'preco_hora_gravacao',valor:'250.00',descricao:'Valor por hora de gravação (R$)'},
        {id:3,chave:'min_horas_reserva',valor:'2',descricao:'Mínimo de horas por reserva'},
        {id:4,chave:'max_horas_reserva',valor:'12',descricao:'Máximo de horas por reserva'},
        {id:5,chave:'desconto_fidelidade',valor:'10',descricao:'Desconto (%) para bandas com 5+ agendamentos'},
        {id:6,chave:'taxa_cancelamento',valor:'20',descricao:'Taxa (%) cobrada em cancelamentos com < 24h'},
        {id:7,chave:'horario_abertura',valor:'08:00',descricao:'Horário de abertura do estúdio'},
        {id:8,chave:'horario_fechamento',valor:'23:00',descricao:'Horário de fechamento do estúdio'},
        {id:9,chave:'nome_estudio',valor:'Pulse Studio',descricao:'Nome do estúdio'},
        {id:10,chave:'moeda',valor:'BRL',descricao:'Moeda utilizada'}
      ],
      nextId: { bandas:6, equipamentos:9, agendamentos:6, usuarios:2, regras:11 }
    };
  },
  init() {
    if (!localStorage.getItem('pulse_data')) {
      localStorage.setItem('pulse_data', JSON.stringify(this._defaults()));
    }
  },
  _data() { return JSON.parse(localStorage.getItem('pulse_data')); },
  _save(d) { localStorage.setItem('pulse_data', JSON.stringify(d)); },
  getAll(table) { return this._data()[table] || []; },
  getById(table, id) { return this.getAll(table).find(r => r.id === id); },
  create(table, obj) {
    const d = this._data();
    const id = d.nextId[table]++;
    const rec = { ...obj, id, criado_em: new Date().toISOString().slice(0,10) };
    d[table].push(rec);
    this._save(d);
    return rec;
  },
  update(table, id, obj) {
    const d = this._data();
    const i = d[table].findIndex(r => r.id === id);
    if (i >= 0) { d[table][i] = { ...d[table][i], ...obj }; this._save(d); }
    return d[table][i];
  },
  remove(table, id) {
    const d = this._data();
    d[table] = d[table].filter(r => r.id !== id);
    this._save(d);
  },
  getRegra(chave) { return this.getAll('regras').find(r => r.chave === chave); },
  getPrecoHora() { const r = this.getRegra('preco_hora_ensaio'); return r ? parseFloat(r.valor) : 150; }
};
