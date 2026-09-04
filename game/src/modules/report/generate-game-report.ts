import type { GameStats } from '@/core/types/game'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}m ${sec}s`
}

export function generateGameReport(stats: GameStats, gameDurationMs: number): string {
  const date = new Date(stats.sessionDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const rankingRows = stats.playerRanking
    .map(
      (p, i) => `
      <tr>
        <td>${i + 1}º</td>
        <td>${escapeHtml(p.name)}</td>
        <td>${p.drinkCount}</td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Party It — Relatório</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0d1117;
      color: #e6edf3;
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 { font-size: 28px; font-weight: 700; color: #c084fc; margin-bottom: 4px; }
    .meta { font-size: 14px; color: #8b949e; margin-bottom: 24px; }
    .stats { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 10px;
      padding: 12px 16px;
      flex: 1;
      min-width: 100px;
    }
    .stat-label { font-size: 12px; color: #8b949e; margin-bottom: 4px; }
    .stat-value { font-size: 20px; font-weight: 700; color: #f0b429; }
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #e6edf3; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #21262d; }
    th { font-size: 12px; color: #8b949e; text-transform: uppercase; letter-spacing: 0.05em; }
    td:last-child { font-weight: 700; color: #f0b429; }
    tr:first-child td:last-child { color: #c084fc; }
    .footer { margin-top: 32px; font-size: 12px; color: #8b949e; text-align: center; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>Party It 🎉</h1>
  <p class="meta">${date}</p>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Duração</div>
      <div class="stat-value">${formatDuration(gameDurationMs)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total de doses</div>
      <div class="stat-value">${stats.totalDrinks}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Cartas</div>
      <div class="stat-value">${stats.cardCount}</div>
    </div>
    ${
      stats.mostDrawnCard
        ? `<div class="stat-card">
        <div class="stat-label">Carta mais sorteada</div>
        <div class="stat-value" style="font-size:14px">${escapeHtml(stats.mostDrawnCard.title)}</div>
      </div>`
        : ''
    }
  </div>

  <h2>Placar Final</h2>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Jogador</th>
        <th>Doses</th>
      </tr>
    </thead>
    <tbody>
      ${rankingRows}
    </tbody>
  </table>

  <p class="footer">Gerado pelo Party It 🎉</p>
</body>
</html>`
}
