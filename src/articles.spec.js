/*
 * Test suite for articles.js
 */
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate Article functionality', () => {

    const payload = { text:'argle blargle flargh' }

	it('should update add an Article!', (done) => {
		fetch(url("/articles"))
        .then(res => {
			expect(res.status).to.eql(200)
			return res.json()
		})
		.then(body => {
			const articleNum = body.length
			fetch(url("/article"), {
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
			})
			.then(res => {
				expect(res.status).to.eql(200)
				return res.json()
			})
			.then(body => {
				expect(body.articles[0].text == payload.text)
				fetch(url("/articles"))
				.then(res => {
					expect(res.status).to.eql(200)
					return res.json()
				})
				.then(body => {
					expect(body.length == articleNum + 1)
				})
				.then(done)
			})
		})
		.catch(done)
	});

});