import path from "path"
import fs from "fs/promises"

export const writeInkFile = async (code: string) => {
    let inkFile = path.join(__dirname, "polkadot", "lib.rs")
    await fs.writeFile(inkFile, code)
}

export const compileInkFile = async () => {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
        exec('pop build', { cwd: path.join(__dirname, 'polkadot') }, (error: any, stdout: any, stderr: any) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}
