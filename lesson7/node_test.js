const fs = require('fs');

fs.readFile('./data.json', 'utf-8', (err, data) => {
    if (err) {
        throw Error('error reading file')
    }
    if (!err) {
        
        const obj = JSON.parse(data);
        console.log(obj);
        obj.third = 'THREE';

        fs.writeFile('./data.json', JSON.stringify(obj), (err) => {
            console.log(obj);
        })

    }
});