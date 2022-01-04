import config from './../infrastructure/config/typeorm/typeorm.config';
import fs = require('fs');

fs.writeFileSync('ormconfig.json', JSON.stringify(config, null, 2));
