import xlsx = require('xlsx')
import scraper = require('./scrapers/goat')

import settings from './settings.json'

const sheet = xlsx.readFile(settings.sheetLocation)

const sheetNames = sheet.Props?.SheetNames;

(async() => {
    if (sheetNames) {
        for (let i = 0; i < sheetNames.length; i++) {
            console.log(`Processhing Sheet ${sheetNames[i]}`)
            let nameRow: string|undefined
            let sizeRow: string|undefined
            let valueRow: string|undefined
            let payoutRow: string|undefined
    
            for (const [key, value] of Object.entries(sheet.Sheets[sheetNames[i]])) {
                if (value.v == 'Shoe Name') {
                    nameRow = key
                } else if (value.v == 'Size') {
                    sizeRow = key
                } else if (value.v == 'Estimated Value') {
                    valueRow = key
                } else if (value.v == 'Payout') {
                    payoutRow = key
                }
            }
    
            if (!nameRow) {
                console.log("Missing shoe name row. Make sure it is titled 'Shoe Name'")
                break
            } else if (!sizeRow) {
                console.log("Missing shoe size row. Make sure it is named 'Size'")
                break
            } else if (!valueRow) {
                console.log("Missing estimated value row. Make sure it is named 'Estimated Value'")
                break
            } else if (!payoutRow) {
                console.log("Missing payout row. Make sure it is named 'Payout'")
                break
            }
    
            let currentRow: number
            const nameColumn = nameRow.replace(/[0-9]/, '')
    
            currentRow = parseInt(nameRow.replace(/[a-zA-Z]+/, '')) + 1
            
            const payoutColumn = payoutRow.replace(/[0-9]/, '')
            const sizeColumn = sizeRow.replace(/[0-9]/, '')
            const valueColumn = valueRow.replace(/[0-9]/, '')

            while (sheet.Sheets[sheetNames[i]][nameColumn + currentRow]) {
                console.log(sheet.Sheets[sheetNames[i]][nameColumn + currentRow].v)
    
                if (!sheet.Sheets[sheetNames[i]][payoutColumn + currentRow]) { // shoe hasnt been sold
                    const slug = (await scraper.searchShoes(sheet.Sheets[sheetNames[i]][nameColumn + currentRow].v)).slug
                    const price = await scraper.getShoePrice(slug, parseInt(sheet.Sheets[sheetNames[i]][sizeColumn + currentRow].v))

                    console.log(slug)
                    console.log(price)
                    sheet.Sheets[sheetNames[i]][valueColumn + currentRow].v = price / 100
                }
                currentRow++
            }
        }
        xlsx.writeFile(sheet, settings.sheetLocation)
        console.log(`Wrote file to ${settings.sheetLocation}`)
    }
})()


