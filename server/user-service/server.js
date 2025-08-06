const app = require("./app");
require("dotenv").config();
const {createServer} = require("http");

const PORT = process.env.PORT || 3002;

const httpServer = createServer(app);
httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

