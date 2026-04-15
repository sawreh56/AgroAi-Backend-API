import app from "./app";
import { dbConfig } from "./config/dbConfig";
import { config } from "./config/envConfig";

dbConfig();

app.listen(config.PORT,"0.0.0.0",()=>{
    console.log(`Server listen on port:${config.PORT}`)
})