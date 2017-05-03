const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate PUT/headline', () => {

	it('should update Headline Message!', (done) => {

		const newHeadline = 'new test headline' + Math.random() * 10000
        const payload = {headline: newHeadline}

        fetch(url("/headline"), {
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT'
        })
        .then(res => {
			expect(res.status).to.eql(200)	
		})
		.then(res => {
			fetch(url("/headline"))
			.then(res => {
				expect(res.status).to.eql(200)
				return res.json()
			})
			.then(body => {
				expect(body['headline']).to.eql(newHeadline)
			})
			.then(done)
			.catch(done)
		})
		.catch(done)		
 	}, 500)
})