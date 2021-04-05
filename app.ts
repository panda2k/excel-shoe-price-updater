import xlsx = require('xlsx')

import settings from './settings.json'

console.log(settings.sheetLocation)

const sheet = xlsx.readFile(settings.sheetLocation)

const sheetNames = sheet.Props?.SheetNames

if (sheetNames) {
    for (let i = 0; i < sheetNames.length; i++) {
        console.log(`Processhing Sheet ${sheetNames[i]}`)
        let nameRow: string|undefined
        let sizeRow: string|undefined
        let valueRow: string|undefined
        let payoutRow: string|undefined

        for (const [key, value] of Object.entries(sheet.Sheets[sheetNames[0]])) {
            if (value.v == 'Name') {
                nameRow = key
                console.log(`Name: ${nameRow}`)
            } else if (value.v == 'Size') {
                sizeRow = key
                console.log(`Size: ${sizeRow}`)
            } else if (value.v == 'Estimated Value') {
                valueRow = key
                console.log(`Value ${valueRow}`)
            } else if (value.v == 'Payout') {
                payoutRow = key
                console.log(`Payout: ${payoutRow}`)
            }
        }

        if (!nameRow) {
            console.log("Missing shoe name row. Make sure it is titled 'Name'")
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


    }
}
