const adminCollection = require("../models/adminSchema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const users = require("../models/userSchema");

const JWT_SECRET = "qpuEEAkckC40XDAhjQAKUpEbvvEWdoNf";
module.exports = {
    adminLogin: async (req, res) => {
        const { username, password } = req.body;
        console.log("admin", req.body);
        let admin = await adminCollection.findOne({ username: username });
        // console.log("admin username");
        if (!admin) {
            res.json({ error: "not found" });
        } else {
            if (password != admin.password) {
                res.json({ pswdError: "Incorrect epassword" });
            }
            if (password == admin.password) {
                // console.log("admin password");
                const token = jwt.sign({}, JWT_SECRET);
                res.json({ status: "ok", login: true, data: token, admin });
                console.log({ data: admin, token });
            }
        }
    },

    showUser: async (req, res) => {
        let userData = await users.find().toArray();
        if (!userData) {
            res.json({ error: "empty" });
        } else {
            res.json({ status: true, userData });
        }
    },

    

    addUser: async (req, res) => {
        const userData = req.body;
        const username = userData.username;
        console.log("new_user ", username);
        const existingUser = await users.findOne({ username: username });
        if (!existingUser) {
            users.insertOne(userData).then((data) => {
                console.log(data);
                res.json({ add: true });
            });
        } else {
            res.json({ error: "exist" });
        }
    },

    changeUser: async (req, res) => {
        const userData = req.body;
        const id = userData.id;
        const username = userData.username;
        // console.log(id,username);
        console.log("user_name ", username);
        const existingUser = await users.findOne({ username: username });
        if (!existingUser) {
            users.updateOne({ _id: new ObjectId(id) }, { $set: { username: username } }).then((data) => {
                console.log("updated_usename", req.body.username, data);
                res.json({ update: true, data });
            });
        } else {
            res.json({ error: "exist" });
        }
    },

    deleteUser: async (req, res) => {
        console.log("reqq--", req.body);
        let userid = req.body.id;
        console.log("deleted", userid);
        users.deleteOne({ _id: new ObjectId(userid) }).then(async (data) => {
            let details = await users.find().toArray();
            res.json({ delete: true, details });
        });
    },
};
