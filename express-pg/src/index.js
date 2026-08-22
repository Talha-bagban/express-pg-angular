import { app } from "./app.js";
import http from "http";
import pool from "./config/db.js";
import {intializeSocket} from './socket/socket.js';

const server = http.createServer(app);

intializeSocket(server);

const PORT = process.env.PORT || 3001;

pool
  .query("SELECT 1")
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server is running on HTTP:Localhost: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connectioin failed: ", err);
  });

// export { pool, io };

// pool.connect()
// .then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server is running on HTTP:Localhost: ${PORT}`)
//     })
// }).catch((err) => {
//     console.error('DB connection failed:', err);
// })
