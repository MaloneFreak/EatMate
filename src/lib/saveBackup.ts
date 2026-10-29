import { backupFileName, buildBackup, markBackupDone, type BackupData } from '../data/backup';
import { downloadText, shareFile } from './share';

/**
 * Salva um backup pelo menu de compartilhar do celular (Google Drive, iCloud…) ou
 * baixando o arquivo. Usa os dados já carregados, sem ler o banco antes: o iPhone
 * só abre o menu de compartilhar logo depois do toque. Retorna `false` se a pessoa
 * fechou o menu sem escolher nada.
 */
export async function saveBackup(data: BackupData, via: 'share' | 'download'): Promise<boolean> {
  const name = backupFileName();
  const text = JSON.stringify(buildBackup(data), null, 2);
  const shared = via === 'share' ? await shareFile(name, text, 'application/json') : 'unsupported';
  if (shared === 'cancelled') return false;
  if (shared === 'unsupported') downloadText(name, text, 'application/json');
  await markBackupDone();
  return true;
}
