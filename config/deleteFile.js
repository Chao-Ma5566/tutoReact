import fs from 'fs/promises';
import path from 'path';

/* eslint-disable no-undef */
const deleteFile = async (fileName) => {
    const rootPath = process.cwd();
    const filePath = path.join(rootPath, 'public', 'img', fileName);
    try {
        await fs.unlink(filePath);
    } catch (e) {
        console.error(`Failed to delete image '${fileName}'`, e);
        throw e;
    }
};
export default deleteFile
/* eslint-disable no-undef */