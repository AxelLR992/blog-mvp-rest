import server from "./server";
import 'colorts/lib/string';

server.listen(server.get('port'));
console.log(".:: Blog MVP - REST APIs ::.".yellow);
console.log(`Server is working at port ${server.get('port')} in ${process.env.NODE_ENV} mode`.magenta);