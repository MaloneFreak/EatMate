import { afterEach, describe, expect, it, vi } from 'vitest';
import { canShareFiles, shareFile } from './share';

function mockShare(accepts: (file: File) => boolean, share: (data: ShareData) => Promise<void>) {
  Object.assign(navigator, {
    canShare: (data: ShareData) => (data.files ?? []).every(accepts),
    share: vi.fn(share),
  });
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'canShare');
  Reflect.deleteProperty(navigator, 'share');
});

describe('compartilhar arquivo', () => {
  it('sem menu de compartilhar, avisa para baixar o arquivo', async () => {
    expect(canShareFiles()).toBe(false);
    expect(await shareFile('backup.json', '{}', 'application/json')).toBe('unsupported');
  });

  it('manda como .txt quando o navegador recusa JSON (Chrome)', async () => {
    mockShare(
      (file) => file.type === 'text/plain',
      async () => {},
    );
    expect(canShareFiles()).toBe(true);
    expect(await shareFile('eatmate-backup-2026-10-29.json', '{}', 'application/json')).toBe(
      'shared',
    );
    const files = vi.mocked(navigator.share).mock.calls[0]![0]!.files!;
    expect(files.map((f) => f.name)).toEqual(['eatmate-backup-2026-10-29.txt']);
  });

  it('distingue quem fechou o menu de um erro', async () => {
    mockShare(
      () => true,
      () => Promise.reject(new DOMException('fechou', 'AbortError')),
    );
    expect(await shareFile('backup.json', '{}', 'application/json')).toBe('cancelled');
    mockShare(
      () => true,
      () => Promise.reject(new DOMException('sem toque', 'NotAllowedError')),
    );
    expect(await shareFile('backup.json', '{}', 'application/json')).toBe('unsupported');
  });
});
