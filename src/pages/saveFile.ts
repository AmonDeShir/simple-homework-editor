import { remote, SaveDialogOptions } from 'electron';
import fs from 'fs';

const selectPlace = () => {
  const options: SaveDialogOptions = {
    message: 'Exportuj plik',
    properties: ['createDirectory'],
    buttonLabel: 'Gotowe',
    filters: [
      {
        name: 'pdf',
        extensions: ['pdf'],
      },
    ],
  };

  return remote.dialog.showSaveDialogSync(options);
};

export default function saveFile(data: string) {
  const path = selectPlace();

  if (path) {
    fs.writeFileSync(path, data);
  }
}
