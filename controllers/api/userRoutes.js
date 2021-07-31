// new user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
});

// logout
router.post('/logout', withAuth, (req, res) => {
    if(req.session.loggedIn) {
        req.sesssion.destroy(() => {
            res.sendStatus(200).end();
        });
    }
    else {
        res.sendStatus(401).end();
    }
});

// delete user
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.sendStatus(404)
            .json({ message: 'No user found' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        res.sendStatus(500)
        .json({ message: err });
    });
});

// user update
router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.sendStatus(404)
            .json({ message: 'No user found' });
            return;
        }
        res.json(dbUserData[0]);
    })
    .catch(err => {
        res.sendStatus(500)
        .json({ message: err });
    });
});

module.exports = router;