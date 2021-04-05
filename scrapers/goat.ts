import got from 'got'

const searchShoes = async(query: string) => {
    const { body } = await got.post(
        'https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.2.2)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.8.2)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a',
        {
            json: {
                "requests":[
                    {
                        "indexName":"product_variants_v2",
                        "params":`distinct=true&query=${encodeURIComponent(query)}&maxValuesPerFacet=10&page=0`
                    }
                ]
            },
            responseType: 'json',
        }
    )

    return Object(body).results[0].hits[0]
}

const getShoePrice = async(slug: string, size: number) => {
    const { body } = await got('https://www.goat.com/web-api/v1/product_variants', {
        searchParams: { productTemplateId: slug },
        responseType: 'json'
    })

    const data = Object(body)

    for (let i = 0; i < data.length; i++) {
        if (data[i].size == size && data[i].shoeCondition == 'new_no_defects' && data[i].boxCondition == 'good_condition') {
            return data[i].lowestPriceCents.amountUsdCents
        }
    }

    throw Error('Size not found')
}

export = {
    searchShoes,
    getShoePrice
}
