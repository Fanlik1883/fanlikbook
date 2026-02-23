class FileStorage {
    constructor() {
        this.isCordova = !!window.cordova;
        this.storageType = this.isCordova ? 'file' : 'localStorage';
        console.log(`FileStorage initialized with type: ${this.storageType}`);
    }

    // Публичные методы
    WriteBook(id , text, isAppend = false) {
        let fileName=id + '.fb2'
        return this.isCordova
            ? this._writeCordova(fileName, text, isAppend)
            : this._writeBrowser(fileName, text, isAppend);
    }

    readBook(id) {
        let fileName=id + '.fb2'
        return this.isCordova
            ? this._readCordova(fileName)
            : this._readBrowser(fileName);
    }

    deleteBook(id) {
        let fileName=id + '.fb2'
        return this.isCordova
            ? this._deleteCordova(fileName)
            : this._deleteBrowser(fileName);
    }

    BookExists(id) {
        let fileName=id + '.fb2'
        return this.isCordova
            ? this._existsCordova(fileName)
            : this._existsBrowser(fileName);
    }

    // Приватные методы для Cordova
    _writeCordova(fileName, text, isAppend) {
        console.log("Сохранение файла на диске:", fileName);
        return new Promise((resolve, reject) => {
            try {
                window.resolveLocalFileSystemURL(
                    cordova.file.dataDirectory,
                    (dirEntry) => {
                        const dataObj = new Blob([text], { type: 'text/plain;charset=utf-8' });
                        dirEntry.getFile(
                            fileName,
                            { create: true, exclusive: false },
                            (fileEntry) => {
                                fileEntry.createWriter((fileWriter) => {
                                    fileWriter.onwriteend = () => {
                                        fileEntry.file((file) => {
                                            if (file.size !== dataObj.size) {
                                                console.warn(`[WRITE] File size mismatch: expected ${dataObj.size}, got ${file.size}`);
                                            }
                                            resolve(fileEntry);
                                        }, () => resolve(fileEntry));
                                    };
                                    fileWriter.onerror = reject;
                                    fileWriter.onabort = () => reject(new Error('Write aborted'));

                                    if (isAppend) {
                                        fileEntry.file((file) => {
                                            fileWriter.seek(file.size);
                                            fileWriter.write(dataObj);
                                        }, () => fileWriter.write(dataObj));
                                    } else {
                                        fileWriter.write(dataObj);
                                    }
                                }, reject);
                            }, reject);
                    }, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    _readCordova(fileName) {
        console.log("Чтение файла с диска:", fileName);
        return new Promise((resolve, reject) => {
            try {
                window.resolveLocalFileSystemURL(
                    cordova.file.dataDirectory,
                    (dirEntry) => {
                        dirEntry.getFile(
                            fileName,
                            { create: false },
                            (fileEntry) => {
                                fileEntry.file((file) => {
                                    const reader = new FileReader();
                                    reader.onload = (e) => resolve({
                                        text: e.target.result,
                                        fileEntry,
                                        fullPath: fileEntry.fullPath,
                                        size: file.size
                                    });
                                    reader.onerror = (e) => reject(e.target?.error || new Error('FileReader error'));
                                    reader.readAsText(file);
                                }, reject);
                            }, reject);
                    }, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    _deleteCordova(fileName) {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(
                cordova.file.dataDirectory,
                (dirEntry) => {
                    dirEntry.getFile(fileName, { create: false }, (fileEntry) => {
                        fileEntry.remove(resolve, reject);
                    }, reject);
                }, reject);
        });
    }

    _existsCordova(fileName) {
        return new Promise((resolve) => {
            window.resolveLocalFileSystemURL(
                cordova.file.dataDirectory,
                (dirEntry) => {
                    dirEntry.getFile(fileName, { create: false },
                        () => resolve(true),
                        () => resolve(false));
                }, () => resolve(false));
        });
    }

    // Приватные методы для браузера (localStorage)
    _getBrowserKey(fileName) {
        return 'file_' + fileName; // префикс для избежания конфликтов
    }

    _writeBrowser(fileName, text, isAppend) {
        console.log("Загрузка файла с браузере:");
        return new Promise((resolve, reject) => {
            try {
                const key = this._getBrowserKey(fileName);
                const existing = localStorage.getItem(key) || '';
                const newText = isAppend ? existing + text : text;

                // Предупреждение о возможном превышении лимита (5 МБ)
                const sizeMB = (newText.length * 2) / (1024 * 1024);
                if (sizeMB > 4) {
                    console.warn(`[WRITE] localStorage size may exceed limit (≈${sizeMB.toFixed(2)} MB).`);
                }

                localStorage.setItem(key, newText);
                resolve({
                    fullPath: fileName,
                    size: newText.length
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    _readBrowser(fileName) {
        console.log("Чтение файла с браузера:");
        return new Promise((resolve, reject) => {
            try {
                const key = this._getBrowserKey(fileName);
                const text = localStorage.getItem(key);
                if (text === null) {
                    reject(new Error(`File "${fileName}" not found in localStorage`));
                } else {
                    resolve({
                        text,
                        fileEntry: null,
                        fullPath: fileName,
                        size: text.length
                    });
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    _deleteBrowser(fileName) {
        return new Promise((resolve, reject) => {
            try {
                const key = this._getBrowserKey(fileName);
                localStorage.removeItem(key);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    _existsBrowser(fileName) {
        const key = this._getBrowserKey(fileName);
        return Promise.resolve(localStorage.getItem(key) !== null);
    }
}