const express = require("express");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};
const db = knex(knexConfig);

const server = express();
server.use(express.json());

const errors = {
  "19": "Another record with that value exists"
};

server.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await db("cohorts");
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get("/api/cohorts/:id", async (req, res) => {
  try {
    const found = await db("cohorts")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(found);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get("/api/cohorts/:id/students", async (req, res) => {
  try {
    const found = await db("students")
    .where({ cohort_id: req.params.id });
    res.status(200).json(found);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/api/cohorts", async (req, res) => {
  try {
    const [id] = await db("cohorts").insert(req.body);

    const addition = await db("cohorts")
      .where({ id })
      .first();

    res.status(201).json(addition);
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

server.put("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const updated = await db("cohorts")
        .where({ id: req.params.id })
        .first();

      res.status(200).json(updated);
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {}
});

server.delete("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {}
});

server.get("/students", async (req, res) => {
    try {
      const cohorts = await db("students");
      res.status(200).json(cohorts);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  server.get("/students/:id", async (req, res) => {
    try {
      const found = await db("students")
        .where({ id: req.params.id })
        .first();
      res.status(200).json(found);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  
  server.post("/students", async (req, res) => {
    try {
      const [id] = await db("students").insert(req.body);
  
      const addition = await db("students")
        .where({ id })
        .first();
  
      res.status(201).json(addition);
    } catch (error) {
      const message = errors[error.errno] || "We ran into an error";
      res.status(500).json({ message, error });
    }
  });
  
  server.put("/students/:id", async (req, res) => {
    try {
      const count = await db("students")
        .where({ id: req.params.id })
        .update(req.body);
  
      if (count > 0) {
        const updated = await db("students")
          .where({ id: req.params.id })
          .first();
  
        res.status(200).json(updated);
      } else {
        res.status(404).json({ message: "Records not found" });
      }
    } catch (error) {}
  });
  
  server.delete("/students/:id", async (req, res) => {
    try {
      const count = await db("students")
        .where({ id: req.params.id })
        .del();
  
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Records not found" });
      }
    } catch (error) {}
  });


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\nrunning on ${port}\n`));
