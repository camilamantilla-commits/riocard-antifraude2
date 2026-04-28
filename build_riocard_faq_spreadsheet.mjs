import fs from "node:fs/promises";
import path from "node:path";
import {
  SpreadsheetFile,
  Workbook,
} from "file:///C:/Users/Camila%20Mantilla/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const outputDir = path.resolve(".");
const outputPath = path.join(outputDir, "riocard_faq_usuarios_420_perguntas_respostas.xlsx");

const categories = [
  {
    categoria: "Bloqueio Preventivo",
    subtemas: [
      "cartao bloqueado sem aviso",
      "bloqueio apos tentativa suspeita",
      "bloqueio por score de risco",
      "bloqueio por comportamento atipico",
      "desbloqueio apos validacao",
      "prazo para liberacao",
    ],
    canais: ["App", "Central", "Atendimento presencial"],
    perguntas: [
      "Por que meu cartao Riocard foi bloqueado?",
      "Meu cartao parou de funcionar do nada. O que aconteceu?",
      "Recebi informacao de bloqueio preventivo. Como devo proceder?",
      "O sistema bloqueou meu cartao por seguranca. O que significa?",
      "Meu cartao estava normal e agora aparece como bloqueado. Qual pode ser o motivo?",
      "Como confirmar se o bloqueio foi realmente preventivo?",
      "O bloqueio preventivo acontece por quanto tempo?",
      "Consigo usar o cartao enquanto a analise esta em andamento?",
      "Quais documentos podem ser pedidos para desbloquear o cartao?",
      "Como saber se o bloqueio foi por suspeita de fraude?",
    ],
    respostas: [
      "O bloqueio preventivo e acionado quando o sistema identifica um uso fora do padrao esperado do titular. Para seguir, confirme seus dados e solicite a analise do caso no canal indicado.",
      "Quando o cartao apresenta comportamento atipico, ele pode ser bloqueado para evitar uso indevido. O ideal e consultar o status e pedir revisao imediatamente.",
      "Se o bloqueio foi gerado por seguranca, a recomendacao e validar titularidade e aguardar a revisao do atendimento. Em geral, o cartao permanece bloqueado ate a conclusao dessa analise.",
      "Esse tipo de bloqueio busca proteger o usuario contra movimentacoes suspeitas. Depois da confirmacao dos dados, a equipe informa se o cartao sera desbloqueado ou substituido.",
      "Se houver uso em local ou horario incomum, o sistema pode interromper o uso preventivamente. Nesse caso, o proximo passo e abrir uma solicitacao para verificacao.",
      "A orientacao e consultar o historico recente de uso, confirmar se houve tentativa de uso por terceiros e seguir com a analise pelos canais oficiais.",
    ],
  },
  {
    categoria: "Uso Indevido e Fraude",
    subtemas: [
      "uso por terceiro",
      "emprestimo indevido",
      "suspeita de clonagem",
      "transacoes nao reconhecidas",
      "uso em local desconhecido",
      "uso em horario incomum",
    ],
    canais: ["Central", "WhatsApp", "Atendimento presencial"],
    perguntas: [
      "Vi uma transacao que nao reconheco. O que faco?",
      "Apareceu uso do meu cartao em um local onde eu nao estava. Como contestar?",
      "Como denunciar uso indevido do meu cartao?",
      "Meu cartao pode ter sido clonado?",
      "Alguem usou meu cartao sem autorizacao. Qual o primeiro passo?",
      "Como saber se houve fraude no meu cartao?",
      "O sistema identificou uso suspeito. Isso significa fraude confirmada?",
      "Posso pedir revisao de movimentacoes que nao sao minhas?",
      "O que acontece quando ha suspeita de uso por outra pessoa?",
      "Consigo recuperar o cartao depois de uma suspeita de fraude?",
    ],
    respostas: [
      "Quando existe transacao nao reconhecida, a recomendacao e registrar contestacao e pedir bloqueio imediato para evitar novas utilizacoes.",
      "A analise compara horario, local e frequencia de uso do cartao. Se o evento for confirmado como incompatível com o seu perfil, o caso segue para tratativa antifraude.",
      "A melhor acao inicial e bloquear o cartao, informar as movimentacoes suspeitas e aguardar a avaliacao do historico pelo atendimento.",
      "Suspeita de clonagem ocorre quando aparecem validacoes sem aderencia ao uso esperado do titular. Nessa situacao, normalmente se recomenda segunda via.",
      "O atendimento verifica se houve deslocamento impossivel, uso simultaneo ou padrao incompatível com uso individual. Com isso, define se o cartao sera liberado ou substituido.",
      "Nem toda sinalizacao indica fraude confirmada, mas toda anomalia relevante deve ser analisada. Por isso o ideal e abrir o chamado o quanto antes.",
    ],
  },
  {
    categoria: "Compartilhamento e Emprestimo",
    subtemas: [
      "cartao emprestado",
      "uso por familiar",
      "compartilhamento recorrente",
      "uso simultaneo",
      "regra de titularidade",
      "consequencia por emprestimo",
    ],
    canais: ["FAQ", "Central", "Atendimento presencial"],
    perguntas: [
      "Posso emprestar meu cartao para outra pessoa?",
      "Meu filho usou meu cartao. Isso pode bloquear?",
      "O que acontece se o sistema identificar compartilhamento?",
      "Uso por familiar e permitido?",
      "Existe diferenca entre emprestimo eventual e uso indevido?",
      "Como o sistema sabe que duas pessoas usaram o mesmo cartao?",
      "Compartilhar o cartao pode gerar bloqueio definitivo?",
      "Posso justificar um uso feito por outra pessoa?",
      "Se meu cartao foi usado por engano por outra pessoa, como regularizar?",
      "Emprestar cartao de gratuidade pode gerar penalidade?",
    ],
    respostas: [
      "Cartoes pessoais devem ser usados apenas pelo titular. Quando ha compartilhamento, o sistema pode gerar alerta, bloquear preventivamente ou encaminhar o caso para analise humana.",
      "Se o cartao for utilizado por outra pessoa, mesmo que conhecida, o uso pode ser classificado como indevido conforme a regra do beneficio vinculado ao titular.",
      "O sistema observa intervalos curtos, locais diferentes e comportamento incompatível com uso individual. Quando esse padrao aparece, o cartao entra em revisao.",
      "Em casos de uso por familiar, a recomendacao e interromper imediatamente esse comportamento e regularizar o beneficio conforme a regra aplicavel ao perfil do usuario.",
      "Mesmo quando nao ha ma-fe, o compartilhamento pode violar a titularidade do cartao. Por isso vale consultar as regras antes de permitir qualquer uso por terceiros.",
      "Se houve uso indevido acidental, o ideal e relatar o ocorrido, confirmar os dados do titular e aguardar a avaliacao operacional do caso.",
    ],
  },
  {
    categoria: "Recarga e Saldo",
    subtemas: [
      "recarga nao creditada",
      "saldo divergente",
      "saldo indisponivel",
      "erro apos recarga",
      "prazo de compensacao",
      "recarga em cartao bloqueado",
    ],
    canais: ["App", "Site", "Atendimento presencial"],
    perguntas: [
      "Fiz recarga e o saldo nao apareceu. O que devo fazer?",
      "Quanto tempo demora para a recarga cair?",
      "Meu saldo esta diferente do esperado. Como verificar?",
      "Posso recarregar um cartao bloqueado?",
      "A recarga foi debitada, mas nao entrou no cartao. Como resolver?",
      "Onde vejo o historico de recargas do cartao?",
      "Se o cartao estiver em analise, a recarga fica retida?",
      "O que fazer quando o validador nao reconhece a recarga?",
      "Minha recarga sumiu apos um bloqueio. Isso e normal?",
      "Consigo pedir estorno de recarga em caso de problema?",
    ],
    respostas: [
      "Quando a recarga nao aparece, o primeiro passo e confirmar o prazo de compensacao e validar se o cartao foi atualizado no canal de uso.",
      "Se o valor foi debitado mas o saldo nao entrou, o atendimento pode verificar pagamento, processamento e situacao do cartao para orientar a proxima acao.",
      "Em cartoes bloqueados, a recarga pode exigir regularizacao previa para voltar a ser utilizada normalmente. O ideal e confirmar o status antes de recarregar.",
      "O historico de recargas ajuda a comparar o valor pago com o valor efetivamente disponibilizado. Esse confronto costuma ser o ponto inicial da analise.",
      "Se houver divergencia de saldo, vale conferir uso recente, data da carga e se existiu bloqueio ou substituicao do cartao no periodo.",
      "Quando o problema persiste, a orientacao e registrar o caso com comprovante de pagamento e identificacao do cartao para revisao detalhada.",
    ],
  },
  {
    categoria: "Uso em Viagem e Validacao",
    subtemas: [
      "cartao nao valida",
      "erro no validador",
      "uso em estacao diferente",
      "dupla cobranca",
      "bloqueio durante a viagem",
      "erro no embarque",
    ],
    canais: ["Atendimento presencial", "Central", "FAQ"],
    perguntas: [
      "Meu cartao nao passou no validador. O que pode ser?",
      "Fui cobrado duas vezes na mesma viagem. Como contestar?",
      "O validador mostrou erro de leitura. O que isso significa?",
      "Meu cartao funcionava e deixou de validar no meio do trajeto. O que fazer?",
      "Como agir se o sistema acusar problema durante o embarque?",
      "Posso continuar a viagem se o cartao apresentar falha?",
      "O uso em uma estacao diferente pode gerar alerta?",
      "Como identificar se foi erro tecnico ou bloqueio?",
      "O cartao validou e depois apareceu como irregular. Como entender isso?",
      "Se houve falha operacional do equipamento, quem resolve?",
    ],
    respostas: [
      "Quando o cartao nao valida, pode haver bloqueio, dano fisico, saldo insuficiente ou falha operacional do equipamento. A verificacao do status ajuda a separar essas causas.",
      "Em caso de dupla cobranca, a recomendacao e anotar data, horario e local para permitir confronto com o historico transacional.",
      "Se a falha ocorreu durante a viagem, o atendimento pode confirmar se o cartao ficou irregular por seguranca ou se houve apenas instabilidade no validador.",
      "Uso em local diferente nao e problema por si so, mas pode gerar alerta quando ocorre em combinado com horario incompatível ou frequencia fora do padrao.",
      "Quando a inconsistência parece tecnica, o ideal e registrar local, linha ou estacao para que a analise operacional consiga rastrear o evento.",
      "Se o cartao validou e logo depois ficou irregular, isso pode indicar uma acao de seguranca disparada apos a transacao. Nessa situacao, o caso deve ser consultado no atendimento.",
    ],
  },
  {
    categoria: "Segunda Via e Cartao Fisico",
    subtemas: [
      "cartao perdido",
      "cartao roubado",
      "cartao danificado",
      "cartao quebrado",
      "substituicao por fraude",
      "migracao de saldo",
    ],
    canais: ["Atendimento presencial", "Site", "Central"],
    perguntas: [
      "Perdi meu cartao. Como bloquear e pedir segunda via?",
      "Roubaram meu cartao. O que devo fazer agora?",
      "Meu cartao quebrou e nao le mais. Como substituo?",
      "Quando vale pedir segunda via em vez de desbloqueio?",
      "O saldo vai para o novo cartao?",
      "Quanto tempo leva para sair a segunda via?",
      "Se o cartao foi danificado, preciso provar o defeito?",
      "Fraude confirmada sempre exige novo cartao?",
      "Como acompanhar o pedido de segunda via?",
      "Posso continuar usando o cartao antigo ate a troca?",
    ],
    respostas: [
      "Em casos de perda, roubo ou dano fisico, a orientacao e bloquear imediatamente e solicitar a segunda via conforme o canal disponivel para o seu perfil.",
      "Quando ha suspeita de fraude ou clonagem, a segunda via costuma ser a medida mais segura para preservar o beneficio do titular.",
      "A migracao de saldo e analisada conforme a situacao do cartao anterior e o tipo de beneficio. Por isso vale confirmar essa etapa no momento da solicitacao.",
      "Se o cartao estiver fisicamente comprometido, o desbloqueio nao resolve. Nesses casos, a substituicao e o procedimento mais adequado.",
      "O prazo pode variar conforme o canal e o tipo de cartao, mas o atendimento informa a expectativa e os requisitos para retirada ou entrega.",
      "Mesmo quando a causa e operacional, um cartao danificado ou comprometido pode precisar ser substituido para evitar novas falhas de uso.",
    ],
  },
  {
    categoria: "Cadastro, Titularidade e Atendimento",
    subtemas: [
      "dados desatualizados",
      "validacao de titularidade",
      "mudanca de cadastro",
      "revisao de analise",
      "documentacao",
      "acompanhar protocolo",
    ],
    canais: ["App", "Site", "Central"],
    perguntas: [
      "Como atualizar meus dados cadastrais do cartao?",
      "Quais dados podem ser pedidos na validacao de titularidade?",
      "Posso acompanhar um protocolo de analise?",
      "Como pedir revisao de um bloqueio que considero indevido?",
      "Quais documentos costumam ser solicitados em casos de fraude?",
      "Como saber se meu cadastro esta causando problema no cartao?",
      "Mudanca de telefone ou email interfere no atendimento?",
      "O que acontece se eu nao conseguir validar meus dados?",
      "Existe prazo para responder a uma solicitacao do atendimento?",
      "Como registrar uma reclamacao formal sobre o cartao?",
    ],
    respostas: [
      "Dados cadastrais corretos agilizam a validacao de titularidade e a comunicacao em caso de bloqueio, fraude ou necessidade de revisao.",
      "Em analises antifraude, o atendimento pode pedir confirmacao de dados pessoais, documentos e informacoes sobre o uso recente do cartao.",
      "Acompanhar o protocolo ajuda a entender em que etapa o caso esta: monitoramento, validacao, analise humana ou conclusao.",
      "Se o usuario considerar o bloqueio indevido, ele pode solicitar revisao, apresentando contexto e confirmando que as transacoes contestadas nao representam seu uso normal.",
      "Mudancas de contato nao costumam causar bloqueio sozinhas, mas manter o cadastro atualizado facilita receber alertas e retornar rapidamente ao uso regular.",
      "Quando a validacao nao e concluida, o atendimento orienta os proximos passos, que podem incluir nova tentativa, envio complementar de documentos ou comparecimento presencial.",
    ],
  },
];

const personaSlices = [
  "usuario comum",
  "beneficiario de gratuidade",
  "estudante",
  "trabalhador que usa integracao",
  "passageiro que usa o cartao em mais de um modal",
  "titular que compartilha deslocamentos frequentes",
];

const urgencyPhrases = [
  "Preciso resolver isso hoje.",
  "Estou tentando entender antes de usar novamente.",
  "Quero evitar novo bloqueio.",
  "Nao sei se foi erro ou fraude.",
  "Quero saber qual e o procedimento correto.",
  "Quero uma orientacao clara para nao perder o beneficio.",
];

function buildRows() {
  const rows = [];
  let id = 1;

  for (const category of categories) {
    for (const subtema of category.subtemas) {
      for (let i = 0; i < category.perguntas.length; i += 1) {
        const perguntaBase = category.perguntas[i];
        const respostaBase = category.respostas[i % category.respostas.length];
        const persona = personaSlices[(i + id) % personaSlices.length];
        const urgencia = urgencyPhrases[(id + i) % urgencyPhrases.length];
        const canal = category.canais[(id + i) % category.canais.length];

        rows.push({
          id: `FAQ-${String(id).padStart(4, "0")}`,
          categoria: category.categoria,
          subtema,
          perfil_usuario: persona,
          pergunta: `${perguntaBase} Sou ${persona} e o caso envolve ${subtema}. ${urgencia}`,
          resposta: `${respostaBase} Para esse tipo de situacao (${subtema}), a orientacao mais segura e consultar ${canal.toLowerCase()} e confirmar o historico recente do cartao antes de tentar novo uso.`,
          canal_sugerido: canal,
          prioridade: category.categoria === "Uso Indevido e Fraude" || category.categoria === "Bloqueio Preventivo" ? "Alta" : "Media",
        });
        id += 1;
      }
    }
  }

  return rows;
}

const rows = buildRows();

if (rows.length < 400) {
  throw new Error(`Base insuficiente: ${rows.length} linhas geradas.`);
}

const workbook = Workbook.create();
const faqSheet = workbook.worksheets.add("FAQ_Riocard");
const summarySheet = workbook.worksheets.add("Resumo");

const faqHeaders = [
  "ID",
  "Categoria",
  "Subtema",
  "Perfil do usuario",
  "Pergunta",
  "Resposta",
  "Canal sugerido",
  "Prioridade",
];

faqSheet.getRange(`A1:H${rows.length + 1}`).values = [
  faqHeaders,
  ...rows.map((row) => [
    row.id,
    row.categoria,
    row.subtema,
    row.perfil_usuario,
    row.pergunta,
    row.resposta,
    row.canal_sugerido,
    row.prioridade,
  ]),
];

faqSheet.getRange("A1:H1").format = {
  fill: "#007BFF",
  font: { bold: true, color: "#FFFFFF" },
};
faqSheet.freezePanes.freezeRows(1);

const categoryCounts = categories.map((category) => ({
  categoria: category.categoria,
  total: rows.filter((row) => row.categoria === category.categoria).length,
}));

summarySheet.getRange("A1").values = [[
  "Base de Perguntas e Respostas de Usuarios - Cartoes Riocard"
]];
summarySheet.getRange("A1").format = {
  fill: "#0056B3",
  font: { color: "#FFFFFF", bold: true, size: 14 },
};
summarySheet.getRange("A2").values = [[
  `Planilha criada para apoiar atendimento, chatbot, base de conhecimento e treinamento operacional. Total de registros: ${rows.length}.`
]];
summarySheet.getRange("A2").format = {
  fill: "#EEF6FF",
  font: { color: "#333333" },
};

summarySheet.getRange("A5:B8").values = [
  ["Indicador", "Valor"],
  ["Total de perguntas e respostas", rows.length],
  ["Categorias cobertas", categories.length],
  ["Casos de prioridade alta", rows.filter((row) => row.prioridade === "Alta").length],
];
summarySheet.getRange("A5:B5").format = {
  fill: "#007BFF",
  font: { color: "#FFFFFF", bold: true },
};
summarySheet.getRange("D5:E12").values = [
  ["Categoria", "Quantidade"],
  ...categoryCounts.map((item) => [item.categoria, item.total]),
];
summarySheet.getRange("D5:E5").format = {
  fill: "#007BFF",
  font: { color: "#FFFFFF", bold: true },
};
summarySheet.freezePanes.freezeRows(4);

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

const inspect = await workbook.inspect({
  kind: "table",
  range: `FAQ_Riocard!A1:H8`,
  include: "values",
  tableMaxRows: 8,
  tableMaxCols: 8,
});

const summaryInspect = await workbook.inspect({
  kind: "table",
  range: "Resumo!A1:F12",
  include: "values",
  tableMaxRows: 12,
  tableMaxCols: 6,
});

const preview = await workbook.render({
  sheetName: "Resumo",
  range: "A1:F28",
  scale: 1,
  format: "png",
});

await fs.writeFile(path.join(outputDir, "riocard_faq_preview.png"), new Uint8Array(await preview.arrayBuffer()));
await fs.writeFile(
  path.join(outputDir, "riocard_faq_verificacao.json"),
  JSON.stringify(
    {
      totalRows: rows.length,
      faqPreview: inspect,
      summaryPreview: summaryInspect,
    },
    null,
    2,
  ),
);

console.log(JSON.stringify({ outputPath, totalRows: rows.length }, null, 2));
