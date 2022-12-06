const axios = require("axios")
const cheerio = require("cheerio")
const express = require("express")

const app = express()
const PORT = 8000
const baseURL = "https://madappgang.com/"

let allEmails = []

const request = async (url) => {
	return await axios({
		url: url,
		baseURL: baseURL,
		headers: {
			"accept-encoding": null,
		},
	})
}

const sortEmails = () => {
	return (allEmails = allEmails.filter((el, i, arr) => i === arr.indexOf(el)))
}

const scanPage = (url) => {
	try {
		return request(url).then((res) => {
			const html = res.data
			const $ = cheerio.load(html)
			const links = []

			$("a[href^=/]").each(function () {
				let link = $(this).attr("href")
				links.push(link)
			})
			$("a[href^=mailto:]").each(function () {
				let email = $(this).attr("href").replace("mailto:", "")
				allEmails.push(email)
			})

			return { links }
		})
	} catch (err) {
		console.log(err)
	}
}

scanPage().then(({ links }) => {
	links.map((link) => {
		scanPage(link)
	})
	sortEmails()
	console.log(allEmails)
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
