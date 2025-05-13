import { Role } from '@/types';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

dotenv.config();

async function createAdminUser() {
  try {
    console.log('Connecting to MongoDB...');
    const mongoUrl = process.env.MONGO_DB_URL;
    const dbName = process.env.MONGO_DB_NAME || 'elearning';

    if (!mongoUrl) {
      throw new Error('MONGO_DB_URL environment variable is not defined');
    }

    const maskedUrl = mongoUrl.replace(/(mongodb\+srv:\/\/|mongodb:\/\/)[^:]+:[^@]+@/, '$1*****:*****@');
    console.log('MongoDB connection URL (base):', maskedUrl);
    console.log('Will connect to database:', dbName);

    await mongoose.connect(mongoUrl, { dbName });
    console.log('Connected to MongoDB');

    const actualDbName = mongoose.connection.db.databaseName;
    console.log('Actual database name:', actualDbName);

    let UserModel;
    try {
      UserModel = mongoose.model('User');
    } catch (error) {
      const userSchema = new Schema(
        {
          first_name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 15,
            trim: true,
          },
          last_name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 15,
            trim: true,
          },
          email: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255,
            unique: true,
            lowercase: true,
            trim: true,
          },
          password: {
            type: String,
            trim: true,
            select: false,
          },
          role: { type: String, default: 'user', enum: Object.values(Role) },
          isGoogleAccount: { type: Boolean, default: false },
        },
        { timestamps: true }
      );

      userSchema.pre('save', async function (next) {
        if (this.isModified('password') && this.password) {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
        }
        next();
      });

      UserModel = mongoose.model('User', userSchema);
    }

    const adminExists = await UserModel.findOne({ role: Role.Admin });

    if (adminExists) {
      console.log('Admin account already exists');
      return;
    }

    const admin = new UserModel({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@elearning.com',
      password: 'Admin@123',
      role: Role.Admin,
    });

    await admin.save();
    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser();
