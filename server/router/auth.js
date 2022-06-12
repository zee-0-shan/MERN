const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express")
const router = express.Router();

//import database and collection 
require("../db/conn")
const User = require("../model/userSchema")

router.get("/", (req, res) => {
    res.send(`hello homepage from router`)
})

//USING PROMISES
// router.post("/register",(req,res)=>{
//     const{name, email, phone, work ,password,cpassword}=req.body

//     if(!name|| !email || !phone || !work || !password || !cpassword){
//     return res.status(422).json({error: "please fill the required fields"})
//     }   

//     //first email is email of database, second email is email of form data
//     User.findOne({email:email})
//     .then((userExists)=>{
//         if(userExists){
//             return res.status(422).json({error:"Email already exists"})
//         }
//         const user = new User({name, email, phone, work ,password,cpassword});
//         user.save().then(()=>{
//             res.status(201).json({message:"user registered successfully"})
//         }).catch((err)=>{
//             res.status(500).json({message:"failed to register"})
//         })
//     }).catch((err)=>{console.log(err)})

// })

// USING ASYNC AWAIT
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, work, password, cpassword } = req.body;

        if (!name || !email || !phone || !work || !password || !cpassword) {
            return res.status(422).json({ error: "please fill the required fields" })
        }
        const UserExists = await User.findOne({ email: email })

        if (UserExists) {
            return res.status(422).json({ message: "email already Exists" })
        } else if (password != cpassword) {
            return res.status(422).json({ message: "password is not matching" })
        }

        // creating new instance of collection User
        const user = new User({ name, email, phone, work, password, cpassword });
        // before saving hash the passwords
        await user.save();
        res.status(201).json({ message: "User registered successfully" })

    } catch (error) {
        console.log(error)
    }
})

//Login route
router.post("/signIn", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email, !password) {
            res.status(400).json({ message: "fill all required fields" })
        }

        const userLogin = await User.findOne({ email: email })

        if (userLogin) {
            const passwordMatched = await bcrypt.compare(password, userLogin.password)

            //calling generateAuthToken function in every login
            const token=await userLogin.generateAuthToken();
            // console.log(`user token genrated ${token}`)
            res.cookie("jwtoken",token,{
                expires: new Date(Date.now()+25892000000),
                httpOnly:true
            })


            if (passwordMatched) {
                res.status(200).json({ message: "signIn successfully" })
            } else {
                res.status(400).json({ error: "Invalid Credentials" })
            }

        } else {
            res.status(400).json({ error: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
    }
})

module.exports = router