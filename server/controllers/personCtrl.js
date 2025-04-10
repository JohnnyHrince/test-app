module.exports = db => {

  function calculateAgeFromCNP(cnp) {
    if (!cnp || cnp.length < 7) return null;
  
    const genderCode = parseInt(cnp[0], 10);
    const year = parseInt(cnp.substring(1, 3), 10);
    const month = parseInt(cnp.substring(3, 5), 10);
    const day = parseInt(cnp.substring(5, 7), 10);
  
    let fullYear;
    if (genderCode === 1 || genderCode === 2) fullYear = 1900 + year;
    else if (genderCode === 3 || genderCode === 4) fullYear = 1800 + year;
    else if (genderCode === 5 || genderCode === 6) fullYear = 2000 + year;
    else return null;
  
    const birthDate = new Date(fullYear, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
  
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }

    return {
      create: async (req, res) => {
        try {
          const { full_name, cnp, carIds } = req.body;
          const age = calculateAgeFromCNP(cnp);
          const person = await db.models.person.create({ full_name, cnp, age });
  
          if (Array.isArray(carIds) && carIds.length > 0) {
            await person.setCars(carIds);
          }
  
          res.send({ success: true });
        } catch (err) {
          console.error(err);
          res.status(401).send({ success: false });
        }
      },
  
      update: async (req, res) => {
        try {
          const { id, full_name, cnp, carIds } = req.body;
          const age = calculateAgeFromCNP(cnp);
  
          const person = await db.models.person.findByPk(id);
          if (!person) return res.status(404).send({ success: false, message: 'Person not found' });
  
          await person.update({ full_name, cnp, age });
  
          // Update car associations
          if (Array.isArray(carIds)) {
            await person.setCars(carIds);
          }
  
          res.send({ success: true });
        } catch (err) {
          console.error(err);
          res.status(401).send({ success: false });
        }
      },
  
      findAll: async (req, res) => {
        try {
          const persons = await db.models.person.findAll({
            attributes: ['id', 'full_name', 'cnp', 'age'],
            include: [{
              model: db.models.car,
              attributes: ['marca', 'model', 'an_fabricatie', 'capacitate', 'taxa'],
              through: { attributes: [] } // This hides the junction table data
            }],
            order: [['id', 'ASC']]
          });
      
          res.send(persons);
        } catch (err) {
          console.error(err);
          res.status(401).send({ success: false });
        }
      },
  
      find: async (req, res) => {
        try {
          const person = await db.models.person.findByPk(req.params.id, {
            attributes: ['id', 'full_name', 'cnp', 'age'],
            include: {
              model: db.models.car,
              as: 'car',
              attributes: ['id']
            }
          });
  
          if (!person) return res.status(404).send({ success: false });
  
          const response = {
            ...person.toJSON(),
            carIds: person.cars.map(c => c.id)
          };
  
          res.send(response);
        } catch (err) {
          console.error(err);
          res.status(401).send({ success: false });
        }
      },
  
      destroy: async (req, res) => {
        try {
          const id = req.params.id;
          await db.models.person.destroy({ where: { id } });
          res.send({ success: true });
        } catch (err) {
          console.error(err);
          res.status(401).send({ success: false });
        }
      }
    };
  };
  