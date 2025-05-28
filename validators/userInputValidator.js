const {z} = require('zod')

const userRegisterSchema = z.object({
  username: z.string({
    required_error: 'Username is required!', 
    invalid_type_error: 'Username must be a string', 
  }).nonempty('Username cannot be empty'), 

  password: z.string({
    required_error: 'Password is required!',
    invalid_type_error: 'Password must be a string',
  }).min(8, 'Password must be 8 characters long.'),

  email: z.string({
    required_error: 'Email is required!',
    invalid_type_error: 'Email must be a string',
  }).email('Please enter a valid email.')
});


const userLoginSchema = z.object({
  email:z.string({
    required_error:"Email is required!",
    invalid_type_error:"Email must be a string",
  }).email("Please enter a valid email"),
  password: z.string({
    required_error: 'Password is required!',
    invalid_type_error: 'Password must be a string',
  }).min(8, 'Password must be 8 characters long.'),
})


module.exports = {userRegisterSchema,userLoginSchema}