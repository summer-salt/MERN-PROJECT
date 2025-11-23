const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["admin", "organisation", "donar", "hospital"],
    },
  name: {
    type: String,
    required: function () {
      // name is required for donor and admin accounts
      if (this.role === "donar" || this.role === "admin") {
        return true;
      }
      return false;
    },
  },
    organisationName: {
      type: String,
      required: function () {
        if (this.role === "organisation") {
          return true;
        }
        return false;
      },
    },
    hospitalName: {
      type: String,
      required: function () {
        if (this.role === "hospital") {
          return true;
        }
        return false;
      },
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is requied"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [false, "address is required"],
    },
    phone: {
      type: Number,
      required: [true, "phone numbe is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);