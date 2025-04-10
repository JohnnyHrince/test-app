module.exports = db => {

    function calcTaxa(capacitate) {
      if (capacitate < 1500) return 50;
      if (capacitate >= 1500 && capacitate < 2000) return 100;
      return 200;
    }

    return {
      create: (req, res) => {
        const body = req.body;
        body.taxa = calcTaxa(body.capacitate);

        db.models.car.create(req.body)
        .then(() => res.send({ success: true }))
        .catch(() => res.status(401).send({ success: false }));
      },
  
      update: (req, res) => {
        const body = req.body;
        body.taxa = calcTaxa(body.capacitate);

        db.models.car.update(req.body, { where: { id: req.body.id } }).then(() => {
          res.send({ success: true })
        }).catch(() => res.status(401));
      },
  
      findAll: (req, res) => {
      db.query(`
        SELECT id, marca, model, an_fabricatie, capacitate, taxa
        FROM "car"
        ORDER BY id
      `, { type: db.QueryTypes.SELECT })
        .then(resp => res.send(resp))
        .catch(() => res.status(401).send({ success: false }));
    },
  
    find: (req, res) => {
      db.query(`
        SELECT id, marca, model, an_fabricatie, capacitate, taxa
        FROM "car"
        WHERE id = ${req.params.id}
      `, { type: db.QueryTypes.SELECT })
        .then(resp => res.send(resp[0]))
        .catch(() => res.status(401).send({ success: false }));
    },
  
    destroy: (req, res) => {
      db.query(`
        DELETE FROM "car"
        WHERE id = ${req.params.id}
      `, { type: db.QueryTypes.DELETE })
        .then(() => res.send({ success: true }))
        .catch(() => res.status(401).send({ success: false }));
    }
    };
  };
  