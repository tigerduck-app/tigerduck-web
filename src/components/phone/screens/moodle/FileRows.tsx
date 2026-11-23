import type { MoodleFile } from '../../lib/demo';
import { fileSize } from '../../lib/format';
import type { IconName } from '../../ui/Icon';
import { Row } from '../../ui/controls';

function fileIcon(file: MoodleFile): IconName {
  const name = file.name.toLowerCase();
  if (file.mime === 'application/pdf' || name.endsWith('.pdf')) return 'filePdf';
  if (file.mime?.includes('zip') || name.endsWith('.zip')) return 'fileZip';
  if (/\.(docx?|pptx?|xlsx?)$/.test(name)) return 'fileDoc';
  return 'doc';
}

export function FileRows({ files }: { files: MoodleFile[] }) {
  return (
    <>
      {files.map((file) => (
        <Row key={file.name} icon={fileIcon(file)} title={file.name} value={fileSize(file.size)} />
      ))}
    </>
  );
}
