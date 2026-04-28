import type {
  FinancialChartSeries,
  FinancialDashboardData,
  FinancialEntry,
  FinancialEntryType,
  FinancialFilterOptions,
  FinancialFilterState,
  FinancialIndicatorInfo,
  FinancialInsight,
  FinancialKpis,
  FinancialMonthlyPoint,
  FinancialRankingItem,
} from '@/types/financial';

const shortMonthLabels = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const categoryPalette = ['#0454a3', '#0077d4', '#5aa9ff', '#ffc928', '#ff9f1c', '#7fb8ff'];

const indicatorInfo: FinancialIndicatorInfo[] = [
  {
    title: 'Vale-transporte',
    type: 'receita',
    description: 'Receita recorrente gerada pelas cargas corporativas e beneficios de deslocamento.',
    impact: 'Sustenta previsibilidade de caixa e costuma representar a maior fatia da receita.',
  },
  {
    title: 'Recarga digital',
    type: 'receita',
    description: 'Entradas vindas de recargas realizadas em app, portal ou canais digitais.',
    impact: 'Ajuda a crescer receita com baixo custo operacional e maior conveniencia para o usuario.',
  },
  {
    title: 'Taxas',
    type: 'receita',
    description: 'Tarifas de servicos, emissoes, segunda via e outras cobrancas acessorias.',
    impact: 'Complementa a monetizacao e protege a margem em cenarios de queda de volume principal.',
  },
  {
    title: 'Float financeiro',
    type: 'receita',
    description: 'Resultado financeiro associado ao saldo mantido e ao ciclo entre carga e utilizacao.',
    impact: 'Pode melhorar a margem total sem depender diretamente do aumento do volume transacional.',
  },
  {
    title: 'Infraestrutura',
    type: 'custo',
    description: 'Custos com datacenter, nuvem, redes, validadores e capacidade operacional.',
    impact: 'Quando cresce acima da receita, pressiona a margem e reduz flexibilidade orcamentaria.',
  },
  {
    title: 'Tecnologia',
    type: 'custo',
    description: 'Desenvolvimento, licencas, integracoes e manutencao da plataforma.',
    impact: 'E essencial para escalar o negocio, mas exige controle para nao comprometer retorno.',
  },
  {
    title: 'Antifraude',
    type: 'custo',
    description: 'Modelos, monitoramento, operacao de risco e investigacao de eventos suspeitos.',
    impact: 'Protege receita e evita perdas futuras, mas precisa mostrar ganho frente ao custo.',
  },
  {
    title: 'Atendimento',
    type: 'custo',
    description: 'Operacao humana e digital de suporte ao usuario final.',
    impact: 'Afeta experiencia do cliente e pode crescer rapidamente em periodos de incidentes.',
  },
  {
    title: 'Operacao',
    type: 'custo',
    description: 'Custos de campo, processamento, conciliacao e execucao operacional da bilhetagem.',
    impact: 'Tem efeito direto sobre eficiencia e sobre a sustentabilidade da operacao.',
  },
];

function normalizeHeader(header: string) {
  return header
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

function normalizeString(value: unknown) {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return '';
}

function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const normalized = trimmed.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatMonth(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split('-').map(Number);
  const monthLabel = shortMonthLabels[monthNumber - 1] ?? `${monthNumber}`.padStart(2, '0');
  return `${monthLabel}${String(year).slice(-2)}`;
}

function parseDateValue(value: unknown) {
  if (value instanceof Date) {
    return startOfMonth(value);
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const timestamp = value > 10_000_000 ? value : Math.round((value - 25569) * 86400 * 1000);
    return startOfMonth(new Date(timestamp));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const isoMonth = trimmed.match(/^(\d{4})[-/](\d{1,2})$/);
    if (isoMonth) {
      return new Date(Number(isoMonth[1]), Number(isoMonth[2]) - 1, 1);
    }

    const brMonth = trimmed.match(/^(\d{1,2})[-/](\d{4})$/);
    if (brMonth) {
      return new Date(Number(brMonth[2]), Number(brMonth[1]) - 1, 1);
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return startOfMonth(parsed);
    }
  }

  return null;
}

function normalizeType(value: unknown): FinancialEntryType | null {
  const normalized = normalizeHeader(normalizeString(value));

  if (['receita', 'revenue', 'receitas', 'income', 'entrada'].includes(normalized)) {
    return 'receita';
  }

  if (['custo', 'custos', 'cost', 'expense', 'despesa', 'despesas'].includes(normalized)) {
    return 'custo';
  }

  return null;
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toLowerCase()
    .replace(/^_+|_+$/g, '');
}

function getValue(row: Record<string, unknown>, aliases: readonly string[]) {
  for (const key of Object.keys(row)) {
    const normalizedKey = normalizeHeader(key);
    if (aliases.includes(normalizedKey as never)) {
      return row[key];
    }
  }

  return undefined;
}

function monthComparator(left: string, right: string) {
  return left.localeCompare(right);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: number[]) {
  return values.length ? sum(values) / values.length : 0;
}

function percentChange(previous: number, current: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

function movingAveragePrediction(values: number[], horizon: number, windowSize = 3) {
  const projection: number[] = [];
  const extended = [...values];

  for (let index = 0; index < horizon; index += 1) {
    const window = extended.slice(Math.max(0, extended.length - windowSize));
    const predicted = average(window);
    projection.push(predicted);
    extended.push(predicted);
  }

  return projection;
}

function linearTrendPrediction(values: number[], horizon: number) {
  const count = values.length;
  if (!count) {
    return Array.from({ length: horizon }, () => 0);
  }

  const xs = values.map((_, index) => index);
  const meanX = average(xs);
  const meanY = average(values);

  let numerator = 0;
  let denominator = 0;

  for (let index = 0; index < count; index += 1) {
    numerator += (xs[index] - meanX) * (values[index] - meanY);
    denominator += (xs[index] - meanX) ** 2;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;

  return Array.from({ length: horizon }, (_, offset) => intercept + slope * (count + offset));
}

function buildForecast(history: FinancialMonthlyPoint[], monthsAhead = 6) {
  const revenueHistory = history.map((point) => point.revenue);
  const costHistory = history.map((point) => point.cost);
  const revenueTrend = linearTrendPrediction(revenueHistory, monthsAhead);
  const costTrend = linearTrendPrediction(costHistory, monthsAhead);
  const revenueAverage = movingAveragePrediction(revenueHistory, monthsAhead);
  const costAverage = movingAveragePrediction(costHistory, monthsAhead);

  const lastMonth = history.at(-1)?.month ?? formatMonth(new Date());
  const [baseYear, baseMonth] = lastMonth.split('-').map(Number);

  return Array.from({ length: monthsAhead }, (_, index) => {
    const forecastDate = new Date(baseYear, baseMonth - 1 + index + 1, 1);
    const revenue = Math.max(0, revenueTrend[index] * 0.6 + revenueAverage[index] * 0.4);
    const cost = Math.max(0, costTrend[index] * 0.6 + costAverage[index] * 0.4);
    const margin = revenue - cost;

    return {
      month: formatMonth(forecastDate),
      monthLabel: formatMonthLabel(formatMonth(forecastDate)),
      revenue: Number(revenue.toFixed(0)),
      cost: Number(cost.toFixed(0)),
      margin: Number(margin.toFixed(0)),
      marginPct: revenue ? Number(((margin / revenue) * 100).toFixed(1)) : 0,
      phase: 'previsao' as const,
    };
  });
}

function aggregateMonthly(entries: FinancialEntry[]) {
  const grouped = new Map<string, { revenue: number; cost: number }>();

  for (const entry of entries) {
    const current = grouped.get(entry.month) ?? { revenue: 0, cost: 0 };

    if (entry.type === 'receita') {
      current.revenue += entry.value;
    } else {
      current.cost += entry.value;
    }

    grouped.set(entry.month, current);
  }

  return [...grouped.entries()]
    .sort((left, right) => monthComparator(left[0], right[0]))
    .map(([month, totals]) => {
      const margin = totals.revenue - totals.cost;

      return {
        month,
        monthLabel: formatMonthLabel(month),
        revenue: totals.revenue,
        cost: totals.cost,
        margin,
        marginPct: totals.revenue ? Number(((margin / totals.revenue) * 100).toFixed(1)) : 0,
        phase: 'historico' as const,
      };
    });
}

function buildRanking(entries: FinancialEntry[], type: FinancialEntryType): FinancialRankingItem[] {
  const grouped = new Map<string, number>();
  const filtered = entries.filter((entry) => entry.type === type);
  const total = sum(filtered.map((entry) => entry.value));

  for (const entry of filtered) {
    grouped.set(entry.category, (grouped.get(entry.category) ?? 0) + entry.value);
  }

  return [...grouped.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([category, value]) => ({
      category,
      value,
      share: total ? Number(((value / total) * 100).toFixed(1)) : 0,
    }));
}

function buildCostByCategoryChart(entries: FinancialEntry[]) {
  const costEntries = entries.filter((entry) => entry.type === 'custo');
  const categoryTotals = buildRanking(costEntries, 'custo').slice(0, 5);
  const categories = categoryTotals.map((item) => item.category);

  const grouped = new Map<string, Record<string, string | number>>();

  for (const entry of costEntries.filter((item) => categories.includes(item.category))) {
    const current = grouped.get(entry.month) ?? {
      month: entry.month,
      monthLabel: entry.monthLabel,
    };

    current[slugify(entry.category)] = Number(current[slugify(entry.category)] ?? 0) + entry.value;
    grouped.set(entry.month, current);
  }

  const data = [...grouped.values()].sort((left, right) =>
    monthComparator(String(left.month), String(right.month)),
  );

  const series: FinancialChartSeries[] = categories.map((category, index) => ({
    key: slugify(category),
    label: category,
    color: categoryPalette[index % categoryPalette.length],
  }));

  return {
    data,
    series,
  };
}

function buildKpis(history: FinancialMonthlyPoint[]): FinancialKpis {
  const revenueTotal = sum(history.map((point) => point.revenue));
  const costTotal = sum(history.map((point) => point.cost));
  const marginTotal = revenueTotal - costTotal;
  const previousMonth = history.at(-2);
  const lastMonth = history.at(-1);

  return {
    revenueTotal,
    costTotal,
    marginTotal,
    marginPct: revenueTotal ? Number(((marginTotal / revenueTotal) * 100).toFixed(1)) : 0,
    monthOverMonthGrowth: previousMonth && lastMonth ? Number(percentChange(previousMonth.revenue, lastMonth.revenue).toFixed(1)) : 0,
    monthsCritical: history.filter((point) => point.margin < 0).length,
  };
}

function buildInsights(entries: FinancialEntry[], history: FinancialMonthlyPoint[], forecast: FinancialMonthlyPoint[]) {
  const insights: FinancialInsight[] = [];
  const recentHistory = history.slice(-3);

  if (recentHistory.length === 3) {
    const firstCost = recentHistory[0].cost;
    const lastCost = recentHistory[2].cost;
    const costGrowth = percentChange(firstCost, lastCost);

    if (costGrowth >= 15) {
      insights.push({
        id: 'cost-growth',
        tone: 'warning',
        title: 'Crescimento acelerado de custos',
        description: `Os custos cresceram ${costGrowth.toFixed(1)}% nos ultimos 3 meses, sinalizando pressao relevante sobre a margem futura.`,
      });
    }

    const firstRevenue = recentHistory[0].revenue;
    const lastRevenue = recentHistory[2].revenue;
    const revenueChange = percentChange(firstRevenue, lastRevenue);

    if (revenueChange <= -8) {
      insights.push({
        id: 'revenue-drop',
        tone: 'danger',
        title: 'Queda de receita recente',
        description: `A receita caiu ${Math.abs(revenueChange).toFixed(1)}% nos ultimos 3 meses, o que pode comprometer o caixa projetado.`,
      });
    }
  }

  const negativeMargins = history.filter((point) => point.margin < 0);
  if (negativeMargins.length) {
    insights.push({
      id: 'negative-margin',
      tone: 'danger',
      title: 'Margens negativas identificadas',
      description: `${negativeMargins.length} mes(es) historicos fecharam com margem negativa, exigindo revisao de custos ou recomposicao de receita.`,
    });
  }

  const revenueRanking = buildRanking(entries, 'receita');
  const topRevenueShare = revenueRanking.slice(0, 2).reduce((total, item) => total + item.share, 0);
  if (topRevenueShare >= 70) {
    insights.push({
      id: 'revenue-concentration',
      tone: 'warning',
      title: 'Concentracao de receita',
      description: `${topRevenueShare.toFixed(1)}% da receita esta concentrada em apenas duas categorias, aumentando a exposicao a oscilacoes de demanda.`,
    });
  }

  const operationalCategories = ['infraestrutura', 'tecnologia', 'antifraude', 'atendimento', 'operacao'];
  const operationalCosts = entries.filter(
    (entry) => entry.type === 'custo' && operationalCategories.includes(slugify(entry.category)),
  );
  const groupedOperational = aggregateMonthly(operationalCosts);
  const recentOperational = groupedOperational.slice(-3);

  if (recentOperational.length === 3) {
    const operationalGrowth = percentChange(recentOperational[0].cost, recentOperational[2].cost);
    if (operationalGrowth >= 12) {
      insights.push({
        id: 'operational-costs',
        tone: 'warning',
        title: 'Aumento de custos operacionais',
        description: `Custos de infraestrutura, tecnologia, antifraude, atendimento e operacao cresceram ${operationalGrowth.toFixed(
          1,
        )}% nos ultimos 3 meses.`,
      });
    }
  }

  if (forecast.some((point) => point.margin < 0)) {
    insights.push({
      id: 'forecast-risk',
      tone: 'danger',
      title: 'Meses criticos na previsao',
      description: 'A projecao dos proximos 6 meses indica pelo menos um mes com margem negativa, sugerindo necessidade de acao preventiva.',
    });
  }

  if (!insights.length) {
    insights.push({
      id: 'healthy',
      tone: 'success',
      title: 'Cenario financeiro sob controle',
      description: 'No recorte atual, receita, custos e margem seguem em faixa saudavel, sem sinais criticos imediatos.',
    });
  }

  return insights;
}

export const demoFinancialRows: Record<string, unknown>[] = (() => {
  const months = [
    '2025-04',
    '2025-05',
    '2025-06',
    '2025-07',
    '2025-08',
    '2025-09',
    '2025-10',
    '2025-11',
    '2025-12',
    '2026-01',
    '2026-02',
    '2026-03',
  ];

  const rows: Record<string, unknown>[] = [];

  months.forEach((month, index) => {
    rows.push(
      { data: month, tipo: 'receita', categoria: 'Vale-transporte', valor: 1_180_000 + index * 16_000 },
      { data: month, tipo: 'receita', categoria: 'Recarga digital', valor: 390_000 + index * 12_000 },
      { data: month, tipo: 'receita', categoria: 'Taxas', valor: 126_000 + index * 4_500 },
      { data: month, tipo: 'receita', categoria: 'Float financeiro', valor: 84_000 + index * 2_400 },
      { data: month, tipo: 'custo', categoria: 'Infraestrutura', valor: 242_000 + index * 8_000 + (index >= 9 ? (index - 8) * 12_000 : 0) },
      { data: month, tipo: 'custo', categoria: 'Tecnologia', valor: 186_000 + index * 5_200 },
      { data: month, tipo: 'custo', categoria: 'Antifraude', valor: 104_000 + index * 3_600 },
      { data: month, tipo: 'custo', categoria: 'Atendimento', valor: 122_000 + index * 2_200 },
      { data: month, tipo: 'custo', categoria: 'Operacao', valor: 268_000 + index * 4_800 },
    );
  });

  rows.push(
    { data: '2026-02', tipo: 'receita', categoria: 'Recarga digital', subcategoria: 'Campanha suspensa', valor: -42_000 },
    { data: '2026-03', tipo: 'custo', categoria: 'Infraestrutura', subcategoria: 'Escala de capacidade', valor: 28_000 },
    { data: '2026-03', tipo: 'custo', categoria: 'Antifraude', subcategoria: 'Nova camada analitica', valor: 18_000 },
  );

  return rows;
})();

export function normalizeFinancialRows(rows: Record<string, unknown>[]) {
  const columnAliases = {
    date: ['data', 'data_mes', 'datames', 'mes', 'mesano', 'ano_mes', 'anomes', 'month', 'competencia', 'periodo', 'period'],
    type: ['tipo', 'type', 'natureza'],
    category: ['categoria', 'category', 'grupo'],
    subcategory: ['subcategoria', 'sub_category', 'subcategory', 'detalhe'],
    value: ['valor', 'value', 'montante', 'amount', 'total'],
  } as const;

  return rows
    .map((row, index) => {
      const dateValue = getValue(row, columnAliases.date);
      const parsedDate = parseDateValue(dateValue);
      const type = normalizeType(getValue(row, columnAliases.type));
      const category = normalizeString(getValue(row, columnAliases.category));
      const subcategory = normalizeString(getValue(row, columnAliases.subcategory));
      const value = toNumber(getValue(row, columnAliases.value));

      if (!parsedDate || !type || !category || value === null) {
        return null;
      }

      const month = formatMonth(parsedDate);

      return {
        id: `financial-${index + 1}`,
        date: parsedDate.toISOString(),
        month,
        monthLabel: formatMonthLabel(month),
        type,
        category,
        subcategory,
        value,
        raw: row,
      } satisfies FinancialEntry;
    })
    .filter((item): item is FinancialEntry => item !== null)
    .sort((left, right) => monthComparator(left.month, right.month));
}

export const demoFinancialEntries = normalizeFinancialRows(demoFinancialRows);

export function buildFinancialFilterOptions(entries: FinancialEntry[]): FinancialFilterOptions {
  const months = [...new Set(entries.map((entry) => entry.month))].sort(monthComparator);
  const categories = [...new Set(entries.map((entry) => entry.category))].sort((left, right) => left.localeCompare(right));

  return {
    months,
    categories,
    monthLabels: Object.fromEntries(months.map((month) => [month, formatMonthLabel(month)])),
  };
}

export function buildFinancialDashboard(entries: FinancialEntry[], filters: FinancialFilterState): FinancialDashboardData {
  const filteredEntries = entries.filter((entry) => {
    if (filters.type !== 'all' && entry.type !== filters.type) {
      return false;
    }

    if (filters.category !== 'all' && entry.category !== filters.category) {
      return false;
    }

    if (filters.startMonth !== 'all' && entry.month < filters.startMonth) {
      return false;
    }

    if (filters.endMonth !== 'all' && entry.month > filters.endMonth) {
      return false;
    }

    return true;
  });

  const history = aggregateMonthly(filteredEntries);
  const forecast = buildForecast(history);
  const combinedTimeline = [...history, ...forecast];
  const { data: costByCategoryChart, series: costSeries } = buildCostByCategoryChart(filteredEntries);
  const revenueCategoryBreakdown = buildRanking(filteredEntries, 'receita');
  const costCategoryBreakdown = buildRanking(filteredEntries, 'custo');
  const topRevenues = revenueCategoryBreakdown.slice(0, 5);
  const topCosts = costCategoryBreakdown.slice(0, 5);
  const insights = buildInsights(filteredEntries, history, forecast);
  const kpis = buildKpis(history);

  return {
    filteredEntries,
    history,
    forecast,
    combinedTimeline,
    costByCategoryChart,
    costSeries,
    revenueCategoryBreakdown,
    costCategoryBreakdown,
    topCosts,
    topRevenues,
    insights,
    indicatorInfo,
    kpis,
  };
}
