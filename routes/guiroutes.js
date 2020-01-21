const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const url = require('url');
const myUrl = new URL('http://localhost:5000/card/:bolen/:id/:a');
const passport = require('passport');



router.get('/card/:deck/:bol/:id/:wrongcount/:error', async (req, res) => {
    let error = req.params.error;
    let card;
    let deck = req.params.deck;
    let bol = req.params.bolen;
    let cardIndex = parseInt(req.params.id);
    let wrg_count = parseInt(req.params.wrongcount);
    let requestedQ = undefined;
    let requestedA = undefined;
    let currentId = undefined;
    try{
        card = await Card.find({ deck : deck });
        
        requestedQ = card[cardIndex].question;
        requestedA = card[cardIndex].answer;
        currentId = card[cardIndex]._id;        
        res.render('qanda', {
            question: requestedQ,
            answer: requestedA,
            count : cardIndex,
            tries: wrg_count,
            sectwo: deck,
            secthree: bol,
            currentId,
            error
        });
            
    }catch{
        if (card == null){
            res.redirect(`http://localhost:5000/card/${deck}`);
            console.log('Questions not found');
        }else{
            console.log('issue with gathering data');
        }
    }
        
    
});

router.get('/card', (req, res) => {
    res.render('card.ejs');
});

router.get('/card/deck', async (req, res) => {
    let card;
    let idlist = [];
    let nodup = [];
    let count = 0;
    let found = false;
    try{
        card = await Card.find();
        for(let i = 0; i < card.length; i++){
            console.log(card[i].deck);
            idlist.push(card[i].deck);
        }
        console.log(idlist);
        for( i = 0; i < idlist.length; i++){
            for( y = 0; y < nodup.length; y++){
                if(idlist[i] == nodup[y]){
                    console.log('orginal', idlist[i], 'checked', nodup[y]);
                    found = true;
                }
            }
            count++;
            if(count == 1  && found == false){
                nodup.push(idlist[i]);
                console.log('pushed data', idlist[i]);
            }
            count = 0;
            found = false;
        }
        console.log("new list");
        console.log('No Duplicates', nodup);
        res.render('deck.ejs',{
            deckname : nodup
        });
        console.log("Info gathered");
    }catch{
        if (card == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Questions not found');
        }else{
            console.log('issue with gathering data');
        }
    }
    console.log(card);
})



router.get('/gui', async (req, res) => {
    let card;
    try{
        card = await Card.find();
        res.render('gui.ejs',{
            alldata : card
        });
        console.log("Info gathered");
    }catch{
        if (card == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Questions not found');
        }else{
            console.log('issue with gathering data');
        }
    }
    console.log(card);
});
router.post('/gui', async (req, res) => {
    const {question, answer, deck} = req.body;
    let cards;
    //console.log(req.body);
    if(!question || !answer) {
        console.log("Please fill in all fields");
    }else{
        await Card.findOne({question: question})
        .then( async qa => {
            if(qa){
                console.log(("Question found in DB"))
            }else{
                const card = new Card({
                    question,
                    answer,
                    deck
                });
                await card.save();
                cards = await Card.find();
                res.render('gui.ejs',{
                    alldata : cards
                }); 
            }
        })
        
    }
    
});

router.get('/gui/edit', async (req, res) => {
    let cards;
    try{
        cards = await Card.find();
        res.render('edit.ejs',{
            choiceedit : cards
        });
    }catch{
        if (cards == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to change isiah');
        }else{
            console.log('another issue with gathering data');
        }
    }
});

router.get('/gui/edit/:cardid', async (req, res) => {
    console.log(req.params.cardid);
    let cardinfo = req.params.cardid;
    console.log(cardinfo);
    let card;
    try{
        console.log(cardinfo);
        card = await Card.findOne({ _id: cardinfo });
        console.log(card);
        let editQ = card.question;
        let editA = card.answer;
        let editD = card.deck;
        res.render('lastedit.ejs',{
            editQ,
            editA,
            editD,
            cardinfo
        });
    }catch{
        if (card == null){
            console.log(titty);
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to change 1');
        }else{
            console.log('another issue with gathering data');
        }
    }
    res.render('edit.ejs');
});

router.get('/gui/delete', async (req, res) => {
    let cards;
    try{
        cards = await Card.find();
        res.render('delete.ejs',{
            allinfo : cards
        });
    }catch{
        if (cards == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to select to delete isiah');
        }else{
            console.log('another issue with gathering data');
        }
    };
});


router.put('/gui/edit/:cardid', async (req, res) => {
    let card;
    let id = req.params.cardid;
    console.log(id);
    try{
        card = await Card.findOne({ _id: id });
        card.question = req.body.question;
        console.log(card.question);
        card.answer = req.body.answer;
        console.log(card.answer);
        card.deck = req.body.deck;
        console.log(card.deck);
        await card.save();
        console.log(card);
        res.redirect('http://localhost:5000/gui');
        console.log("Info changed");
    }catch{
        if (card == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to change 2');
        }else{
            console.log('another issue with updating');
        }
    }
});

router.get('/gui/delete/:deleteid', async (req, res) => {
    console.log(req.params.deleteid);
    let cardinfo = req.params.deleteid;
    console.log(cardinfo);
    let card;
    try{
        console.log(cardinfo);
        card = await Card.findOne({ _id: cardinfo });
        console.log(card);
        let editQ = card.question;
        let editA = card.answer;
        let editD = card.deck;
        res.render('lastdelete.ejs',{
            editQ,
            editA,
            editD,
            cardinfo
        });
    }catch{
        if (card == null){
            console.log(titty);
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to change 1');
        }else{
            console.log('another issue with gathering data');
        }
    }
})

router.delete('/gui/delete/:deleteid', async (req, res) => {
    let card;
    try{
        card = await Card.findOne({_id: req.params.deleteid});
        await card.remove();
        res.redirect('http://localhost:5000/gui');
        console.log("Info deleted");
    }catch{
        if (card == null){
            res.redirect('http://localhost:5000/gui');
            console.log('Question not found to delete');
        }else{
            console.log('another issue with updating');
        }
    }
});



module.exports = router;