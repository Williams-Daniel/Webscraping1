import express, { Application, Request, Response } from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import fs from "fs"
import path from "path"
import data from "./data/combined.json"
// import { json } from "express";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.listen(2289, () => {
  console.log("");
  console.log("Everything is working fine");
});


const legitScrape = async()=>{
    const accessBrowser = await puppeteer.launch({headless:false})
    try {
        const newTab = await accessBrowser.newPage()
        await newTab.goto("https://www.legit.ng/nigeria/",{waitUntil:"domcontentloaded"})

        await newTab.waitForTimeout(2000)

        const scroll = async()=>{
            await newTab.evaluate(()=>{
                window.scrollBy(0,window.innerHeight)
            })
        }

        for(let i:number = 0; i < 10; i++ ){
            scroll()
            await newTab.waitForTimeout(500)
        }

        
        const data = await newTab.evaluate(()=>{
            console.log("")
            const data = Array.from(document.querySelectorAll("article"))
            return data.map((props)=>({
                title:props.querySelector("span")?.textContent,
                img:props.querySelector("img")?.getAttribute("srcset"),
                url:props.querySelector("a")?.getAttribute("href"),
                time:(props.querySelector(".c-article-info__time")?.textContent)?.replace(/\s+/g," ")
            }))
        })
        console.log("")
        console.log("console.logging",data)

      const scrappedFile =   fs.writeFile(path.join(__dirname,"data","./scrappedData.json"),JSON.stringify(data),()=>{
            console.log("")
            console.log("Done moving file")
        })
        
       

    } catch (error) {
        console.log(error)
    }finally{
        await accessBrowser.close()
        console.log("Done scrapping data")
    }
}
// legitScrape()

const lindaScrape = async()=>{
    const accessBrowser = await puppeteer.launch({headless:false})
    try {
        const newPage = await accessBrowser.newPage()
        await newPage.goto("https://www.lindaikejisblog.com/",{waitUntil:"domcontentloaded"})

        await newPage.waitForTimeout(2000)

        const scroll = async()=>{
            await newPage.evaluate(()=>{
                window.scrollBy(0,window.innerHeight)
            })
        }

        for(let i = 0; i < 30; i++ ){
            scroll()
            await newPage.waitForTimeout(500)
        }

        const data = await newPage.evaluate(()=>{
            const data = Array.from(document.querySelectorAll("article"))
            return data.map((props)=>({
                title:(props.querySelector("h1")?.textContent)?.replace(/\s+/g," "),
                desc:(props.querySelector("p")?.textContent)?.replace(/\s+/g," "),
                img:props.querySelector("img")?.getAttribute("src"),
                url:props.querySelector("a")?.getAttribute("href"),
                date:props.querySelector("div.post_age")?.textContent,
                totalComment:(props.querySelector("div.comments")?.textContent)?.replace(/\s+/g," ")
            }))
        })
        console.log(data)

        fs.writeFile(path.join(__dirname,"data","./data.json"),JSON.stringify(data),()=>{
            console.log("")
            console.log("Done moving file")
        })
    } catch (error) {
        console.log(error)
    }finally{
        console.log("Done scrapping")
    }
}
// lindaScrape()

app.get("/",(req:Request,res:Response)=>{
    try {
        res.status(200).json({
            message:"gotten file successfully",
            myData: JSON.stringify(data)
        })
    } catch (error) {
        console.log(error)
    }
})


// body > div.main > div.board > div > div.row > div.col-md-9.main_board > div > div.col-md-12 > div:nth-child(56) > article > div.meta > div.comments

// body > div.main > div.board > div > div.row > div.col-md-9.main_board > div > div.col-md-12 > div:nth-child(58) > article > div.meta > div.post_age