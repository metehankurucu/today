const storage = require('electron-json-storage');

class Theme {

    static setTheme = (theme) => {
        return new Promise((resolve,reject) => {
            storage.set('theme', theme, function(error) {
                if (error){
                    reject(error);
                } 
                resolve(true);
            });
        })
    }

    static getTheme = () => {
        return new Promise((resolve,reject) => {
            storage.get('theme', function(error, data) {
                if (error){
                    reject(error);
                } 
                resolve(data);
            });
        });
    }

}

module.exports = Theme;
