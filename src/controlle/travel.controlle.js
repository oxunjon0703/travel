const Io = require("../utils/Io");
const Travel = require("../module/Traver");
const Travels = new Io("./database/travel.json");
const Joi = require("joi");

const postFunc = async (req, res) => {
    try {
        const {name, price, date, duration} = req.body;

        const sxema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            date: Joi.date().required(),
            duration: Joi.number().required(),
        });

        const {error} = sxema.validate({name, price, date, duration});

        if(error) { 
            return res.status(400).json({message: error.message});
        } else {
            const travel = await Travels.read();

            const findUser = travel.find((user) => name === user.name);

            if (findUser){
                return res.status(409).json({message: "Travel already exists"});
            } else {
                  const id = (travel[travel.length - 1]?.id || 0) + 1;
                  const newTravel = new Travel(id, name, price, date, duration);
                  const data = travel.length ? [...travel, newTravel] : [newTravel];
                  await Travels.write(data);

                  res.status(200).json({message: "Success"});
            };
        };
    } catch(error) {
        res.status(400).json({message: error.message});
    };
};

const responsFunc = async (req, res) => {
    const arr = []
    try{
        const {price, duration} = req.body;

        const sxema = Joi.object({
            price: Joi.number().required(),
            duration: Joi.number().required(),
        })

        const {error} = sxema.validate({price, duration});
        if(error) { 
            return res.status(400).json({message: error.message});
        } else{
            const travel = await Travels.read();

            for(let i = 0; i < travel.length; i++) {

                if(+travel[i].price <= +price && +travel[i].duration <= +duration) {
                    arr.push(travel[i]);
                };
            };
            res.send(arr);
        };

    }catch(error) {
        res.status(400).json({message: error.message});
    };
};

module.exports = {
    postFunc,
    responsFunc,
};