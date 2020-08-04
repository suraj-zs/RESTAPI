const express = require('express'); //Import Express
const Joi = require('joi'); //Import Joi
const app = express();//Create Express Application on the app variable
app.use(express.json()); //used the json file

//Give data to the server
const customers = 
[
    {title: 'George', id: 1},
    {title: 'Josh', id: 2},
    {title: 'Tyler', id: 3},
    {title: 'Alice', id: 4},
    {title: 'Candice', id: 5}
]


const gettodo= async()=>{
    const res=await app.get('https://jsonplaceholder.typicode.com/todos',(req,res)=>{
   console.log(res);
    return res;
    });
     //console.log(res.json());

 
};

//Read Request Handlers
// Display the Message when the URL consist of '/'
app.get('/', async(req,res) => {
    
    res.send(await gettodo());
});
// Display the List of Customers when URL consists of api customers
app.get('/api/customers', (req,res) =>{
    res.send(customers);
});
// Display the information of Specific Customer when you mentioned the id.

    app.get('/api/customers/:id', (req,res) =>{
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    //If there is no valid customer ID, then display an error with the following
    if(!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
    res.send(customer);
});

//CREATE Request Handler
//Create New Customer Information
app.post('/api/customers', (req,res) => {
    const { error } = validateCustomer(req.body);
    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }
    //Increment the customer id
    const customer = {
        id: customers.length + 1,
        title: req.body.title
    };
    customers.push(customer);
    res.send(customer);
});

//Update Request Handler
// Update Existing Customer Information
app.put('/api/customers/:id', (req,res) => {
    const customer = customers.find(c=> c.id === parseInt(req.params.id));
    if(!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darked;">Not Found! </h2>');
    const { error } = validateCustomer(req.body);
    if(error){
        res.status(400).send (error.details[0].message);
        return;
    }
    customer.title = req.body.title;
    res.send(customer);
});

//Delete Request Handler
//Delete Customer Details
app.delete('/api/customers/:id', (req,res) => {
    const customer = customers.find(c=> c.id === parseInt(req.params.id));
    if(!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darked;">Not Found! </h2>');
    
    const index = customers.indexOf(customer);
    customers.splice(index,1);
    res.send(customer);
});
//validate Information
function validateCustomer(customer) {
    const schema = {
        title: Joi.string().min(3).required()
    };
    return Joi.validate(customer, schema);
}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
