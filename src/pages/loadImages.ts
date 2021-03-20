import { remote, OpenDialogOptions } from 'electron';
import fs from 'fs';

const loadImages = (onDoneCallback: (images: string[]) => void) => {
  const options: OpenDialogOptions = {
    message: 'Wybierz pliki sprawdzianu',
    properties: ['openFile', 'multiSelections'],
    buttonLabel: 'Gotowe',
    filters: [
      {
        name: 'Obrazy',
        extensions: ['jpg', 'jpeg', 'jpe', 'jfif', 'png', 'svg', 'webp'],
      },
    ],
  };

  const filePaths = remote.dialog.showOpenDialogSync(options);
  const images: string[] = [];

  filePaths?.forEach((path) => {
    const data = fs.readFileSync(path);
    const extensionName = path.split('.').pop();

    const base64Image = data.toString('base64');
    const image = `data:image/${extensionName};base64,${base64Image}`;

    images.push(image);
  });

  if (filePaths) {
    onDoneCallback(images);
  }
};

export default loadImages;
