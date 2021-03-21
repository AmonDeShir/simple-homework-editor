import fs from 'fs';

type Callback = (images: string[]) => void;

function loadImages(filePaths: string[], onDoneCallback: Callback) {
  const images: string[] = [];

  filePaths.forEach((path) => {
    const data = fs.readFileSync(path);
    const extensionName = path.split('.').pop();

    const base64Image = data.toString('base64');
    const image = `data:image/${extensionName};base64,${base64Image}`;

    images.push(image);
  });

  onDoneCallback(images);
}

export default loadImages;
