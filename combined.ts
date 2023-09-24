import data1 from "./data/data.json"
import data2 from "./data/scrappedData.json"
import fs from "fs"
import path from "path"

export const combined = ()=>{
const legit = data1
const linda:any = data2
const data = legit.concat(linda)
fs.writeFile(path.join(__dirname,"data","./combined.json"),JSON.stringify(data),()=>{
console.log("")
console.log("Done")
})
}

combined()