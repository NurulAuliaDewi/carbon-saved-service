const db = require('../config/dbConnection');
const queries = require('./queries');
function handleError(res, err, customMessage = 'Server error') {
    console.error('Error executing query:', err);
    return res.status(500).json({
        status: 500,
        message: customMessage,
    });
}

// Get all athletes
module.exports.getAthletes = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const result = await db.query(queries.getAllAthletes, [limit, offset]);
        res.status(200).json({
            status: 200,
            message: 'Success get all athlete activities',
            data: result.rows
        });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports.getDataByPeriod = async (req, res) => {
    const period = req.query.period;  
    const validPeriods = ['day', 'month', 'year'];
    if (!validPeriods.includes(period)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid period. Please use "day", "month", or "year".'
        });
    }

    // Tentukan nama view berdasarkan period
    const viewName = `total_${period}`;
    console.log(viewName);
    let sqlQuery;

    if (period === 'day') {
        sqlQuery = `SELECT * FROM total_day_views;`;
        await db.query(sqlQuery);
    } else {
        sqlQuery = `SELECT * FROM ${viewName}`;
    }
    
    console.log(sqlQuery);

    try {
        // Eksekusi query
        const result = await db.query(sqlQuery);
        res.status(200).json({
            status: 200,
            message: `Success get data from ${viewName}`,
            data: result.rows
        });
        // console.log(result.rows);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({
            status: 500,
            message: 'Server error',
            error: err.message
        });
    }
};

module.exports.getDataAthleteByPeriod = async (req, res) => {
    const period = req.query.period;  
    const validPeriods = ['day', 'month', 'year'];
    if (!validPeriods.includes(period)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid period. Please use "day", "month", or "year".'
        });
    }
    const viewName = `total_athlete_${period}`;

    try {
        const sqlQuery = `SELECT * FROM ${viewName} ORDER BY total_carbon_saving DESC`;
        const result = await db.query(sqlQuery);

        res.status(200).json({
            status: 200,
            message: `Success get data from ${viewName}`,
            data: result.rows
        });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({
            status: 500,
            message: 'Server error',
            error: err.message
        });
    }
};


// get athlete by id
module.exports.getAthleteById = async (req, res) => {
    const { id_athlete } = req.params; 
    try {
        const result = await db.query(queries.getAthleteById, [id_athlete]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Athlete not found' });
        }
        res.status(200).json({
            status: 200,
            message: `Success get athlete with id ${id_athlete}`,
            data: result.rows
        });
    } catch (err) {
        handleError(res, err);
    }
};


// Search athlete by firstname
module.exports.searchAthleteByFirstName = async (req, res) => {
    const { term } = req.query; 
    try {
        const result = await db.query(queries.searchAthleteByFirstName, [`%${term}%`]);
        res.json({
            status: 200,
            message: `Success search athlete by firstname`,
            data: result.rows
        });
    } catch (err) {
        handleError(res, err);
    }
};
