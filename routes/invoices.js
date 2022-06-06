const express = require("express");
const ExpressError = require("../expressError")
let router = express.Router();
const db = require("../db");




router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM invoices`);
      // debugger;
      return res.json({ invoices: results.rows })
    } catch (e) {
      return next(e);
    }
  })

  router.get('/:id', async (req, res, next) => {
    try {
        // add 404 if not found
        const { id } = req.params
      const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
      // debugger;
      return res.json({ invoice: results.rows })
    } catch (e) {
      return next(e);
    }
  })

  router.post('/', async (req, res, next) => {
      try {
          const { id, comp_code, amt, paid, add_date, paid_date } = req.body;
          const results = await db.query("INSERT INTO invoices (id, comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, comp_code, amt, paid, add_date, paid_date",
          [id, comp_code, amt, paid, add_date, paid_date])
          return res.status(201).json( { invoice: results.rows[0]})


      } catch (e) {
          return next(e)

      }
  })

  router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const {  comp_code, amt, paid, add_date, paid_date } = req.body;
        const results = await db.query("UPDATE invoices SET id=$1, comp_code=$2, amt=$3, paid=$4, add_date=$5, paid_date=$6 WHERE id=$1 RETURNING id, comp_code, amt, paid, add_date, paid_date",
        [id, comp_code, amt, paid, add_date, paid_date])
        if (results.rows.length === 0) {
            throw new ExpressError(`Could Not Find invoice with if of: ${id}`, 404)
          }
        return res.status(201).json( { invoice: results.rows[0]})


    } catch (e) {
        return next(e)

    }
})

router.delete('/:id', async (req, res, next) => {
    try {
       const id = req.params.id;
       const found = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
       if (!found) {
        throw new ExpressError(`Could Not Find invoice with if of: ${id}`, 404)
      }
        const results = await db.query("DELETE FROM invoices WHERE id = $1", [id])
       
        return res.send({ msg: "DELETED!" })


    } catch (e) {
        return next(e)

    }
})



module.exports = router;