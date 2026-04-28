interface FaqCategoryTemplate {
  categoria: string;
  subtemas: string[];
  canais: string[];
  perguntas: string[];
  respostas: string[];
}

export interface CopilotFaqMatch {
  id: string;
  categoria: string;
  subtema: string;
  pergunta: string;
  resposta: string;
  canalSugerido: string;
  prioridade: string;
  confidence: number;
  suggestions: string[];
}

interface FaqEntry {
  id: string;
  categoria: string;
  subtema: string;
  perfilUsuario: string;
  pergunta: string;
  resposta: string;
  canalSugerido: string;
  prioridade: string;
  normalizedQuestion: string;
  tokens: string[];
}

const personaSlices = [
  'usuario comum',
  'beneficiario de gratuidade',
  'estudante',
  'trabalhador que usa integracao',
  'passageiro que usa mais de um modal',
  'titular com deslocamento recorrente',
];

const urgencyPhrases = [
  'Preciso resolver isso hoje.',
  'Estou tentando entender antes de usar novamente.',
  'Quero evitar novo bloqueio.',
  'Nao sei se foi erro ou fraude.',
  'Quero saber qual e o procedimento correto.',
  'Quero uma orientacao clara para nao perder o beneficio.',
];

const stopwords = new Set([
  'a', 'ao', 'aos', 'as', 'com', 'como', 'da', 'das', 'de', 'do', 'dos', 'e', 'em', 'eu', 'foi', 'me', 'meu',
  'minha', 'na', 'nas', 'no', 'nos', 'o', 'os', 'ou', 'para', 'por', 'que', 'se', 'sem', 'ser', 'tem', 'uma', 'um',
  'devo', 'posso', 'quero', 'esta', 'estou', 'isso', 'qual', 'quais', 'quando',
]);

const categoryTemplates: FaqCategoryTemplate[] = [
  {
    categoria: 'Bloqueio Preventivo',
    subtemas: [
      'cartao bloqueado sem aviso',
      'bloqueio apos tentativa suspeita',
      'bloqueio por score de risco',
      'bloqueio por comportamento atipico',
      'desbloqueio apos validacao',
      'prazo para liberacao',
    ],
    canais: ['App', 'Central', 'Atendimento presencial'],
    perguntas: [
      'Por que meu cartao Riocard foi bloqueado?',
      'Meu cartao parou de funcionar do nada. O que aconteceu?',
      'Recebi informacao de bloqueio preventivo. Como devo proceder?',
      'O sistema bloqueou meu cartao por seguranca. O que significa?',
      'Meu cartao estava normal e agora aparece como bloqueado. Qual pode ser o motivo?',
      'Como confirmar se o bloqueio foi realmente preventivo?',
      'O bloqueio preventivo acontece por quanto tempo?',
      'Consigo usar o cartao enquanto a analise esta em andamento?',
      'Quais documentos podem ser pedidos para desbloquear o cartao?',
      'Como saber se o bloqueio foi por suspeita de fraude?',
    ],
    respostas: [
      'O bloqueio preventivo e acionado quando o sistema identifica uso fora do padrao esperado do titular. Confirme seus dados e solicite analise do caso no canal indicado.',
      'Quando o cartao apresenta comportamento atipico, ele pode ser bloqueado para evitar uso indevido. O ideal e consultar o status e pedir revisao imediatamente.',
      'Se o bloqueio foi gerado por seguranca, a recomendacao e validar titularidade e aguardar a revisao do atendimento. Em geral o cartao permanece bloqueado ate a conclusao da analise.',
      'Esse tipo de bloqueio busca proteger o usuario contra movimentacoes suspeitas. Depois da confirmacao dos dados, a equipe informa se o cartao sera desbloqueado ou substituido.',
      'Se houver uso em local ou horario incomum, o sistema pode interromper o uso preventivamente. O proximo passo e abrir uma solicitacao para verificacao.',
      'A orientacao e consultar o historico recente de uso, confirmar se houve tentativa por terceiros e seguir com a analise pelos canais oficiais.',
    ],
  },
  {
    categoria: 'Uso Indevido e Fraude',
    subtemas: [
      'uso por terceiro',
      'emprestimo indevido',
      'suspeita de clonagem',
      'transacoes nao reconhecidas',
      'uso em local desconhecido',
      'uso em horario incomum',
    ],
    canais: ['Central', 'WhatsApp', 'Atendimento presencial'],
    perguntas: [
      'Vi uma transacao que nao reconheco. O que faco?',
      'Apareceu uso do meu cartao em um local onde eu nao estava. Como contestar?',
      'Como denunciar uso indevido do meu cartao?',
      'Meu cartao pode ter sido clonado?',
      'Alguem usou meu cartao sem autorizacao. Qual o primeiro passo?',
      'Como saber se houve fraude no meu cartao?',
      'O sistema identificou uso suspeito. Isso significa fraude confirmada?',
      'Posso pedir revisao de movimentacoes que nao sao minhas?',
      'O que acontece quando ha suspeita de uso por outra pessoa?',
      'Consigo recuperar o cartao depois de uma suspeita de fraude?',
    ],
    respostas: [
      'Quando existe transacao nao reconhecida, a recomendacao e registrar contestacao e pedir bloqueio imediato para evitar novas utilizacoes.',
      'A analise compara horario, local e frequencia de uso do cartao. Se o evento for confirmado como incompativel com seu perfil, o caso segue para tratativa antifraude.',
      'A melhor acao inicial e bloquear o cartao, informar as movimentacoes suspeitas e aguardar a avaliacao do historico pelo atendimento.',
      'Suspeita de clonagem ocorre quando aparecem validacoes sem aderencia ao uso esperado do titular. Nessa situacao normalmente se recomenda segunda via.',
      'O atendimento verifica se houve deslocamento impossivel, uso simultaneo ou padrao incompativel com uso individual. Com isso define se o cartao sera liberado ou substituido.',
      'Nem toda sinalizacao indica fraude confirmada, mas toda anomalia relevante deve ser analisada. Por isso o ideal e abrir o chamado o quanto antes.',
    ],
  },
  {
    categoria: 'Compartilhamento e Emprestimo',
    subtemas: [
      'cartao emprestado',
      'uso por familiar',
      'compartilhamento recorrente',
      'uso simultaneo',
      'regra de titularidade',
      'consequencia por emprestimo',
    ],
    canais: ['FAQ', 'Central', 'Atendimento presencial'],
    perguntas: [
      'Posso emprestar meu cartao para outra pessoa?',
      'Meu filho usou meu cartao. Isso pode bloquear?',
      'O que acontece se o sistema identificar compartilhamento?',
      'Uso por familiar e permitido?',
      'Existe diferenca entre emprestimo eventual e uso indevido?',
      'Como o sistema sabe que duas pessoas usaram o mesmo cartao?',
      'Compartilhar o cartao pode gerar bloqueio definitivo?',
      'Posso justificar um uso feito por outra pessoa?',
      'Se meu cartao foi usado por engano por outra pessoa, como regularizar?',
      'Emprestar cartao de gratuidade pode gerar penalidade?',
    ],
    respostas: [
      'Cartoes pessoais devem ser usados apenas pelo titular. Quando ha compartilhamento, o sistema pode gerar alerta, bloquear preventivamente ou encaminhar o caso para analise humana.',
      'Se o cartao for utilizado por outra pessoa, mesmo que conhecida, o uso pode ser classificado como indevido conforme a regra do beneficio vinculado ao titular.',
      'O sistema observa intervalos curtos, locais diferentes e comportamento incompativel com uso individual. Quando esse padrao aparece, o cartao entra em revisao.',
      'Em casos de uso por familiar, a recomendacao e interromper imediatamente esse comportamento e regularizar o beneficio conforme a regra aplicavel ao perfil do usuario.',
      'Mesmo quando nao ha ma-fe, o compartilhamento pode violar a titularidade do cartao. Por isso vale consultar as regras antes de permitir qualquer uso por terceiros.',
      'Se houve uso indevido acidental, o ideal e relatar o ocorrido, confirmar os dados do titular e aguardar a avaliacao operacional do caso.',
    ],
  },
  {
    categoria: 'Recarga e Saldo',
    subtemas: [
      'recarga nao creditada',
      'saldo divergente',
      'saldo indisponivel',
      'erro apos recarga',
      'prazo de compensacao',
      'recarga em cartao bloqueado',
    ],
    canais: ['App', 'Site', 'Atendimento presencial'],
    perguntas: [
      'Fiz recarga e o saldo nao apareceu. O que devo fazer?',
      'Quanto tempo demora para a recarga cair?',
      'Meu saldo esta diferente do esperado. Como verificar?',
      'Posso recarregar um cartao bloqueado?',
      'A recarga foi debitada, mas nao entrou no cartao. Como resolver?',
      'Onde vejo o historico de recargas do cartao?',
      'Se o cartao estiver em analise, a recarga fica retida?',
      'O que fazer quando o validador nao reconhece a recarga?',
      'Minha recarga sumiu apos um bloqueio. Isso e normal?',
      'Consigo pedir estorno de recarga em caso de problema?',
    ],
    respostas: [
      'Quando a recarga nao aparece, o primeiro passo e confirmar o prazo de compensacao e validar se o cartao foi atualizado no canal de uso.',
      'Se o valor foi debitado mas o saldo nao entrou, o atendimento pode verificar pagamento, processamento e situacao do cartao para orientar a proxima acao.',
      'Em cartoes bloqueados, a recarga pode exigir regularizacao previa para voltar a ser utilizada normalmente. O ideal e confirmar o status antes de recarregar.',
      'O historico de recargas ajuda a comparar o valor pago com o valor efetivamente disponibilizado. Esse confronto costuma ser o ponto inicial da analise.',
      'Se houver divergencia de saldo, vale conferir uso recente, data da carga e se existiu bloqueio ou substituicao do cartao no periodo.',
      'Quando o problema persiste, a orientacao e registrar o caso com comprovante de pagamento e identificacao do cartao para revisao detalhada.',
    ],
  },
  {
    categoria: 'Uso em Viagem e Validacao',
    subtemas: [
      'cartao nao valida',
      'erro no validador',
      'uso em estacao diferente',
      'dupla cobranca',
      'bloqueio durante a viagem',
      'erro no embarque',
    ],
    canais: ['Atendimento presencial', 'Central', 'FAQ'],
    perguntas: [
      'Meu cartao nao passou no validador. O que pode ser?',
      'Fui cobrado duas vezes na mesma viagem. Como contestar?',
      'O validador mostrou erro de leitura. O que isso significa?',
      'Meu cartao funcionava e deixou de validar no meio do trajeto. O que fazer?',
      'Como agir se o sistema acusar problema durante o embarque?',
      'Posso continuar a viagem se o cartao apresentar falha?',
      'O uso em uma estacao diferente pode gerar alerta?',
      'Como identificar se foi erro tecnico ou bloqueio?',
      'O cartao validou e depois apareceu como irregular. Como entender isso?',
      'Se houve falha operacional do equipamento, quem resolve?',
    ],
    respostas: [
      'Quando o cartao nao valida, pode haver bloqueio, dano fisico, saldo insuficiente ou falha operacional do equipamento. A verificacao do status ajuda a separar essas causas.',
      'Em caso de dupla cobranca, a recomendacao e anotar data, horario e local para permitir confronto com o historico transacional.',
      'Se a falha ocorreu durante a viagem, o atendimento pode confirmar se o cartao ficou irregular por seguranca ou se houve apenas instabilidade no validador.',
      'Uso em local diferente nao e problema por si so, mas pode gerar alerta quando ocorre combinado com horario incompativel ou frequencia fora do padrao.',
      'Quando a inconsistencia parece tecnica, o ideal e registrar local, linha ou estacao para que a analise operacional consiga rastrear o evento.',
      'Se o cartao validou e logo depois ficou irregular, isso pode indicar uma acao de seguranca disparada apos a transacao. Nessa situacao, o caso deve ser consultado no atendimento.',
    ],
  },
  {
    categoria: 'Segunda Via e Cartao Fisico',
    subtemas: [
      'cartao perdido',
      'cartao roubado',
      'cartao danificado',
      'cartao quebrado',
      'substituicao por fraude',
      'migracao de saldo',
    ],
    canais: ['Atendimento presencial', 'Site', 'Central'],
    perguntas: [
      'Perdi meu cartao. Como bloquear e pedir segunda via?',
      'Roubaram meu cartao. O que devo fazer agora?',
      'Meu cartao quebrou e nao le mais. Como substituo?',
      'Quando vale pedir segunda via em vez de desbloqueio?',
      'O saldo vai para o novo cartao?',
      'Quanto tempo leva para sair a segunda via?',
      'Se o cartao foi danificado, preciso provar o defeito?',
      'Fraude confirmada sempre exige novo cartao?',
      'Como acompanhar o pedido de segunda via?',
      'Posso continuar usando o cartao antigo ate a troca?',
    ],
    respostas: [
      'Em casos de perda, roubo ou dano fisico, a orientacao e bloquear imediatamente e solicitar a segunda via conforme o canal disponivel para o seu perfil.',
      'Quando ha suspeita de fraude ou clonagem, a segunda via costuma ser a medida mais segura para preservar o beneficio do titular.',
      'A migracao de saldo e analisada conforme a situacao do cartao anterior e o tipo de beneficio. Por isso vale confirmar essa etapa no momento da solicitacao.',
      'Se o cartao estiver fisicamente comprometido, o desbloqueio nao resolve. Nesses casos, a substituicao e o procedimento mais adequado.',
      'O prazo pode variar conforme o canal e o tipo de cartao, mas o atendimento informa a expectativa e os requisitos para retirada ou entrega.',
      'Mesmo quando a causa e operacional, um cartao danificado ou comprometido pode precisar ser substituido para evitar novas falhas de uso.',
    ],
  },
  {
    categoria: 'Cadastro, Titularidade e Atendimento',
    subtemas: [
      'dados desatualizados',
      'validacao de titularidade',
      'mudanca de cadastro',
      'revisao de analise',
      'documentacao',
      'acompanhar protocolo',
    ],
    canais: ['App', 'Site', 'Central'],
    perguntas: [
      'Como atualizar meus dados cadastrais do cartao?',
      'Quais dados podem ser pedidos na validacao de titularidade?',
      'Posso acompanhar um protocolo de analise?',
      'Como pedir revisao de um bloqueio que considero indevido?',
      'Quais documentos costumam ser solicitados em casos de fraude?',
      'Como saber se meu cadastro esta causando problema no cartao?',
      'Mudanca de telefone ou email interfere no atendimento?',
      'O que acontece se eu nao conseguir validar meus dados?',
      'Existe prazo para responder a uma solicitacao do atendimento?',
      'Como registrar uma reclamacao formal sobre o cartao?',
    ],
    respostas: [
      'Dados cadastrais corretos agilizam a validacao de titularidade e a comunicacao em caso de bloqueio, fraude ou necessidade de revisao.',
      'Em analises antifraude, o atendimento pode pedir confirmacao de dados pessoais, documentos e informacoes sobre o uso recente do cartao.',
      'Acompanhar o protocolo ajuda a entender em que etapa o caso esta: monitoramento, validacao, analise humana ou conclusao.',
      'Se o usuario considerar o bloqueio indevido, ele pode solicitar revisao apresentando contexto e confirmando que as transacoes contestadas nao representam seu uso normal.',
      'Mudancas de contato nao costumam causar bloqueio sozinhas, mas manter o cadastro atualizado facilita receber alertas e retornar rapidamente ao uso regular.',
      'Quando a validacao nao e concluida, o atendimento orienta os proximos passos, que podem incluir nova tentativa, envio complementar de documentos ou comparecimento presencial.',
    ],
  },
];

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(' ')
    .filter((token) => token.length > 2 && !stopwords.has(token));
}

function buildFaqEntries() {
  const rows: FaqEntry[] = [];
  let id = 1;

  for (const category of categoryTemplates) {
    for (const subtema of category.subtemas) {
      for (let index = 0; index < category.perguntas.length; index += 1) {
        const persona = personaSlices[(index + id) % personaSlices.length];
        const urgency = urgencyPhrases[(id + index) % urgencyPhrases.length];
        const canal = category.canais[(id + index) % category.canais.length];
        const pergunta = `${category.perguntas[index]} Sou ${persona} e o caso envolve ${subtema}. ${urgency}`;
        const resposta = `${category.respostas[index % category.respostas.length]} Para esse tipo de situacao (${subtema}), a orientacao mais segura e consultar ${canal.toLowerCase()} e confirmar o historico recente do cartao antes de tentar novo uso.`;

        rows.push({
          id: `FAQ-${String(id).padStart(4, '0')}`,
          categoria: category.categoria,
          subtema,
          perfilUsuario: persona,
          pergunta,
          resposta,
          canalSugerido: canal,
          prioridade: category.categoria === 'Uso Indevido e Fraude' || category.categoria === 'Bloqueio Preventivo' ? 'Alta' : 'Media',
          normalizedQuestion: normalizeText(pergunta),
          tokens: tokenize(`${category.categoria} ${subtema} ${pergunta}`),
        });
        id += 1;
      }
    }
  }

  return rows;
}

const faqEntries = buildFaqEntries();

function scoreEntry(input: string, inputTokens: string[], entry: FaqEntry) {
  if (!inputTokens.length) {
    return 0;
  }

  if (entry.normalizedQuestion === input) {
    return 1;
  }

  if (entry.normalizedQuestion.includes(input) || input.includes(entry.normalizedQuestion)) {
    return 0.95;
  }

  const entryTokenSet = new Set(entry.tokens);
  const inputTokenSet = new Set(inputTokens);
  const commonTokens = [...inputTokenSet].filter((token) => entryTokenSet.has(token));
  const tokenCoverage = commonTokens.length / Math.max(inputTokenSet.size, 1);
  const entryCoverage = commonTokens.length / Math.max(entryTokenSet.size, 1);
  const phraseBonus = commonTokens.some((token) => entry.subtema.includes(token) || entry.categoria.toLowerCase().includes(token)) ? 0.12 : 0;
  const blockBonus =
    (input.includes('bloque') && entry.normalizedQuestion.includes('bloque')) ||
    (input.includes('fraud') && entry.normalizedQuestion.includes('fraud')) ||
    (input.includes('recarga') && entry.normalizedQuestion.includes('recarga')) ||
    (input.includes('saldo') && entry.normalizedQuestion.includes('saldo')) ||
    (input.includes('reembolso') && entry.normalizedQuestion.includes('reembolso')) ||
    (input.includes('segunda via') && entry.normalizedQuestion.includes('segunda via'))
      ? 0.16
      : 0;

  return Math.min(1, tokenCoverage * 0.72 + entryCoverage * 0.18 + phraseBonus + blockBonus);
}

export function findFaqAnswer(input: string): CopilotFaqMatch | null {
  const normalizedInput = normalizeText(input);
  const inputTokens = tokenize(input);

  if (normalizedInput.length < 8 || inputTokens.length < 2) {
    return null;
  }

  const ranked = faqEntries
    .map((entry) => ({
      entry,
      score: scoreEntry(normalizedInput, inputTokens, entry),
    }))
    .filter((item) => item.score >= 0.34)
    .sort((left, right) => right.score - left.score);

  const best = ranked[0];

  if (!best) {
    return null;
  }

  const suggestions = ranked
    .filter((item) => item.entry.id !== best.entry.id && item.entry.categoria === best.entry.categoria)
    .slice(0, 3)
    .map((item) => item.entry.pergunta.split(' Sou ')[0]);

  return {
    id: best.entry.id,
    categoria: best.entry.categoria,
    subtema: best.entry.subtema,
    pergunta: best.entry.pergunta,
    resposta: best.entry.resposta,
    canalSugerido: best.entry.canalSugerido,
    prioridade: best.entry.prioridade,
    confidence: Number(best.score.toFixed(2)),
    suggestions,
  };
}

export function getCopilotFaqEntryCount() {
  return faqEntries.length;
}
