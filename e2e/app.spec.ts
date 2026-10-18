import { expect, test } from '@playwright/test';
import { importBackup, onboard, snap, writeDemoBackup } from './helpers';

test('primeiro acesso, registro, edição e exclusão de refeição', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Bem-vindo ao EatMate' })).toBeVisible();
  await snap(page, '01-boas-vindas');
  await onboard(page, 'Pedro Moreira');

  // O termômetro ainda está bloqueado.
  await expect(page.getByText('0 de 7 dias')).toBeVisible();
  await snap(page, '02-inicio-vazio');

  await page
    .getByRole('link', { name: /Registrar refeição/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Registrar refeição' })).toBeVisible();
  await page.getByRole('button', { name: 'Café da manhã' }).click();

  const input = page.getByRole('combobox', { name: 'O que você comeu?' });
  await input.fill('tomei café com leite e comi 2 torradas com manteiga');
  await input.press('Enter');
  const items = page.getByRole('list', { name: 'Itens da refeição' });
  await expect(items.getByText('Café com leite')).toBeVisible();
  await expect(items.getByText('Torrada', { exact: true })).toBeVisible();
  await expect(items.getByText('Manteiga')).toBeVisible();
  await expect(page.getByLabel('Quantidade de Torrada')).toHaveValue('2');

  // Autocompletar
  await input.fill('mam');
  await page.getByRole('option', { name: /Mamão/ }).click();
  await expect(items.getByText('Mamão')).toBeVisible();

  // Alimento desconhecido → classificar
  await input.fill('quitute da vovó');
  await input.press('Enter');
  await page.getByRole('button', { name: /Não reconhecido/ }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Doce ou sobremesa/ })
    .click();
  await expect(page.getByRole('button', { name: /Não reconhecido/ })).toHaveCount(0);
  await snap(page, '03-registro');

  await page.getByRole('button', { name: 'Salvar refeição' }).click();
  await expect(page.getByText('Café da manhã registrado!')).toBeVisible();
  await expect(page.getByText('1 de 7 dias')).toBeVisible();

  // Histórico → dia → editar
  await page.getByRole('link', { name: 'Histórico' }).click();
  await page.getByRole('link', { name: /Hoje/ }).click();
  await expect(page.getByText('Café com leite')).toBeVisible();
  await snap(page, '04-dia');
  await page.getByRole('link', { name: 'Editar Café da manhã' }).click();
  await page.getByRole('button', { name: 'Remover Manteiga' }).click();
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByText('Alterações salvas!')).toBeVisible();
  await expect(page.getByText('Manteiga')).toHaveCount(0);

  // O alimento classificado é reconhecido da próxima vez.
  await page.getByRole('link', { name: 'Adicionar refeição neste dia' }).click();
  await page.getByRole('combobox', { name: 'O que você comeu?' }).fill('quitute da vovó');
  await page.getByRole('combobox', { name: 'O que você comeu?' }).press('Enter');
  await expect(page.getByRole('button', { name: /Não reconhecido/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Voltar' }).click();

  // Excluir
  await page.getByRole('button', { name: 'Excluir Café da manhã' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Excluir' }).click();
  await expect(page.getByText('Nenhum registro neste dia')).toBeVisible();
});

test('termômetro, relatório semanal, desatualização e nova geração', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const backup = await writeDemoBackup(2);
  await onboard(page);
  await importBackup(page, backup.file);
  await snap(page, '05-perfil');

  // Termômetro liberado no início
  await page.getByRole('link', { name: 'Início' }).click();
  const thermometer = page.getByRole('link', { name: 'Ver relatório completo' });
  await expect(thermometer).toBeVisible();
  await expect(
    thermometer.getByRole('img', { name: /Termômetro: \d+ de 100 pontos, nota [A-E]/ }),
  ).toBeVisible();
  await snap(page, '06-inicio-termometro');

  // Relatório atual
  await thermometer.click();
  await expect(page.getByRole('heading', { name: 'Últimos 7 dias' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Diário alimentar completo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Marcadores de consumo' })).toBeVisible();
  await snap(page, '07-relatorio-atual');

  await page.getByRole('button', { name: 'Copiar para usar em uma IA' }).click();
  await expect(page.getByText(/Copiado!/)).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain('Sou Pedro');
  expect(clipboard).toContain('## Diário alimentar');

  // Histórico de relatórios: as duas semanas encerradas foram salvas automaticamente
  await page.getByRole('link', { name: 'Relatórios' }).click();
  const list = page.getByRole('list', { name: 'Relatórios salvos' });
  await expect(list.getByText('Semana 1')).toBeVisible();
  await expect(list.getByText('Semana 2')).toBeVisible();
  await expect(list.getByText('Desatualizado')).toHaveCount(0);
  await snap(page, '08-relatorios');

  // Editar um dia da Semana 2 deixa o relatório desatualizado
  await page.getByRole('link', { name: 'Histórico' }).click();
  await page.getByRole('link', { name: /Ontem/ }).click();
  await page.getByRole('link', { name: 'Editar Jantar' }).click();
  await page.getByRole('combobox', { name: 'O que você comeu?' }).fill('refrigerante');
  await page.getByRole('combobox', { name: 'O que você comeu?' }).press('Enter');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByText('Alterações salvas!')).toBeVisible();

  await page.getByRole('link', { name: 'Relatórios' }).click();
  await expect(list.getByText('Desatualizado')).toHaveCount(1);
  await list.getByRole('link', { name: /Semana 2/ }).click();
  await expect(page.getByText(/alterou registros deste período/)).toBeVisible();
  await snap(page, '09-relatorio-desatualizado');
  await page.getByRole('button', { name: 'Gerar novamente', exact: true }).click();
  await expect(page.getByText(/gerado novamente/)).toBeVisible();
  await expect(page.getByText(/alterou registros deste período/)).toHaveCount(0);

  // Excluir relatório
  await page.getByRole('button', { name: 'Excluir relatório' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Excluir relatório' }).click();
  await expect(page.getByRole('heading', { name: 'Relatórios' })).toBeVisible();
  await expect(list.getByText('Semana 2')).toHaveCount(0);
  await expect(list.getByText('Semana 1')).toBeVisible();

  // Excluído não volta sozinho
  await page.reload();
  await expect(
    page.getByRole('list', { name: 'Relatórios salvos' }).getByText('Semana 1'),
  ).toBeVisible();
  await expect(
    page.getByRole('list', { name: 'Relatórios salvos' }).getByText('Semana 2'),
  ).toHaveCount(0);
});

test('relatório de exemplo antes de completar 7 dias', async ({ page }) => {
  await onboard(page);
  await page.getByRole('link', { name: 'Ver um relatório de exemplo' }).click();
  await expect(page.getByText('Dados fictícios')).toBeVisible();
  await expect(page.getByRole('img', { name: /Termômetro/ })).toBeVisible();
  await snap(page, '10-exemplo');
});

test('exportar backup', async ({ page }) => {
  const backup = await writeDemoBackup(1);
  await onboard(page);
  await importBackup(page, backup.file);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar backup' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^eatmate-backup-\d{4}-\d{2}-\d{2}\.json$/);
  await expect(page.getByText('Último backup:')).not.toContainText('nunca');
});

test('restaurar backup na tela de boas-vindas (troca de celular)', async ({ page }) => {
  const backup = await writeDemoBackup(1);
  await page.goto('./');
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: /Restaurar backup/ }).click();
  await (await chooser).setFiles(backup.file);
  await expect(page.getByText(/Backup restaurado: 30 refeições/)).toBeVisible();
  // O backup de exemplo não tem nome: a pessoa continua o cadastro normalmente.
  await page.getByLabel('Como podemos te chamar?').fill('Ana');
  await page.getByRole('button', { name: 'Começar' }).click();
  await expect(page.getByRole('heading', { name: 'Olá, Ana!' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ver relatório completo' })).toBeVisible();
});

test('salvar uma refeição pelo cartão "Hoje" volta para o início', async ({ page }) => {
  await onboard(page);
  const home = page.getByRole('heading', { name: 'Olá, Pedro!' });
  const input = page.getByRole('combobox', { name: 'O que você comeu?' });

  await page.getByRole('link', { name: /Ceia/ }).click();
  await input.fill('chá de camomila');
  await input.press('Enter');
  await page.getByRole('button', { name: 'Salvar refeição' }).click();
  await expect(home).toBeVisible();
  await expect(page.getByText('Ceia registrado!')).toBeVisible();

  // Com a ceia já registrada, o mesmo cartão abre a edição.
  await page.getByRole('link', { name: /Ceia/ }).click();
  await input.fill('banana');
  await input.press('Enter');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(home).toBeVisible();
  await expect(page.getByText('Alterações salvas!')).toBeVisible();
});

test('salvar volta para o início mesmo quando o app abriu direto no formulário', async ({
  page,
}) => {
  await onboard(page);
  await page.goto('./#/registrar?refeicao=ceia');
  await page.reload();
  const input = page.getByRole('combobox', { name: 'O que você comeu?' });
  await input.fill('maçã');
  await input.press('Enter');
  await page.getByRole('button', { name: 'Salvar refeição' }).click();
  await expect(page.getByRole('heading', { name: 'Olá, Pedro!' })).toBeVisible();
});
