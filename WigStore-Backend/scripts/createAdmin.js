const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/user");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const adminEmail = process.argv[2] || process.env.ADMIN_EMAIL;
    const adminPasswordArg = process.argv[3];
    const adminPassword = adminPasswordArg || process.env.ADMIN_PASSWORD;

    if (!adminEmail) {
      console.error("Usage: node scripts/createAdmin.js <email> [password]");
      process.exit(1);
    }

    const user = await User.findOne({ email: adminEmail }).select("+password");

    if (user) {
      user.role = "admin";
      if (adminPasswordArg) {
        const passwordMatches = await user.matchPassword(adminPasswordArg);
        if (!passwordMatches) {
          user.password = adminPasswordArg;
          console.log("Updating password for existing admin user.");
        } else {
          console.log("Password is already correct for the user.");
        }
      }
      await user.save();
      console.log(`User ${adminEmail} has been promoted to admin.`);
    } else {
      if (!adminPassword) {
        console.error(
          `User ${adminEmail} does not exist. Provide a password to create a new admin user.`,
        );
        process.exit(1);
      }

      const newAdmin = new User({
        name: "Admin User",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        phone: "+2340000000000",
      });
      await newAdmin.save();
      console.log(`New admin user created: ${adminEmail}`);
    }

    const verifyUser = await User.findOne({ email: adminEmail }).select(
      "+password",
    );
    const isMatch = adminPasswordArg
      ? await verifyUser.matchPassword(adminPasswordArg)
      : true;

    if (isMatch) {
      console.log("✅ Admin credentials verified!");
      console.log(`   Email: ${adminEmail}`);
      if (adminPassword) console.log(`   Password: ${adminPassword}`);
      console.log(`   Role: ${verifyUser.role}`);
    } else {
      console.log("❌ Admin password verification failed");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
