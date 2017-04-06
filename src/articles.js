const articles = [
     { id: 0, author:'Shoebanfoo', text:'How is article write?', comments:[]},
     { id: 1, author: 'Angry', text:"ARGARHRAGRHARAGH", comments:[]},
     { id: 2, author: 'Figmous Werbeunroy', text:"Ay carambas", comments:[]}
]

const index = (req, res) => {
     res.send({ hello: 'world' })
}

const getArticles = (req, res) => {
    res.send({ articles: articles.filter((article) => !req.params.id || article.id == req.params.id || article.author == req.params.id) })
}

const putArticles = (req, res) => {
     res.send({articles: articles[0]}) 
}

const postArticle = (req, res) => {
    if (!req.user) {
        req.user = "default user"
    }
     const newArticle = {
          id: articles.length + 1,
          author: req.user,
          text: req.body.text,
          comments:[]
     }
     articles.push(newArticle)
     res.send({articles: [newArticle]})
}

module.exports = app => {
    app.get('/', index)
    app.get('/articles/:id?', getArticles)
    app.put('/articles/:id', putArticles)
    app.post('/article', postArticle)
}