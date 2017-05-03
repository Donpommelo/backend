const Profile = require('./model.js').Profile
const Article = require('./model.js').Article

new Profile({
    username:"Default User",
    headline: 'eating dirt',
    email: 'argle@blargle.com',
    dob: 3/3/3333,
    zipcode: 24129,
    avatar: 'https://commons.wikimedia.org/wiki/File:Xenon_villan%C3%B3l%C3%A1mpa.JPG'
}).save()

new Profile({
    username:"Figmous Werbeurnruoy",
    headline: 'violence is not the answer',
    email: 'fwerb1@anchor.com',
    dob: 12/12/2590,
    zipcode: 12531,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/78/JRC-117_Rapid_Sakuma_Rail_Park_200907.jpg'
}).save()

new Profile({
    username:"Angry",
    headline: 'Ay Carambas',
    email: 'meep@mierp.com',
    dob: 1/1/1111,
    zipcode: 77479,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/62/983_Oslo._Utsikt_fra_Ekebergrestauranten_-_no-nb_digifoto_20151102_00016_bldsa_PK11910.jpg'
}).save()

new Profile({
    username:"Marcelle Moreau",
    headline: 'stop it',
    email: 'mierp@meep.com',
    dob: 2/2/2222,
    zipcode: 77452,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Foundation_framework_and_reinforcing_steel_for_150-ton_permanent_cableway_hoist_house_-_NARA_-_293811.jpg'
}).save()

new Article({ id: 0, author: 'Shoebanfoo', img: "", date: new Date().getTime(), text: 'How is article write?'}).save()
new Article({ id: 1, author: 'Angry', img: "", date: new Date().getTime(), text: 'ARGARHRAGRHARAGH'}).save()
new Article({ id: 2, author: 'Figmous Werbeunroy', img: "", date: new Date().getTime(), text: 'Ay carambas'}).save()
